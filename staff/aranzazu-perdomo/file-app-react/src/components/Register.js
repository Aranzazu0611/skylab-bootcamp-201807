import React,{Component} from 'react'
import logic from '../logic'
import {withRouter} from 'react-router-dom'


class Register extends Component{
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

    handleSubmit = (event) => {
        event.preventDefault()
    
    }

    onRegister = (event) => {
        event.preventDefault()
        const { username, password } = this.state
        this.props.onRegister(username,password)
    }

    goToLogin= (event) => {
        event.preventDefault()
        this.props.history.push('/Login')
    }   

    render() {
        return (
            <div className="screen">
                <h1>FILES</h1>
                <nav>
                    >  register or <a href="" onClick={this.goToLogin}>login</a> <span class="blink">_</span>
                </nav>
                <form action="/register" method="post" onSubmit={this.onRegister}>
                    <input type="text" name="username" placeholder="username" autofocus onChange={this.handleUsername}/>
                    <input type="password" name="password" placeholder="password" onChange={this.handlePassword}/>
                    <button type="submit">register</button>
                </form>
            </div>


        )
    
    }

}

export default withRouter(Register);