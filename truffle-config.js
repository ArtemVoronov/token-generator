const path = require("path");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const mnemonic = process.env.MNEMONIC;//Be sure that you set mnemonic as evnironment variable


module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "5777"
    },
    ropsten: {
      provider: () => new HDWalletProvider(mnemonic, "https://ropsten.infura.io/v3/bc6a00a6f9f94425944aef64e230c90a"),
      network_id: '3'
    }
  },
  compilers: {
    solc: {
      version: "0.5.16"
    }
  }
};
