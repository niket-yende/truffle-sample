const CoffeeMachine = artifacts.require("CoffeeMachine");

contract('CoffeeMachine', async(accounts) => {
    let coffeeMachine;

    before(async() => {
        coffeeMachine = await CoffeeMachine.deployed();
    });

    it('only owner can set the init properties', async() => {
        try {
            await coffeeMachine.init(20, 30, 50, {from: accounts[1]});
        } catch(error) {
            assert.include(error.message, 'Only owner can invoke!', 'Owner must set the init properties');
        }
    });

    it('owner should be able to set the init properties', async() => {
        // Set init properties
        await coffeeMachine.init(20, 30, 80);

        const milkUnitPrice = await coffeeMachine.milkUnitPrice();
        const concUnitPrice = await coffeeMachine.concUnitPrice();
        const cupPrice = await coffeeMachine.cupPrice();

        assert.equal(milkUnitPrice, 20, 'Unit price of milk must be 20');
        assert.equal(concUnitPrice, 30, 'Unit price of conc must be 30');
        assert.equal(cupPrice, 80, 'Cup price of conc must be 80');
    });

    it('check price of buying a coffee cup', async() => {
        // Customer purchases a coffee cup
        const totalBill = await coffeeMachine.buyCoffee(60, 40, false, {from: accounts[1]});
        assert.equal(totalBill, 2480, 'Total calculated bill must be correct');
    });

    it('check price of buying a coffee refill', async() => {
        // Customer purchases a coffee refill
        const totalBill = await coffeeMachine.buyCoffee(60, 40, true, {from: accounts[1]});
        assert.equal(totalBill, 2400, 'Total calculated bill must be correct');
    });

    it('check if the customer orders with correct quantities', async() => {
        try {
            await coffeeMachine.buyCoffee(60, 60, false, {from: accounts[1]});
        } catch(error) {
            assert.include(error.message, 'Total quantities must be within the limit', 'Total quantities must add up to 100');
        }
    });
});