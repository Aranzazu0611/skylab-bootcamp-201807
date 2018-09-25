import React, { Component } from "react"
import logicWallbook from "../../logic"
import { Redirect, withRouter } from "react-router";
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
    FormGroup,
    Form,
    ListGroup,
    ListGroupItem,
    ListGroupItemHeading,
    ListGroupItemText,
    Row
} from "reactstrap"
import swal from "sweetalert2"
import ReactStars from 'react-stars'
import './style.css'
import Toggle from 'react-toggle'

class BookDetail extends Component {

    state = {
        modal: false,
        book: "",
        title: "",
        _vote: 0,
        comment: "",
        reviews: [],
        reviewId: "",
        globalVote: 0
    }

    componentDidMount() {
        const userId = sessionStorage.getItem('userId')
        const token = sessionStorage.getItem('token')
        const { bookId } = this.props

        logicWallbook.retrieveBook(userId, bookId, token)
            .then(({ book: { volumeInfo } }) => {
                return volumeInfo
            })
            .then(book => {
                this.setState({ book }, () => {
                    this.listReviewsByBook()
                })
            })
    }

    toggle = () => {
        this.setState({
            modal: !this.state.modal,

        });
    }



    keepTitle = e => this.setState({ title: e.target.value, error: '' })
    keepVote = rating => this.setState({ _vote: rating, error: '' })
    keepComment = e => this.setState({ comment: e.target.value, error: '' })

    listReviews = () => {


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

    listReviewsByBook = () => {

        const { bookId } = this.props

        const token = sessionStorage.getItem('token')
        const userId = sessionStorage.getItem('userId')

        logicWallbook.listReviewsByBook(bookId, userId, token)
            .then(reviews => this.setState({
                reviews: reviews,
                globalVote: this.getGlobalVote(reviews)
            }))
            .catch(err =>
                swal({
                    title: "Failed! :(",
                    text: err,
                    type: "error",
                    confirmButtonText: "Try again"
                })
            );
    }

    getGlobalVote(reviews) {
        return reviews && reviews.length ? reviews.reduce((accum, review) => accum + review.vote, 0) / reviews.length : 0
    }

    handleAddReview = e => {
        e.preventDefault()

        const { title, _vote, comment } = this.state
        const userId = sessionStorage.getItem('userId')
        const token = sessionStorage.getItem('token')
        const book = this.props.match.params.id

        logicWallbook.addReview(userId, book, title, _vote, comment, token)
            .then(() => {
                swal({
                    title: "Success!",
                    text: "Add review Sucessful",
                    type: "success",
                    confirmButtonText: "Cool"
                })
                    .then(() => {
                        this.setState({ modal: false, title: '', _vote: 0, comment: '' }, () => {
                            this.listReviewsByBook()
                        })
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

        const { book, reviews, globalVote } = this.state

        return (
            <div>
                {
                    <div>
                        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                            <ModalHeader toggle={this.toggle} >Write your review</ModalHeader>
                            <Form onSubmit={this.handleAddReview}>
                                <ModalBody>

                                    <FormGroup>
                                        <Label for="exampleTitle">TITLE</Label>
                                        <Input type="text" name="title" onChange={this.keepTitle} value={this.state.title} id="exampleTitle" placeholder="write title" />
                                    </FormGroup>
                                    <ReactStars
                                        count={5}
                                        onChange={this.keepVote}
                                        value={this.state._vote}
                                        size={24}
                                        color2={'#ffd700'} />

                                    <FormGroup>
                                        <Label for="exampleText">Text Area</Label>
                                        <Input type="textarea" name="comment" onChange={this.keepComment} value={this.state.comment} id="exampleText" />
                                    </FormGroup>
                                </ModalBody>
                                <ModalFooter>
                                    <Button type="submit" color="primary">Add review</Button>{' '}
                                    <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                                </ModalFooter>
                            </Form>
                        </Modal>


                        <Container className="container">
                            <Button className="btn-review" color="primary" onClick={this.toggle}>+ Add review</Button>
                            <Row className="justify-content-left">
                                <Col xs="6" xm="4">
                                    {book && <Card className="card">
                                        <CardHeader className="text-muted">
                                            <ReactStars
                                                count={5}
                                                size={24}
                                                value={globalVote}
                                                color2={'#ffd700'}
                                                edit={false}
                                            />
                                            <label>
                                                <Toggle
                                                    defaultChecked={this.state.aubergineIsReady}
                                                    className='custom-classname'
                                                    onChange={this.handleAubergineChange} />
                                                <span>Custom className</span>
                                            </label>
                                        </CardHeader>
                                        <CardBody >
                                            <CardImg top width="100%" height="461px" src={book.imageLinks.thumbnail} alt="Card image cap" />
                                            <div className="card_cardbody">
                                                <CardTitle>{book.title}</CardTitle>
                                                <CardSubtitle>Author: {book.authors}</CardSubtitle>
                                                <CardText>{book.description.substring(0, 299)}...</CardText>
                                            </div>
                                        </CardBody>
                                    </Card>}
                                </Col>


                                <div ClassName="reviews">
                                    <Col >
                                        {reviews.map(review => <ListGroup key={review.id}>
                                            <ListGroupItem active>
                                                <ListGroupItemHeading className="listReview-title">Titulo:{review.title}</ListGroupItemHeading>
                                                <ListGroupItemText className="listReview-vote">
                                                    <ReactStars
                                                        count={5}
                                                        size={24}
                                                        value={review.vote}
                                                        color2={'#ffd700'}
                                                        edit={false}
                                                    />
                                                </ListGroupItemText>
                                                <ListGroupItemText className="listReview-comentario">
                                                    Comentario: {review.comment}
                                                </ListGroupItemText>
                                            </ListGroupItem>
                                        </ListGroup>
                                        )}

                                    </Col>
                                </div>
                            </Row>


                        </Container>
                    </div>
                }
            </div>

        )

    }

}
export default withRouter(BookDetail);