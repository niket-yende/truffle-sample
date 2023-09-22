const BasicCalculator = artifacts.require("BasicCalculator");

contract('BasicContract', async(accounts) => {
    let basicCalculator;

    before(async() => {
        basicCalculator = await BasicCalculator.deployed();
    });

    it('only owner can use the addValues method', async()=>{
        try {
            await basicCalculator.addValues(100, 230, {from: accounts[1]});
        } catch(error) {
            assert.include(error.message, 'Only owner', 'Only owner can execute this method');
        }
    });

    it('addition of 2 no.s must be correct', async() => {
        const result = await basicCalculator.addValues(15, 25);
        assert.equal(result, 40, "Addition result must be correct");
    });

    it('subtraction of 2 no.s must be correct', async() => {
        const result = await basicCalculator.subtractValues(15, 10);
        assert.equal(result, 5, "Subtraction result must be correct");
    });

    it('multiplication of 2 no.s must be correct', async() => {
        const result = await basicCalculator.multiplyValues(15, 10);
        assert.equal(result, 150, "Multiplication result must be correct");
    });

    it('division of 2 no.s must be correct', async() => {
        const result = await basicCalculator.divideValues(15, 10);
        assert.equal(result, 1, "Division result must be correct");
    });
});