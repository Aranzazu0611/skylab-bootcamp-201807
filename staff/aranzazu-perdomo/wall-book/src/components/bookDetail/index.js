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
        reviews =[],
        reviewId
    }

    toggle = () => {
        this.setState({
            modal: !this.state.modal,
            book: "",
            _vote: "",
            comment: "",
        });
    }

    toggleAddReview = () => {
        this.setState({
            modal: !this.state.modalAddReview,
            book: "",
            _vote: "",
            comment: "",
        });
    }

    keepBook = e => this.setState({ book: e.target.value, error: '' })
    keepVote = e => this.setState({ _vote: e.target.value, error: '' })
    keepComment = e => this.setState({ comment: e.target.value, error: '' })



    HandlelistReview = event => {
        event.preventDefault()

        const userId = sessionStorage.getItem('userId')
        const token = sessionStorage.getItem('token')

        logicWallbook.listReviews(userId, token)
            .then(reviews => this.setState({ reviews: reviews }))
            .catch(err =>
                swal({
                    title: "Failed! :(",
                    text: err,
                    type: "error",
                    confirmButtonText: "Try again"
                })
            );

    }

    HandleDeleteReview = event => {
        event.preventDefault()

        const { reviewId } = this.state

        const userId = sessionStorage.getItem('userId')
        const token = sessionStorage.getItem('token')

        logicWallbook.deleteReviews(reviewId, userId, token)
            .then(() => {
                swal({
                    title: "Success!",
                    text: "Delete Sucessful",
                    type: "success",
                    confirmButtonText: "Cool"
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
            )
    }
}



render() {
    < Modal isOpen={this.state.modal} toggle={this.toggle} >
        <ModalHeader toggle={this.toggle}>Add review</ModalHeader>
        <form onSubmit={this.HandleAddReview} >
            <ModalBody className="text-center">
                <div className="mb-4 ">
                    <i className="fa fa-user mr-4" />
                    <Label for="exampleTitulo">Titulo</Label>
                    <Input type="text" onChange={this.keepbook} name="titleBook" placeholder="book" />
                </div>
                <div className="mb-4 ">
                    <i className="fa fa-user mr-4" />
                    <Label for="exampleSelect">Select Vote</Label>
                    <ReactStars
                    count={5},
                    onChange={ratingChanged},
                    size={24},
                    color2={'#ffd700'} />,
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
    </Modal >
        <Container className="container" >
            <Col xs="6" sm="4">
                <Card className="card">
                    <CardHeader className="text-muted"><img className="icons" src="../../../public/icons/001-heart.png"></img></CardHeader>
                    <CardBody >
                        <CardImg top width="100%" height="461px" src={book.thumbnail} alt="Card image cap" />
                        <div className="card_cardbody">
                            <CardTitle>{book.title}</CardTitle>
                            <CardSubtitle>ISBN: {book.isbn.identifier}</CardSubtitle>
                            <CardSubtitle>Language: {book.language}</CardSubtitle>
                            <CardText>{book.description.substring(0, 80)}...</CardText>
                        </div>
                        <Button color="primary" target="_blank" href="" >Comprar</Button>
                    </CardBody>
                </Card>
            </Col>

            <Col xs="6" sm="4">
                <Card className="card">
                    <CardHeader className="text-muted"><img className="icons" src="../../../public/icons/001-heart.png"></img></CardHeader>
                    <CardBody >
                        <CardImg top width="100%" height="461px" src={book.thumbnail} alt="Card image cap" />
                        <div className="card_cardbody">
                            <CardTitle>{review.title}</CardTitle>
                            <CardSubtitle>{review._vote}</CardSubtitle>
                            <CardText>{book.description}</CardText>
                        </div>

                    </CardBody>
                </Card>
            </Col>
        </Container>
                
}
export default BookDetail;