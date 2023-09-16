const { deployProxy } = require('@openzeppelin/truffle-upgrades');
const MultiToken = artifacts.require("MultiToken");

const metadataUri = process.env.MULTITOKEN_METADATA_URI;

/** Deploy contract using openzeppelin deployProxy, which will create a proxy address for you */
module.exports = async function(deployer, network, accounts) {
  // await deployer.deploy(MultiToken);
  await deployProxy(MultiToken, { deployer });

  const multiToken = await MultiToken.deployed();
  console.log('Deployed address: ', multiToken.address);

  const owner = await multiToken.owner();
  console.log(`owner: ${owner}`);
  
  await multiToken.setURI(metadataUri, { from: owner });
  
  console.log("MultiToken contract deployed and initialized.");
};
