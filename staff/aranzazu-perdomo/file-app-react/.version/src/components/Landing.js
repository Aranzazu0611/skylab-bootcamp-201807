import React,{Component} from 'react'
import Register from './Register'
import Login from './Login'
import {withRouter} from 'react-router-dom'

function Landing ({ onRegister, onLogin}){
    return(
        <div>
            <header>
                <h1 className="off">FILES</h1>
            </header>

        <main>
            <div className="screen">
                <nav>
                    <a href="/register" onClick={onRegister}>register </a> or <a href="/Login" onClick={onLogin}> Login</a>
                </nav>
            </div>
        </main>
                
        
        
        </div>
    )

    
}


 

export default withRouter(Landing);