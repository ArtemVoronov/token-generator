var SimpleERC20TokenWithTimeLock = artifacts.require("./SimpleERC20TokenWithTimeLock.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleERC20TokenWithTimeLock);
};
