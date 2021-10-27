import React, { Component } from "react";
import Flights from './components/Flights';
import Balance from './components/Balance';
import AirlineContract from "./contracts/Airline.json";
import getWeb3 from "./getWeb3";
import "./App.css";

class App extends Component {

  state = {
    web3: null,
    accounts: null,
    contract: null,
    flights: []
  };

  componentDidMount = async () => {
    try {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = AirlineContract.networks[networkId];

      const instance = new web3.eth.Contract(
        AirlineContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { contract } = this.state;

    const count = await contract.methods.totalFlights().call();
    let items = [];

    for (let i = 0; i < count; i++) {
      const flight = await contract.methods.flights(i).call();
      const name = flight[0];
      const price = flight[1];
      const item = {
        name: name,
        price: price
      };
      items.push(item)
    }

    this.setState({ flights: items });
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
          <ul className="navbar-nav me-auto">
            <div className="container-fluid">
              <a className="navbar-brand" href="#">Airline</a>
            </div>
          </ul>
        </nav>
        <div className="col-lg-12 mt-5">
          <div className="row">
            <div className="col-lg-6">
              <Balance />
            </div>
            <div className="col-lg-6">
              <Flights flights={this.state.flights} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
