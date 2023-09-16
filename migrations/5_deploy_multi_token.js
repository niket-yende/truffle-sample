const MultiToken = artifacts.require("MultiToken");

module.exports = async function(deployer, network, accounts) {
  await deployer.deploy(MultiToken);

  const multiToken = await MultiToken.deployed();
  console.log('Deployed address: ', multiToken.address);
};
