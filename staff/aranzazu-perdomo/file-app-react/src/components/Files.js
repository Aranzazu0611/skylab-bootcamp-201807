import React, { Component} from 'react'
import {withRouter} from 'react-router-dom'
import logic from '../logic'

class Files extends Component {


//    listfiles = () => {
//        logic.listFiles(username)
//    }





    render(){
        return(
            <div className="screen">
            <h1>FILES</h1> <img class="image" src="./default-image.png"/>
            <nav>
                > <a href="">profile</a> <a href="">logout</a> <span class="blink">_</span>
            </nav>
            <ul>
                <li>file 1</li>
                <li>file 2</li>
                <li>file 3</li>
            </ul>
            
                <button><label for="upload">Choose a file</label></button>
                <form action="/files" method="post">
                    <input id="upload" type="file" name="upload" placeholder="" autofocus />
                    <button type="submit">upload</button>
                </form>
           
        </div>
       )
    }

    





}

export default withRouter(Files)