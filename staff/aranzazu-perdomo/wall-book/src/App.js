import React, { Component } from 'react';
import { Route, Redirect, Switch, withRouter } from 'react-router'
import { logicWallbook } from '../src/logic'
import logo from './logo.svg';
import LandingPage from '../src/components/LandingPage'
import Profile from '../src/components/Profile'
import Search from '../src/components/Search'
import Review from '../src/components/Review'
import BookDetail from '../src/components/BookDetail'
import swal from 'sweetalert2'
import '../src/index.css'



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

    // this.props.history.push('/search')
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


  render() {
    return (
      <div>
       
        <Switch>
          <Route exact path="/" render={() => this.isLoggedIn() ? <Redirect to="/search" /> : <LandingPage onLoggin={this.onLoggin} />} />
          <Route path="/search" render={() => this.isLoggedIn() ? <Search onBookDetail= {this.onBookDetail}/> : <Redirect to="/" />} />
          <Route path="/book/:id" render={props => this.isLoggedIn() ? <BookDetail bookId={props.match.params.id} /> : <Redirect to="/" />} />
        </Switch>
      </div>

    )

  }
}

export default withRouter(App);
