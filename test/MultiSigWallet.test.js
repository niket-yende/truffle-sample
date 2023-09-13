const MultiSigWallet = artifacts.require("MultiSigWallet");

contract('MultiSigWallet', (accounts) => {
    let multiSigWallet;

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
        const receiverAddress = accounts[2];
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

});