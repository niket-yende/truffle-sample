const MultiToken = artifacts.require("MultiToken");

contract('MultiToken', async(accounts) => {
    let multiToken;

    before(async() => {
        multiToken = MultiToken.deployed();
    });

});