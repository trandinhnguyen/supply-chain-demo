import Home from "./components/Home";
import Admin from "./components/Admin";
import Farmer from "./components/Farmer";
import Distributor from "./components/Distributor";
import Retailer from "./components/Retailer";
import Customer from "./components/Customer";

import { Route, NavLink, Routes } from "react-router-dom";
import React, { Component } from "react";
import { ethers } from "ethers";
import { contractABI, contractAddress } from "./utils/constants";
import ProductHistory from "./components/ProductHistory";

import "./App.css";

// const ethers = require("ethers");

class App extends Component {
  state = {
    errorMessage: null,
    defaultAccount: null,
    contract: null,
    connButtonText: null,
    currentOwner: null,
    provider: null,
    signer: null,
  };

  componentDidMount = async () => {
    if (window.ethereum) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((result) => {
          this.accountChangedHandler(result[0]);
          this.setState({ connButtonText: "Wallet Connected" });
        })
        .catch((error) => {
          this.setState({ errorMessage: error.message });
        });
    } else {
      this.setState({ errorMessage: "Need to install Metamask" });
    }
  };

  accountChangedHandler = (newAccount) => {
    this.setState({ defaultAccount: newAccount });
    this.updateEthers();
  };

  updateEthers = () => {
    let tempProvider = new ethers.providers.Web3Provider(window.ethereum);

    let tempSigner = tempProvider.getSigner();

    let tempContract = new ethers.Contract(
      contractAddress,
      contractABI,
      tempSigner
    );

    this.setState({
      provider: tempProvider,
      signer: tempSigner,
      contract: tempContract,
    });
  };

  getCurrentOwner = async () => {
    let val = await this.state.contract.owner();
    this.setState({ currentOwner: val });
  };

  render() {
    return (
      <div className="App">
        <div>
          <div>
            <nav className="nav">
              <NavLink to="/" className="nav-item">
                Home
              </NavLink>
              <NavLink to="/admin" className="nav-item">
                Admin
              </NavLink>
              <NavLink to="/farmer" className="nav-item">
                Farmer
              </NavLink>
              <NavLink to="/distributor" className="nav-item">
                Distributor
              </NavLink>
              <NavLink to="/retailer" className="nav-item">
                Retailer
              </NavLink>
              <NavLink to="/customer" className="nav-item">
                Customer
              </NavLink>
              <NavLink to="/product-history" className="nav-item">
                Product History
              </NavLink>
            </nav>
          </div>
          <div className="container">
            <div className="btn-owner">
              <button className="btn" onClick={this.getCurrentOwner}>
                {" "}
                Get Current Contract Owner{" "}
              </button>
              {this.state.currentOwner && (
                <div className="content">{this.state.currentOwner}</div>
              )}
            </div>

            <div>
              <h3>Connect to Metamask</h3>
              <button className="btn" onClick={this.connectWalletHandler}>
                {this.state.connButtonText}
              </button>
              {/* <h3>Address: {this.state.defaultAccount}</h3> */}
              {this.state.defaultAccount && (
                <div className="content">{this.state.defaultAccount}</div>
              )}
            </div>
            <hr />
          </div>
          <Routes>
            <Route
              exact
              path="/admin"
              element={
                <Admin
                  account={this.state.defaultAccount}
                  contract={this.state.contract}
                  owner={this.state.currentOwner}
                />
              }
            />

            <Route
              exact
              path="/farmer"
              element={
                <Farmer
                  account={this.state.defaultAccount}
                  contract={this.state.contract}
                  owner={this.state.currentOwner}
                />
              }
            />

            <Route
              exact
              path="/customer"
              element={
                <Customer
                  account={this.state.defaultAccount}
                  contract={this.state.contract}
                  owner={this.state.currentOwner}
                />
              }
            />

            <Route
              exact
              path="/product-history"
              element={
                <ProductHistory
                  account={this.state.defaultAccount}
                  contract={this.state.contract}
                  owner={this.state.currentOwner}
                />
              }
            />

            <Route
              exact
              path="/distributor"
              element={
                <Distributor
                  account={this.state.defaultAccount}
                  contract={this.state.contract}
                  owner={this.state.currentOwner}
                />
              }
            />

            <Route
              exact
              path="/retailer"
              element={
                <Retailer
                  account={this.state.defaultAccount}
                  contract={this.state.contract}
                  owner={this.state.currentOwner}
                />
              }
            />

            <Route exact path="/" element={<Home />} />
          </Routes>
        </div>
      </div>
    );
  }
}

export default App;
