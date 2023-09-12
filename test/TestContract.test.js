const TestContract = artifacts.require("TestContract");

contract('TestContract', (accounts) => {
    let testContract;

    before(async() => {
        testContract = await TestContract.deployed();
    });

    it('initial balance must be 0', async() =>{
        const balance = await testContract.getBalance();
        assert.equal(balance, 0, 'The initial balance must be 0');
    });

    it('set balance to 1000', async() => {
        await testContract.setBalance(1000);
        const balance = await testContract.getBalance();
        assert.equal(balance, 1000, 'Set balance must be 1000');
    });

    it('set balance must be called by owner', async() => {
        try {
            await testContract.setBalance(10, {from: accounts[1]});
        } catch(error) {
            assert.include(error.message, 'Not an owner', 'The method setBalance can only be call by owner'); 
        }
    });

    it('check if the getView output is correct', async() => {
        const outputHex = await testContract.getView();
        const processedOutput = web3.utils.hexToAscii(outputHex);
        // const stringToHex = web3.utils.utf8ToHex('This is a test view');
        assert.include(processedOutput, 'This is a test view', 'The getView method must return correct output');
    });
});