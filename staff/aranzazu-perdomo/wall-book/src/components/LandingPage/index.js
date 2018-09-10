import React, { Component } from "react"
import { withRouter } from 'react-router'

import {
  Button,
  Modal,
  Label,
  Input,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Container,
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
    return (<Container className="container">
      
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Registration form</ModalHeader>
          <form onSubmit={this.handleRegisterSubmit}>
            <ModalBody className="text-center">
              <div className="mb-4 ">
                <i className="fa fa-user mr-4" />
                <Label for="exampleEmail">Email</Label>
                <Input type="text" onChange={this.keepEmail} name="Email" placeholder="Email" required autoFocus="true" />
              </div>
              <div className="mb-4 ">
                <i className="fa fa-user mr-4" />
                <Label for="exampleName">Name</Label>
                <Input type="text" onChange={this.keepName} name="Name" placeholder="Name" />
              </div>
              <div className="mb-2">
                <i className="fa fa-lock mr-4" />
                <Label for="examplePassword">Password</Label>
                <Input type="password" onChange={this.keepPassword} name="password" placeholder="Password" required />

              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={this.toggle}>Cancel</Button>
              <Button color="primary">Submit</Button>
            </ModalFooter>
          </form>
        </Modal>
        <div className="text-center align-items-center" style={{ height: 90 + "vh" }}>
          <Row>
            <Col className="p-5">
              <h1>Wall-Book</h1>
              <h5>Get info of your favorite books in an easy way! </h5>
              <Button className="mr-5" color="primary" onClick={this.toggle}>Register</Button>
              <Button color="primary" onClick={this.loginToggle}>Log In</Button>
            </Col>
          </Row>
        </div>
        <Modal isOpen={this.state.modalLogin} toggle={this.loginToggle}>
          <ModalHeader toggle={this.loginToggle}>Login form</ModalHeader>
          <form onSubmit={this.handleLoginSubmit}>
            <ModalBody className="text-center">
              <div className="mb-4 ">
                <i className="fa fa-user mr-4" />
                <Label for="Email">Email</Label>
                <Input type="text" onChange={this.keepEmail} name="Email" placeholder="Email" required autoFocus="true" />
              </div>
              <div className="mb-2 ">
                <i className="fa fa-lock mr-4" />
                <Label for="Password">Password</Label>
                <Input type="password" onChange={this.keepPassword} name="password" placeholder="Password" required />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={this.loginToggle}>Cancel</Button>
              <Button color="primary" type="submit">Submit</Button>
            </ModalFooter>
          </form>
        </Modal>
      
    </Container>
    );
  }
}

export default withRouter(Landing);