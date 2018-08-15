import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

class Login extends Component{
    state = {

        username : "",
        password : ""

    }
    handleUsername = (event) => {
        this.setState({ username: event.target.value })
      }
    
    handlePassword = (event) => {
        this.setState({ password: event.target.value })
      }
    
    onLogin = (event) => {
        event.preventDefault()
        const { username, password } = this.state
        this.props.onLogin(username,password)
    }

    goToFile= (event) => {
        event.preventDefault()
        this.props.history.push('/File')
    }   
    

    render(){
        return(

        <div class="screen">
        <h1>FILES</h1>
        <nav>
            > <a href="/register">register</a> or login <span class="blink">_</span>
        </nav>
        <form action="/login" method="post" onSubmit={this.onLogin}>
            <input type="text" name="username" placeholder="username" autofocus onChange={this.handleUsername}/>
            <input type="password" name="password" placeholder="password" onChange={this.handlePassword}/>
            <button type="submit">login</button>
        </form>
        </div>

            
         )




    }






}

export default withRouter(Login);