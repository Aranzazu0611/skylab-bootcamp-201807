import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import logic from './logic'
import Register from './components/Register'
import Login from './components/Login'
import Landing from './components/Landing'
import {Switch, Route, withRouter, Redirect} from 'react-router-dom'
import Files from './components/Files'

class App extends Component {
 
  goToRegister = (event) => {
    event.preventDefault()
    this.props.history.push('/Register')
  }
  goToLogin = (event) => {
    event.preventDefault()
    this.props.history.push('/Login')
  }
  onRegister = (username,password) => {
    
   logic.register(username,password)
    .then(() => {
      this.props.history.push('/Login')
    })
  
  }

  onLogin = (username,password) => {
    
   logic.authenticate(username,password)
    .then(() => {
      this.props.history.push('/Files')
    })

  }

  render(){

      return (

        <Switch>
            <Route exact path="/" render={() => <Landing onRegister={this.goToRegister} onLogin={this.goToLogin}/>}/>
            <Route path="/Register" render={() => <Register onRegister={this.onRegister} />}/>
            <Route path="/Login" render={() => <Login  onLogin={this.onLogin}/>}/>
            <Route path="/Files" render={() => <Files />}/>
        </Switch>







      )
  }
}
export default withRouter(App);
