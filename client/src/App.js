import React, { Component } from "react";
import SimpleERC20TokenWithTimeLock from "./contracts/SimpleERC20TokenWithTimeLock.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      web3: null,
      accounts: null,
      contract: null,
      balanceOfAccount0: null,
      balanceOfAccount1: null,
      lockTimeInMinutes: 20,
      showError: false,
      errorMessage: ""
    };
  }

  componentDidMount = async () => {
    let self = this;
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleERC20TokenWithTimeLock.networks[networkId];
      const instance = new web3.eth.Contract(SimpleERC20TokenWithTimeLock.abi,deployedNetwork && deployedNetwork.address);
      //TODO: initialize contract from Ropsten address

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      self.setState({ web3, accounts, contract: instance}, self.updateDebugInfo);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(`Failed to load web3, accounts, or contract. Check console for details.`);
      console.error(error);
    }
  };

  render() {
    let self = this;
    if (!self.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
        <div className="App">
          <div>
            <h1>Token generation with time lock example!</h1>
            <div>Transfer 1 token from account0 to account1</div>
            <br/>
            <button className="transferTokenButton" onClick={self.transferToken}>Transfer 1 token</button>
            <br/>
            {self.state.showError && (<div className="errorMessage">{self.state.errorMessage}</div>)}
            <br/>
            {self.renderDebugInfo()}
          </div>
        </div>
    );
  }

  renderDebugInfo = () => {
    let self = this;
    return (
        <div>
          <div>Balance of account0: {self.state.balanceOfAccount0} tokens</div>
          <br/>
          <div>Balance of account1: {self.state.balanceOfAccount1} tokens</div>
          <br/>
          <div>Total supply: {self.state.totalSupply} tokens</div>
          <br/>
          <div>Contract owner: {self.state.owner}</div>
          <br/>
          <div>Account0 address: {self.state.accounts[0]}</div>
          <br/>
          <div>Account1 address: {self.state.accounts[1]}</div>
          <br/>
          <div>Last token generation event date: {self.state.lastTokenGenerationEventDateTime}</div>
          <br/>
          <div>Next available token generation date: {self.state.nextAvailableTokenExtractionDateTime}</div>
          <br/>
          <button className="changeTimeLockButton" onClick={()=>self.changeTimeLockToOneMinute(1)}>Change time lock to 1 minute</button>
          <br/>
          <button className="changeTimeLockButton" onClick={()=>self.changeTimeLockToOneMinute(20)}>Change time lock to 20 minute</button>
        </div>
    );
  }

  transferToken = async () => {
    let self = this;
    const { accounts, contract } = self.state;
    try {
      await contract.methods.transfer(accounts[1], 100).send({ from: accounts[0] });
      setTimeout(self.updateDebugInfo, 1000);
      self.hideErrorMessage();
    } catch (error) {
      if (error.message.indexOf("TIME_LOCK_ERROR") !== -1) {
        self.showErrorMessage(`Please wait ${self.state.lockTimeInMinutes} minutes scince the last token generation event`)
        return;
      }
      console.error(error);
    }
  }

  showErrorMessage = (message) => {
    let self = this;
    self.setState({showError: true, errorMessage: message})
  }

  hideErrorMessage = () => {
    let self = this;
    self.setState({showError: false, errorMessage: "message"})
  }

  changeTimeLockToOneMinute = async (minutes) => {
    let self = this;
    const { accounts, contract } = self.state;
    self.hideErrorMessage();
    await contract.methods.changeLockTime(minutes).send({ from: accounts[0] }).then(function () {
      self.setState({lockTimeInMinutes: minutes}, self.updateDebugInfo);
    });
  }

  updateDebugInfo = async () => {
    let self = this;
    const { accounts, contract } = self.state;

    // Get the value from the contract to prove it worked.
    const balanceOfAccount0 = await contract.methods.balanceOf(accounts[0]).call();
    const balanceOfAccount1 = await contract.methods.balanceOf(accounts[1]).call();
    const decimals = await contract.methods.decimals().call();
    const owner = await contract.methods.owner().call();
    const totalSupply = await contract.methods.totalSupply().call();
    const lastTokenGenerationEventDateTime = await contract .methods.getLastTokenGenerationDateTime().call();

    // Update state with the result.
    self.setState({
      lastTokenGenerationEventDateTime: new Date(lastTokenGenerationEventDateTime*1000).toLocaleString(),
      nextAvailableTokenExtractionDateTime: new Date(lastTokenGenerationEventDateTime*1000 + self.state.lockTimeInMinutes*60*1000).toLocaleString(),
      balanceOfAccount0: balanceOfAccount0 / Math.pow(10, decimals),
      balanceOfAccount1: balanceOfAccount1 / Math.pow(10, decimals),
      owner: owner,
      totalSupply: totalSupply / Math.pow(10, decimals)
    });
  };
}

export default App;
