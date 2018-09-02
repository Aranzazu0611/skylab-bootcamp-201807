import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router'
import logic from "./logic/indexaxios";
import logo from './logo.svg';
import LandingPage from '../src/components/LandingPage'
import Book from '../src/components/Book'
import Profile from '../src/components/Profile'
import Search from '../src/components/Search'
import Review from '../src/components/Review'
import swal from 'sweetalert2'
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
