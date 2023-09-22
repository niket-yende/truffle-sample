const BasicCalculator = artifacts.require("BasicCalculator");

module.exports = async function(deployer) {
  await deployer.deploy(BasicCalculator);

  const basicCalculator = BasicCalculator.deployed();
  console.log('Basic calculator contract address: ', basicCalculator.address);
}