import React, { Component } from "react";
import Flights from './components/Flights';
import Balance from './components/Balance';
import AirlineContract from "./contracts/Airline.json";
import getWeb3 from "./getWeb3";
import "./App.css";

class App extends Component {

  state = {
    web3: null,
    accounts: [],
    contract: null,
    flights: [],
    myFlights: [],
    loyalty: {
      points: async () => {
        const account = this.state.accounts[0].address;
        const customer = await this.state.contract.methods.customers(account).call();
        const points = customer[0];
        return points;
      },
      ether: async () => {
        const account = this.state.accounts[0].address;
        const ether = await this.state.contract.methods.getRefundableEther().call({from: account});
        return this.state.web3.utils.fromWei(ether, 'ether');
      },
      redeem: async () => {
        const account = this.state.accounts[0].address;
        await this.state.contract.methods.redeemLoyaltyPoints().send({from: account, value: 0});
        this.setState({ ...this.state.accounts, accounts: this.state.accounts })
      }
    },
  };

  mapAccounts = (items) => {
    let accounts = [];
    items.forEach((item) => {
      accounts.push({
        address: item,
        balance: async () => {
          const balance = await this.state.web3.eth.getBalance(item);
          return this.state.web3.utils.fromWei(balance, 'ether');
        }
      })
    });
    this.setState({ accounts: accounts });
  }

  mapFlights = async () => {
    const account = this.state.accounts[0].address;
    const count = await this.state.contract.methods.totalFlights().call();
    let flights = [];
    for (let i = 0; i < count; i++) {
      const flight = await this.state.contract.methods.flights(i).call();
      const name = flight[0];
      const price = flight[1];
      flights.push({
        name: name,
        wei: price,
        price: () => {
          return this.state.web3.utils.fromWei(price, 'ether');
        }
      });
    }
    this.setState({ flights: flights });
  }

  mapMyFlights = async () => {
    const account = this.state.accounts[0].address;
    const count = await this.state.contract.methods.customerTotalFlights(account).call();
    let flights = [];
    for (let i = 0; i < count; i++) {
      const flight = await this.state.contract.methods.customerFlights(account, i).call();
      const name = flight[0];
      const price = flight[1];
      flights.push({
        name: name,
        wei: price,
        price: () => {
          return this.state.web3.utils.fromWei(price, 'ether');
        }
      });
    }
    this.setState({ myFlights: flights });
  }

  buyFlight = async (index, value) => {
    const account = this.state.accounts[0].address;
    await this.state.contract.methods.buyFlight(index).send({ from: account, value: value });
  }

  addBuyFlightEventListener = () => {
    this.state.contract.events.FlightPurchased().on('data', async (event) => {
      console.log(event);
      await this.mapMyFlights();
    });
  }

  addAccountsChangedListener = () => {
    window.ethereum.on('accountsChanged', async (items) => {
      this.mapAccounts(items);
      await this.mapMyFlights();
    });
  }

  componentDidMount = async () => {
    try {
      const web3 = await getWeb3();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = AirlineContract.networks[networkId];
      const instance = new web3.eth.Contract(
        AirlineContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      const items = await web3.eth.getAccounts();
      this.mapAccounts(items);

      this.setState({ web3, contract: instance }, this.load);
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  load = async () => {
    await this.mapFlights();
    await this.mapMyFlights();
    this.addAccountsChangedListener();
    this.addBuyFlightEventListener();
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
              <Balance accounts={this.state.accounts} myFlights={this.state.myFlights} loyalty={this.state.loyalty} />
            </div>
            <div className="col-lg-6">
              <Flights flights={this.state.flights} buyFlight={this.buyFlight} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
