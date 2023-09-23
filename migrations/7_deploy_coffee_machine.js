const CoffeeMachine = artifacts.require("CoffeeMachine");

module.exports = async function(deployer) {
  await deployer.deploy(CoffeeMachine);

  const coffeeMachine = await CoffeeMachine.deployed();
  console.log('Coffee machine contract address: ', coffeeMachine.address);
}