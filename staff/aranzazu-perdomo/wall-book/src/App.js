import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router'
import { logicWallbook } from '../src/logic'
import logo from './logo.svg';
import LandingPage from '../src/components/LandingPage'
// import Book from '../src/components/Book'
import Profile from '../src/components/Profile'
import Search from '../src/components/Search'
import Review from '../src/components/Review'
import swal from 'sweetalert2'
import './App.css';

class App extends Component {
  state = {
    email: sessionStorage.getItem('email') || '',
    password: sessionStorage.getItem('password') || ''

  }

  isLoggedIn() {
    return this.state.email
  }

  onLoggedIn = (email, password) => {
    this.setState({ email, password })

    sessionStorage.setItem('email', email)
    sessionStorage.setItem('password', password)

    this.props.history.push('/search')
  }


  onLogout = e => {
    e.preventDefault()
    this.setState({ email: '', password: '' })
    sessionStorage.clear()
    this.props.history.push('/')
  }


  render() {
    return (
      <div>

        <Switch>
          <Route exact path="/" render={() => this.state.isLoggedIn ? <Redirect to="/search" /> : <LandingPage />} />
          {/* <Route path="/reviews" render={() => this.state.isLoggedIn ? <Search /> : <Redirect to="/" />} /> */}
          <Route path="/search" render={() => this.state.isLoggedIn ? <Search /> : <Redirect to="/" />} />
          {/* <Route path="/register" render={() => this.state.isLoggedIn ? <Redirect to="/login" /> : <Redirect to="/" />} /> */}
          <Route path="/login" render={() => this.state.isLoggedIn ? <Redirect to="/search" /> : <Redirect to="/" />} /> */}
          {/* <Route path="/favorites" render={() => this.state.isLoggedIn ? <Favorites /> : <Redirect to="/" />} /> */} */}
        </Switch>
      </div>

    )
  }
}

export default App;
