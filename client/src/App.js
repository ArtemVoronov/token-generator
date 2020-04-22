import React, { Component } from "react";
import SimpleERC20TokenWithTimeLock from "./contracts/SimpleERC20TokenWithTimeLock.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = {
    web3: null,
    accounts: null,
    contract: null,
    balanceOfAccount0: null,
    balanceOfAccount1: null,
    lockTimeInMinutes: 20
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleERC20TokenWithTimeLock.networks[networkId];
      const instance = new web3.eth.Contract(SimpleERC20TokenWithTimeLock.abi,deployedNetwork && deployedNetwork.address);

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance}, this.updateState);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(`Failed to load web3, accounts, or contract. Check console for details.`);
      console.error(error);
    }
  };

  transferToken = async () => {
    console.log("transferToken!")
    const { accounts, contract } = this.state;
    await contract.methods.transfer(accounts[1], 100).send({ from: accounts[0] });

    setTimeout(this.updateState, 1000);
  }

  changeTimeLockToOneMinute = async (minutes) => {
    console.log("changeTimeLockToOneMinute!")
    const { accounts, contract } = this.state;
    await contract.methods.changeLockTime(minutes).send({ from: accounts[0] });
    this.setState({lockTimeInMinutes: minutes});
    setTimeout(this.updateState, 1000);
  }

  updateState = async () => {
    console.log("transferToken!")
    const { accounts, contract } = this.state;

    // Stores a given value, 16 by default.
    // await contract.methods.set(16).send({ from: accounts[0] });
    // console.log(tokenGeneratorContract);//todo clean

    // Get the value from the contract to prove it worked.
    const balanceOfAccount0 = await contract.methods.balanceOf(accounts[0]).call();
    const balanceOfAccount1 = await contract.methods.balanceOf(accounts[1]).call();
    const owner = await contract.methods.owner().call();
    const totalSupply = await contract.methods.totalSupply().call();
    const lastTokenGenerationEventDateTime = await contract .methods.getLastTokenGenerationDateTime().call();

    console.log("lastTokenGenerationEventDateTime:");//todo clean
    console.log(lastTokenGenerationEventDateTime);//todo clean
    console.log("converted:");//todo clean
    console.log(new Date(lastTokenGenerationEventDateTime*1000).toISOString());//todo clean

    // Update state with the result.
    this.setState({
      lastTokenGenerationEventDateTime: new Date(lastTokenGenerationEventDateTime*1000).toLocaleString(),
      nextAvailableTokenExtractionDateTime: new Date(lastTokenGenerationEventDateTime*1000 + this.state.lockTimeInMinutes*60*1000).toLocaleString(),
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

          <br/>
          <button className="transferTokenButton" onClick={this.transferToken}>Transfer 1 token </button>

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
          <br/>
          <div>Last token generation event date: {this.state.lastTokenGenerationEventDateTime}</div>
          <br/>
          <div>Next available token generation date: {this.state.nextAvailableTokenExtractionDateTime}</div>
          <br/>
          <button className="changeTimeLockButton" onClick={()=>this.changeTimeLockToOneMinute(1)}>Change time lock to 1 minute</button>
          <br/>
          <button className="changeTimeLockButton" onClick={()=>this.changeTimeLockToOneMinute(20)}>Change time lock to 20 minute</button>
        </div>
      </div>
    );
  }
}

export default App;
