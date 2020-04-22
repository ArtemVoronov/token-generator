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
      balanceOfUserAccount: null,
      lockTimeInMinutes: 20,
      showError: false,
      debugInfoLoaded: false,
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
      // const networkIdW = await web3.eth.net.getId();//TODO: should it be like that ot hardcoded?
      const networkId = "3";
      const deployedNetwork = SimpleERC20TokenWithTimeLock.networks[networkId];
      const instance = new web3.eth.Contract(SimpleERC20TokenWithTimeLock.abi,deployedNetwork && deployedNetwork.address);

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
    if (!self.state.web3 && !self.state.contract) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
        <div className="App">
          <div>
            <h1>Token generation with time lock example</h1>
            <div>Press the button for obtaining the 1 token</div>
            <br/>
            <button className="transferTokenButton" onClick={self.transferToken}>Obtain 1 token</button>
            <br/>
            {self.state.showError && (<div className="errorMessage">{self.state.errorMessage}</div>)}
            <br/>
            {self.state.debugInfoLoaded && (self.renderDebugInfo())}
          </div>
        </div>
    );
  }

  renderDebugInfo = () => {
    let self = this;
    return (
        <div>
          <h1>Debug Info</h1>
          <div>Total supply: {self.state.totalSupply} tokens</div>
          <br/>
          <div>Balance of user account: {self.state.balanceOfUserAccount} tokens</div>
          <br/>
          <div>User account address: {self.state.accounts[0]}</div>
          <br/>
          <div>Contract address: {self.state.contract._address}</div>
          <br/>
          <div>Contract owner: {self.state.owner}</div>
          <br/>
          <div>Last token generation event date: {self.state.lastTokenGenerationEventDateTime}</div>
          <br/>
          <div>Next available token generation date: {self.state.nextAvailableTokenExtractionDateTime}</div>
          <br/>
          <br/>
          <br/>
          <div>The following actions will work only for contract owner:</div>
          <button className="changeTimeLockButton" onClick={()=>self.changeTimeLockToOneMinute(1)}>Change time lock to 1 minute</button>
          <button className="changeTimeLockButton" onClick={()=>self.changeTimeLockToOneMinute(20)}>Change time lock to 20 minute</button>
        </div>
    );
  }

  transferToken = async () => {
    let self = this;
    const { accounts, contract, web3 } = self.state;
    try {
      await contract.methods.generateElseOneToken().send({from: accounts[0]}).then(() => {
        self.updateDebugInfo();
        self.hideErrorMessage();
      }).catch((error) => {
        console.log(error);
      })
    } catch (error) {
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

    const balanceOfUserAccount = await contract.methods.balanceOf(accounts[0]).call();
    const owner = await contract.methods.owner().call();
    const decimals = await contract.methods.decimals().call();
    const totalSupply = await contract.methods.totalSupply().call();
    const lastTokenGenerationEventDateTime = await contract.methods.getLastTokenGenerationDateTime().call();

    self.setState({
      lastTokenGenerationEventDateTime: new Date(lastTokenGenerationEventDateTime*1000).toLocaleString(),
      nextAvailableTokenExtractionDateTime: new Date(lastTokenGenerationEventDateTime*1000 + self.state.lockTimeInMinutes*60*1000).toLocaleString(),
      balanceOfUserAccount: balanceOfUserAccount / Math.pow(10, decimals),
      owner: owner,
      totalSupply: totalSupply / Math.pow(10, decimals),
      debugInfoLoaded: true
    });
  };
}

export default App;
