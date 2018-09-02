import React, { Component } from "react"
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Container,
    Row,
    Col
  } from "reactstrap";
  import swal from "sweetalert2";
  import logic from "../logic";

  class Landing extends Component {
    state = {
      modal: false,
      modalLogin: false,
      email: "",
      name:"",
      password: ""
    };

    keepEmail = e => this.setState({ email: e.target.value, error: '' })
    keepName = e => this.setState({ name: e.target.value, error: '' })
    keepPassword = e => this.setState({ password: e.target.value, error: '' })

  }

export default Landing;