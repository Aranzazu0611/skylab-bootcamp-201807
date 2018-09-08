import React, { Component } from "react"
import logicWallbook from "../../logic"
import { Redirect } from "react-router";
import {
    Card,
    CardImg,
    CardBody,
    CardTitle,
    CardSubtitle,
    CardText,
    Button,
    Form,
    InputGroup,
    InputGroupAddon,
    Input,
    Container,
    Col,
    Row
} from "reactstrap"
import swal from "sweetalert2";


class BookDetail extends Component {

    state = {
        modal: false,
        modalAddReview: false,
        book: "",
        _vote: "",
        comment: "",
    }

    toggle = () => {
        this.setState({
            modal: !this.state.modal,
            book: "",
            _vote: "",
            comment: "",
        });
    };
    toggleAddReview = () => {
        this.setState({
            modal: !this.state.modalAddReview,
            book: "",
            _vote: "",
            comment: "",
        });
    };

    keepBook = e => this.setState({ book: e.target.value, error: '' })
    keepVote = e => this.setState({ _vote: e.target.value, error: '' })
    keepComment = e => this.setState({ comment: e.target.value, error: '' })

    HandleAddReview = event => {
        event.preventDefault()
        const { book, _vote, comment } = this.state

        const userId = sessionStorage.getItem('userId')
        const token = sessionStorage.getItem('token')

        logicWallbook.addReview(userId, book, _vote, comment, token)
            .then(Review => )
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
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
            <ModalHeader toggle={this.toggle}>Add review</ModalHeader>
            <form
                onSubmit={this.HandleAddReview}
            >
                <ModalBody className="text-center">
                    <div className="mb-4 ">
                        <i className="fa fa-user mr-4" />
                        <Label for="exampleTitulo">Titulo</Label>
                        <Input type="text" onChange={this.keepbook} name="titleBook" placeholder="book" />
                    </div>
                    <div className="mb-4 ">
                        <i className="fa fa-user mr-4" />
                        <Label for="exampleSelect">Select Vote</Label>
                        <Input type="select" name="select" onChange={this.keepVote} id="exampleSelect">
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                            <option>6</option>
                            <option>7</option>
                            <option>8</option>
                            <option>9</option>
                            <option>10</option>
                        </Input>
                    </div>
                    <div className="mb-2">
                        <i className="fa fa-lock mr-4" />
                        <Label for="exampleText">Text Area</Label>
                        <Input type="textarea" name="text" id="exampleText" />
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                    <Button color="primary">Submit</Button>
                </ModalFooter>
            </form>
        </Modal>


    }
}
export default BookDetail