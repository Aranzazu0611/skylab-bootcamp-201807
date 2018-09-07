import React, { Component } from "react"
import swal from 'sweetalert2'
import logicWallbook from "../../logic"
import { Redirect } from "react-router";
import { Button, Form, FormGroup, Label, Input, FormText, Container } from 'reactstrap'

class Settings extends Component {

    state = {

        userId: "",
        password: "",
        newPassword: null,
        token: sessionStorage.getItem('token') || "",
        redirectHome: false

    }

    keepUserId= event => this.setState({ userId: event.target.value })
    keepPassword = event => this.setState({ password: event.target.value })
    keepNewPassword = event => this.setState({ newPassword: event.target.value })

    onUpdate = event => {
        event.preventDefault()
    
        const {email, password, newPassword } = this.state

        logicWallbook.updatePassword(userId,password,newPassword,token)
        .then(token =>)
    
}

export default Settings