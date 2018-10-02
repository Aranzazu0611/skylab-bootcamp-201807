import React, { Component } from "react"
import { withRouter, Link } from 'react-router-dom'

import {
    Button,
    Label,
    Input,
    Form,
    FormGroup,
    Container,
    Col

} from "reactstrap";
import swal from "sweetalert2";
import logicWallbook from '../../logic'
import './style.css'


class Login extends Component {
    state = {

        email: "",
        password: ""
    };

    keepEmail = e => this.setState({ email: e.target.value, error: '' })
    keepPassword = e => this.setState({ password: e.target.value, error: '' })

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
        const { keepEmail, keepPassword } = this

        return (<div className="container-login">
            <Container >
                <Col sm={{ size: 10, offset: 1 }} md={{ size: 6, offset: 3 }}>
                    <Form className="text-center  form-login p-3 pl-5 pr-5 rounded" onSubmit={this.handleLoginSubmit}>
                        <h3>Login </h3>
                        <hr className="my-4" />
                        <FormGroup>
                            <Label for="exampleEmail">Email</Label>
                            <Input type="text" onChange={keepEmail} name="Email" placeholder="Email" required autoFocus="true" />

                        </FormGroup>
                        <FormGroup>
                            <Label for="examplePassword">Password</Label>
                            <Input type="password" onChange={keepPassword} name="password" placeholder="Password" required />
                        </FormGroup>
                        <Button className="m-2" color="danger" tag={Link} to="/#" >Cancel</Button>
                        <Button className="m-2" color="primary">Login</Button>
                    </Form>
                </Col>
            </Container>
        </div>
        )
    }

}

export default withRouter(Login);