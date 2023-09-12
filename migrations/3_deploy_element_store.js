const ElementStore = artifacts.require("ElementStore");

module.exports = function(deployer) {
  deployer.deploy(ElementStore);
};
