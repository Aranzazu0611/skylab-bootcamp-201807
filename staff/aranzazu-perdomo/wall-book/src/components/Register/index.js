import React, { Component } from "react"
import { withRouter, Link } from 'react-router-dom'

import {
    Button,
    Label,
    Input,
    Form,
    FormGroup,
    FormText,
    Container,
    Col

} from "reactstrap";
import swal from "sweetalert2";
import logicWallbook from '../../logic'
import './style.css'


class Register extends Component {
    state = {

        email: "",
        name: "",
        password: ""
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

    render() {
        const { keepEmail, keepName, keepPassword } = this


        return (<div className="container-register">
            <Container >

                <Col sm={{ size: 10, offset: 1 }} md={{ size: 6, offset: 3 }}>
                    <Form className=" text-center  form-register p-3 pl-5 pr-5 rounded" onSubmit={this.handleRegisterSubmit}>
                        <h3>Register </h3>
                        <hr className="my-4" />
                        <FormGroup>
                            <Label className="titleRegister">Email</Label>
                            <Input className="m-3" type="text" onChange={keepEmail} name="Email" placeholder="Email" required autoFocus="true" />
                            <FormText>Email is required</FormText>
                        </FormGroup>
                        <FormGroup>
                            <Label for="exampleName">Name</Label>
                            <Input className="m-3" type="text" onChange={keepName} name="Name" placeholder="Name" />
                            <FormText color="muted">Name is required</FormText>
                        </FormGroup>
                        <FormGroup>
                            <Label for="examplePassword">Password</Label>
                            <Input className="m-3" type="password" onChange={keepPassword} name="password" placeholder="Password" required />
                        </FormGroup>
                        <Button className="m-2" color="danger" tag={Link} to="/#" >Cancel</Button>
                        <Button className="m-2" color="primary" tag={Link} to="/login" >Register</Button>
                    </Form>
                </Col>
            </Container>
        </div>
        )
    }


}
export default withRouter(Register);