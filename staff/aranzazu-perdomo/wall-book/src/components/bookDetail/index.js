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
    Container,
    Col,
    Button,
    Modal,
    Label,
    Input,
    ModalHeader,
    ModalBody,
    ModalFooter,
    CardHeader,
    FormGroup
} from "reactstrap"
import swal from "sweetalert2"
import ReactStars from 'react-stars'
import './style.css'


class BookDetail extends Component {

    state = {
        modal: false,
        book: "",
        _vote: "",
        comment: "",
        reviews: [],
        reviewId: ""
    }

    componentDidMount() {
        const userId = sessionStorage.getItem('userId')
        const token = sessionStorage.getItem('token')
        const { bookId } = this.props

        logicWallbook.retrieveBook(userId, bookId, token)
            .then(({ book: { volumeInfo } }) => {
                this.setState({ book: volumeInfo })
            })

    }

    toggle = () => {
        this.setState({
            modal: !this.state.modal,

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
    ratingChanged = (newRating) => {
        console.log(newRating)
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




    render() {

        const { book, review } = this.state
        return (

            <div>
                {
                    <div>
                        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                            <ModalHeader toggle={this.toggle} >Write your review</ModalHeader>
                            <ModalBody>
                                <FormGroup>
                                    <Label for="exampleTitle">TITLE</Label>
                                    <Input type="text" name="title" id="exampleTitle" placeholder="write title" />
                                </FormGroup>
                                <ReactStars
                                        count={5}
                                        onChange={this.setState.keepVote}
                                        size={24}
                                        color2={'#ffd700'} />
                                
                                <FormGroup>
                                    <Label for="exampleText">Text Area</Label>
                                    <Input type="textarea" name="text" id="exampleText" />
                                </FormGroup>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="primary" onClick={this.toggle} onChange={this.HandlelistReview}>Add review</Button>{' '}
                                <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                            </ModalFooter>
                        </Modal>


                        <Container className="container">
                            <Button className="btn-review" color="primary" onClick={this.toggle}>+ Add review</Button>

                            <Col xs="6" sm="4">
                                {book && <Card className="card">
                                    <CardHeader className="text-muted"><ReactStars
                                        count={5}
                                        onChange={this.ratingChanged}
                                        size={24}
                                        color2={'#ffd700'} /></CardHeader>
                                    <CardBody >
                                        <CardImg top width="100%" height="461px" src={book.imageLinks.thumbnail} alt="Card image cap" />
                                        <div className="card_cardbody">
                                            <CardTitle>{book.title}</CardTitle>
                                            <CardSubtitle>Author: {book.authors}</CardSubtitle>
                                            <CardText>{book.description.substring(0, 587)}</CardText>
                                        </div>
                                    </CardBody>
                                </Card>}
                            </Col>


                            <div className="card_cardbody">
                                {/* <CardTitle>{review.title}</CardTitle>
                                            <CardSubtitle>{review._vote}</CardSubtitle>
                                        <CardText>{review.description}</CardText> */}
                            </div>


                        </Container>
                    </div>
                }
            </div>

        )

    }

}
export default BookDetail;