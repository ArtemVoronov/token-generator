var SimpleERC20TokenWithTimeLock = artifacts.require("./SimpleERC20TokenWithTimeLock.sol");
var SimpleStorage = artifacts.require("./SimpleStorage.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleERC20TokenWithTimeLock);
  deployer.deploy(SimpleStorage);
};
