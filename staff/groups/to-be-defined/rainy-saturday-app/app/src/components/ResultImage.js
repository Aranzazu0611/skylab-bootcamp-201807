
import React, { Component } from 'react'
import { CardImg, Card } from 'reactstrap'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import './ResultImage.css'
class ResultImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }
  render() {
    return (
      <div>
        <img src={this.props.image.imageurl} alt={this.props.image.title} onClick={this.toggle}/>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className} >
          <ModalHeader toggle={this.toggle}>{this.props.image.title}</ModalHeader>
          <ModalBody>
          <img src={this.props.image.imageurl} alt={this.props.image.title}/>
          <p><h5>Title:</h5>{this.props.image.longTitle}</p>
          <p><h6>Maker:</h6>{this.props.image.maker}</p>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.toggle}>Do Something</Button>{' '}
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    )


  }
}

export default ResultImage