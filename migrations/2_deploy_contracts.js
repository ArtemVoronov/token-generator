var SimpleERC20Token = artifacts.require("./SimpleERC20Token.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleERC20Token);
};
