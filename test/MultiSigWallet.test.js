const MultiSigWallet = artifacts.require("MultiSigWallet");

contract('MultiSigWallet', (accounts) => {
    let multiSigWallet;
    const receiverAddress = accounts[2];

    before(async() => {
        multiSigWallet = await MultiSigWallet.deployed();
    });
    
    it('submit transaction from an unauthorized account', async() => {
        try {
            await multiSigWallet.submitTransaction(accounts[0], {from: accounts[5]});
        } catch(error) {
            assert.include(error.message, 'Owner required', 'Owner required for submitting transaction');    
        }
    });

    it('receiver cannot be an invalid account', async() => {
        try {
            // Create a variable for the 0x address
            const zeroAddress = "0x0000000000000000000000000000000000000000";
            await multiSigWallet.submitTransaction(zeroAddress);
        } catch(error) {
            assert.include(error.message, 'Invalid receiver address', 'Provide valid receiver address for submitting transaction');    
        }
    });

    it('submit transaction requires ethers', async() => {
        try {
            // const etherValue = web3.utils.toWei('1', 'ether'); // Sending 1 ether
            await multiSigWallet.submitTransaction(accounts[2], {from: accounts[0], value: 0});
        } catch(error) {
            assert.include(error.message, 'Transfer amount has to be greater than 0', 'Provide ethers for submitting transaction');    
        }
    });

    it('submit transaction success case', async() => {
        const etherValue = web3.utils.toWei('1', 'ether'); // Sending 1 ether
        const senderAddress = accounts[0];
        await multiSigWallet.submitTransaction(receiverAddress, {from: senderAddress, value: etherValue});

        // Retrieve the emitted events
        const events = await multiSigWallet.getPastEvents("TransactionSubmitted", {
            fromBlock: 0,
            toBlock: "latest",
        });

        const latestEvent = events[events.length - 1];
        const result = latestEvent.returnValues;
        
        assert.equal(result._transactionId, '1', 'Transaction id must be incremened to 1');
        assert.equal(result._amount, etherValue, 'Amount of ether should be 1');
        assert.equal(result._sender, senderAddress, 'Sender address must match in the event');
        assert.equal(result._receiver, receiverAddress, 'Receiver address must match in the event');
    });

    it('confirm transaction from an unauthorized account', async() => {
        try {
            await multiSigWallet.confirmTransaction(1, {from: accounts[5]});
        } catch(error) {
            assert.include(error.message, 'Owner required', 'Owner required for submitting transaction');    
        }
    });

    it('check for invalid transactionId while confirming transaction', async() => {
        try {
            await multiSigWallet.confirmTransaction(5);
        } catch(error) {
            assert.include(error.message, 'Invalid transaction id', 'Provide a valid transaction id');
        }
    });

    it('confirm transaction success case', async() => {
        await multiSigWallet.confirmTransaction(1);

        // Retrieve the emitted events
        const events = await multiSigWallet.getPastEvents("TransactionConfirmed", {
            fromBlock: 0,
            toBlock: "latest",
        });

        const latestEvent = events[events.length - 1];
        const result = latestEvent.returnValues;
        
        assert.equal(result._transactionId, '1', 'Transaction id must be 1');
    });

    it('check for invalid transactionId while confirming transaction', async() => {
        try {
            await multiSigWallet.confirmTransaction(1);
        } catch(error) {
            assert.include(error.message, 'Already confirmed by the owner', 'Transaction already confirmed by the owner');
        }
    });

    it('execute transaction from an unauthorized account', async() => {
        try {
            await multiSigWallet.executeTransaction(1, {from: accounts[5]});
        } catch(error) {
            assert.include(error.message, 'Owner required', 'Owner required for submitting transaction');    
        }
    });

    it('check for invalid transactionId while executing transaction', async() => {
        try {
            await multiSigWallet.executeTransaction(5);
        } catch(error) {
            assert.include(error.message, 'Invalid transaction id', 'Provide a valid transaction id');
        }
    });

    it('check for required confirmations while executing transaction', async() => {
        try {
            await multiSigWallet.executeTransaction(1);
        } catch(error) {
            assert.include(error.message, 'Required confirmations not attained', 'Provide required confirmations for executing transaction');
        }
    });

    it('execute transaction success case', async() => {
        // Confirming the transaction from other owners
        await multiSigWallet.confirmTransaction(1, {from: accounts[1]});
        await multiSigWallet.confirmTransaction(1, {from: accounts[2]});

        // Execute transaction after receiving required confirmations
        await multiSigWallet.executeTransaction(1);
        
        // Retrieve the emitted events
        const events = await multiSigWallet.getPastEvents("TransactionExecuted", {
            fromBlock: 0,
            toBlock: "latest",
        });

        const latestEvent = events[events.length - 1];
        const result = latestEvent.returnValues;
        
        assert.equal(result._transactionId, '1', 'Transaction id must be 1');
    });

    it('check if the transaction is already executed', async() => {
        try {
            await multiSigWallet.executeTransaction(1);
        } catch(error) {
            assert.include(error.message, 'Transaction is already executed', 'Transaction has been already executed');
        }
    });

    it('receiver account balance must be greater than 100', async() => {
        const balanceInWei = await web3.eth.getBalance(receiverAddress);
        // Convert the balance from Wei to Ether
        const ethBalance = await web3.utils.fromWei(balanceInWei, 'ether');
        assert(ethBalance > 100, 'Receiver must have balance greater than 100');
    });
});