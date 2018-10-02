import React, { Component } from "react"
import { withRouter, Link } from 'react-router-dom'

import {
    Button,
    Row,
    Col

} from "reactstrap";
import swal from "sweetalert2";
import logicWallbook from '../../logic'
import './style.css'

class Landing extends Component {
    state = {
        modal: false,
        modalLogin: false,
        email: "",
        name: "",
        password: ""
    };

    toggle = () => {
        this.setState({
            modal: !this.state.modal,
            email: "",
            password: ""
        });
    };

    loginToggle = () => {
        this.setState({
            modalLogin: !this.state.modalLogin,
            email: "",
            password: ""
        });
    };

    keepEmail = e => this.setState({ email: e.target.value, error: '' })
    keepName = e => this.setState({ name: e.target.value, error: '' })
    keepPassword = e => this.setState({ password: e.target.value, error: '' })

    handleRegisterSubmit = event => {
        event.preventDefault()

        const { state: { email, name, password } } = this

        return logicWallbook.register(email, name, password)
            .then(() =>
                swal({
                    title: "Success!",
                    text: "Register Sucessful",
                    type: "success",
                    confirmButtonText: "Cool"
                })
            )
            .then(() => {
                this.toggle()
                this.loginToggle()
            })
            .catch(err =>
                swal({
                    title: "Failed! :(",
                    text: err,
                    type: "error",
                    confirmButtonText: "Try again"
                })
            );
    }

    handleLoginSubmit = event => {
        event.preventDefault()

        const { state: { email, password } } = this

        return logicWallbook.authenticate(email, password)
            .then(({ token, user }) => {
                swal({
                    title: "Success!",
                    text: "Login Sucessful",
                    type: "success",
                    confirmButtonText: "Cool"
                })
                    .then(() => {
                        this.props.onLoggin(email, password, token, user)
                    })
            })
            .catch(err =>
                swal({
                    title: "Failed! :(",
                    text: err,
                    type: "error",
                    confirmButtonText: "Try again"
                })
            );


    }

    render() {
        return (
            <div className= "landing">
       

            <div className="text-center align-items-center info">

                <Row>
                    <Col sm="12">
                        <h1>Wall-Book</h1>
                        <h5>Get info of your favorite books in an easy way! </h5>
                        <Button color="danger" tag={Link} to="/register">Register</Button>
                        <Button color="danger" tag={Link} to="/login">Log In</Button>
                    </Col>
                </Row>
            </div>

        </div>
        );
    }
}

export default withRouter(Landing);