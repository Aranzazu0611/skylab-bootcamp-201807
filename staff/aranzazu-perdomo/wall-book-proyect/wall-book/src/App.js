import React, { Component } from 'react';
import { Route, Redirect, Switch, withRouter } from 'react-router'
import Register from '../src/components/Register'
import Login from '../src/components/Login'
import LandingPage from '../src/components/LandingPage'
import Profile from '../src/components/Profile'
import Search from '../src/components/Search'
import BookDetail from '../src/components/bookDetail'
import '../src/index.css'
import {
  Button,
  Navbar,
  NavbarBrand

} from "reactstrap"



class App extends Component {
  state = {

    email: sessionStorage.getItem('email') || '',
    password: sessionStorage.getItem('password') || ''
  }

  isLoggedIn() {
    return !!this.state.email
  }

  onLoggin = (email, password, token, userId) => {
    this.setState({ email, password })

    sessionStorage.setItem('email', email)
    sessionStorage.setItem('password', password)
    sessionStorage.setItem('token', token)
    sessionStorage.setItem('userId', userId)

  }


  onLogout = e => {
    e.preventDefault()
    this.setState({ email: '', password: '' })
    sessionStorage.clear()
    this.props.history.push('/')
  }

  onBookDetail = bookId => {

    this.props.history.push(`/book/${bookId}`)

  }

  onProfile = () => {
    const userId = sessionStorage.getItem('userId')
    this.props.history.push(`/user/${userId}`)
  }



  render() {
    return (
      <div>
        <Navbar color="dark mt-0" light >
          <NavbarBrand href="/" className="mr-auto">Wall-book</NavbarBrand>
          {this.isLoggedIn() && <Button color="primary" target="_blank" onClick={this.onProfile}>Profile</Button>}
          {this.isLoggedIn() && <Button color="primary" target="_blank" onClick={this.onLogout}>Logout</Button>}
        </Navbar>

        <Switch>
          <Route exact path="/" render={() => this.isLoggedIn() ? <Redirect to="/search" /> : <LandingPage onLoggin={this.onLoggin} />} />
          <Route exact path="/register" render={() => this.isLoggedIn() ? <Redirect to="/login" /> : <Register onLoggin={this.onLoggin} />} />
          <Route exact path="/login" render={() => this.isLoggedIn() ? <Redirect to="/search" /> : <Login onLoggin={this.onLoggin} />} />
          <Route path="/search" render={() => this.isLoggedIn() ? <Search onBookDetail={this.onBookDetail} onLogout={this.onLogout} onProfile={this.onProfile} /> : <Redirect to="/" />} />
          <Route path="/book/:id" render={props => this.isLoggedIn() ? <BookDetail bookId={props.match.params.id} userId={this.state.userId} /> : <Redirect to="/" />} />
          <Route path="/user/:userId" render={props => this.isLoggedIn() ? <Profile userId={props.match.params.userId} onLogout={this.onLogout} email={this.state.email} /> : <Redirect to="/" />} />
        </Switch>
      </div>

    )

  }
}

export default withRouter(App);
