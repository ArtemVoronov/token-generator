import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import SimpleERC20TokenWithTimeLock from "./contracts/SimpleERC20TokenWithTimeLock.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = {
    storageValue: 0,
    web3: null,
    accounts: null,
    contract: null,
    tokenGeneratorContract: null,
    balanceOfAccount0: null,
    balanceOfAccount1: null
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const deployedNetworkTokenGenerator = SimpleERC20TokenWithTimeLock.networks[networkId];
      const instance = new web3.eth.Contract(SimpleStorageContract.abi,deployedNetwork && deployedNetwork.address);
      const instanceTokenGenerator = new web3.eth.Contract(SimpleERC20TokenWithTimeLock.abi,deployedNetworkTokenGenerator && deployedNetworkTokenGenerator.address);

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance, tokenGeneratorContract: instanceTokenGenerator}, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, contract, tokenGeneratorContract } = this.state;

    // Stores a given value, 16 by default.
    // await contract.methods.set(16).send({ from: accounts[0] });
    console.log(tokenGeneratorContract);//todo clean

    // Get the value from the contract to prove it worked.
    // const response = await contract.methods.get().call();
    const balanceOfAccount0 = await tokenGeneratorContract.methods.balanceOf(accounts[0]).call();
    const balanceOfAccount1 = await tokenGeneratorContract.methods.balanceOf(accounts[1]).call();
    const owner = await tokenGeneratorContract.methods.owner().call();
    const totalSupply = await tokenGeneratorContract.methods.totalSupply().call();
    console.log("total supply:");
    console.log(totalSupply)

    // Update state with the result.
    // this.setState({ storageValue: response});
    this.setState({
      balanceOfAccount0: balanceOfAccount0,
      balanceOfAccount1: balanceOfAccount1,
      owner: owner,
      totalSupply: totalSupply
    });
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        {/*<div>*/}
        {/*  <h1>Good to Go!</h1>*/}
        {/*  <p>Your Truffle Box is installed and ready.</p>*/}
        {/*  <h2>Smart Contract Example</h2>*/}
        {/*  <p>*/}
        {/*    If your contracts compiled and migrated successfully, below will show*/}
        {/*    a stored value of 5 (by default).*/}
        {/*  </p>*/}
        {/*  <p>*/}
        {/*    Try changing the value stored on <strong>line 40</strong> of App.js.*/}
        {/*  </p>*/}
        {/*  <div>The stored value is: {this.state.storageValue}</div>*/}
        {/*</div>*/}
        <div>
          <h1>Token Generation example!</h1>
          {/*<label>User address</label>*/}
          {/*<br/>*/}
          {/*<input type="text"*/}
          {/*       value={this.state.transferToAddress}*/}
          {/*       onChange={(event) => {*/}
          {/*         this.setState({transferToAddress: event.target.value});*/}

          {/*       }}/>*/}
          <div>Transfer 1 token from account0 to account1</div>
          {/*<label>Transfer 1 token from {this.state.accounts[0]} to {this.state.accounts[1]}</label>*/}

          <br/>
          <button className="transferTokenButton" onClick={() => console.log(this.state.transferToAddress)}>Transfer 1 token </button>

          <br/>
          <div>Balance of account0: {this.state.balanceOfAccount0} tokens</div>
          <br/>
          <div>Balance of account1: {this.state.balanceOfAccount1} tokens</div>
          <br/>
          <div>Total supply: {this.state.totalSupply}</div>
          <br/>
          <div>Contract owner: {this.state.owner}</div>
          <br/>
          <div>Account0 address: {this.state.accounts[0]}</div>
          <br/>
          <div>Account1 address: {this.state.accounts[1]}</div>
        </div>
      </div>
    );
  }
}

export default App;
