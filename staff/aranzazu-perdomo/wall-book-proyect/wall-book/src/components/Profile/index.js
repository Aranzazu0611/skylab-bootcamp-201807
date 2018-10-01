import React, { Component } from "react"
import swal from 'sweetalert2'
import logicWallbook from "../../logic"
import { convertAllPropsToFalse } from "../../utils/object"
import { Redirect, withRouter } from "react-router";
import {
    Button,
    Form,
    FormGroup,
    Label,
    Input,
    FormText,
    Col,
    Card,
    CardSubtitle,
    CardBody,
    CardImg,
    CardTitle,
    ListGroup,
    ListGroupItem,
    ListGroupItemHeading,
    ListGroupItemText,
    Row,

} from 'reactstrap'
import ReactStars from 'react-stars'
import './style.css'

class Settings extends Component {
    state = {
        books: [],
        userId: sessionStorage.getItem('userId') || "",
        password: "",
        newPassword: null,
        token: sessionStorage.getItem('token') || "",
        redirectHome: false,
        modals: {
            modal: false,
            modalLogin: false,
            modalReviews: true,
            modalFavorites: true,
        },
        favorites: [],
        book: "",

    }

    toggle = () => {
        const modalsList = convertAllPropsToFalse(this.state.modals);
        this.setState(({ modals }) => ({
            modals: { ...modalsList, modal: !modals.modal }
        }));
    };

    showReviews = () => {
        const modalsList = convertAllPropsToFalse(this.state.modals);
        this.setState(({ modals }) => ({
            modals: { ...modalsList, modalReviews: !modals.modalReviews }
        }));
    };

    showFavorites = () => {
        return this.handleListFavorites()
            .then(() => {
                const modalsList = convertAllPropsToFalse(this.state.modals);
                this.setState(({ modals }) => ({
                    modals: { ...modalsList, modalFavorites: !modals.modalFavorites }
                }));
            })
    };

    loginToggle = () => {
        const modalsList = convertAllPropsToFalse(this.state.modals);
        this.setState(({ modals }) => {
            return ({ modals: { ...modalsList, modalLogin: !modals.modalLogin } })
        });
    };

    keepPassword = event => this.setState({ password: event.target.value })
    keepNewPassword = event => this.setState({ newPassword: event.target.value })

    handleUpdatesubmit = event => {
        event.preventDefault()

        const { state: { userId, password, newPassword, token } } = this

        return logicWallbook.updatePassword(userId, password, newPassword, token)
            .then(() =>
                swal({
                    title: "Success!",
                    text: "Update Password Sucessful",
                    type: "success",
                    confirmButtonText: "Cool"
                })
            )
            .catch(err =>
                swal({
                    title: "Failed! :(",
                    text: err,
                    type: "error",
                    confirmButtonText: "Try again"
                })
            );

    }

    componentDidMount() {
        this.listReviews()
        // .then(() => {
        //     const promises = this.state.reviews.map(elem => {
        //         this.handleRetrieveBook(elem.book)
        //     });
        //     return Promise.resolve(promises)
        // })
        this.props.email && this.handleRetrieveUser()

    }

    listReviews = () => {
        const userId = sessionStorage.getItem('userId')
        const token = sessionStorage.getItem('token')

        return logicWallbook.listReviews(userId, token)
            .then(reviews => this.setState({ reviews }))
            .then(() => {
                const promises = this.state.reviews.map(elem => {
                    this.handleRetrieveBook(elem.book)
                });
                return Promise.resolve(promises)
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


    handleDeleteUser = event => {
        event.preventDefault()

        const { state: { userId, password } } = this

      return logicWallbook.unregister(userId, password)
            .then(() =>
                swal({
                    title: "Success!",
                    text: "Delete User Sucessful",
                    type: "success",
                    confirmButtonText: "Cool"
                })

            )
            .then(() => this.props.onLogout(event))
            .catch(err =>
                swal({
                    title: "Failed! :(",
                    text: err,
                    type: "error",
                    confirmButtonText: "Try again"
                })
            );

    }

    handleDeleteReview = reviewId => {
        const { state: { userId, token } } = this

       return logicWallbook.deleteReviews(reviewId, userId, token)
            .then(() =>
                swal({
                    title: "Success!",
                    text: "Delete review Sucessful",
                    type: "success",
                    confirmButtonText: "Cool"
                })
                    .then(() => {
                        this.listReviews()
                    })

            )

            .catch(err =>
                swal({
                    title: "Failed! :(",
                    text: err,
                    type: "error",
                    confirmButtonText: "Try again"
                })
            );


    }

    handleListFavorites = () => {
        const { state: { userId, token } } = this

        return logicWallbook.listFavorites(userId, token)
            .then(favorites => { this.setState({ favorites }) })
            .catch(err =>
                swal({
                    title: "Failed! :(",
                    text: err,
                    type: "error",
                    confirmButtonText: "Try again"
                })
            );
    }

    handleRetrieveUser = () => {
        const { state: { userId, token } } = this

       return logicWallbook.retrieveUser(userId, token)
            .then(user => this.setState({ user }))
            .catch(err =>
                swal({
                    title: "Failed! :(",
                    text: err,
                    type: "error",
                    confirmButtonText: "Try again"
                }))
    }

    handleDeleteFavorite = favoriteId => {
        const { state: { userId, token } } = this

       return logicWallbook.deleteFavorite(userId, favoriteId, token)
            .then(() =>
                swal({
                    title: "Success!",
                    text: "Delete favorite Sucessful",
                    type: "success",
                    confirmButtonText: "Cool"
                })
                    .then(() => {
                        this.listFavorites()
                    })

            )
            .then(() => this.listFavorites())
            .catch(err =>
                swal({
                    title: "Failed! :(",
                    text: err,
                    type: "error",
                    confirmButtonText: "Try again"
                })
            );


    }

    handleRetrieveBook = id => {
        const { state: { userId, token, books } } = this
        return logicWallbook.retrieveBook(userId, id, token)
            .then(data => this.setState({ books: [...this.state.books, data] }))
    }


    render() {
        const { state: { reviews, modals, book, favorites, userId, token }, keepEmail, keepNewPassword, keepPassword, handleUpdatesubmit, handleDeleteUser } = this;
        const { modalReviews, modalLogin, modal, modalFavorites } = modals;

        const hasReviews = reviews && reviews.length > 0;


        return (
            <div className="Profile">

                <div className="container-fluid">
                    <div className="profile-card_cardbody">
                        {this.state.user && <img src={this.state.user.photoProfile} className="rounded-circle" />}
                        {this.state.user && <h4>Usuario: {this.state.user.name}</h4>}
                        <div className="buttons">
                            <Button className="btn btn btn-danger mr-3" onClick={this.loginToggle}>Unregister</Button>
                            <Button className="btn btn btn-danger mr-3" onClick={this.toggle}>Update</Button>
                            <Button className="btn btn btn-danger mr-3" onClick={this.showReviews}>Reviews</Button>
                            <Button className="btn btn btn-danger mr-3" onClick={this.showFavorites}>Favorite</Button>
                        </div>
                    </div>
                </div>

                {modalReviews && (
                    <div className="list">
                        <ListGroup className="listReview mt-5 ">
                            {hasReviews && reviews.map((review, index) => <ListGroupItem key={review._id}>
                                <ListGroupItemText className="listReview-vote">
                                    <ReactStars className="Starts"
                                        count={5}
                                        size={24}
                                        value={review.vote}
                                        color2={'#ffd700'}
                                        edit={false}
                                    />
                                </ListGroupItemText>
                                <ListGroupItemHeading className="listReview-book"><span>Libro:</span> {this.state.books && this.state.books[index] ? this.state.books[index].book.volumeInfo.title : ""}</ListGroupItemHeading>
                                <ListGroupItemHeading className="listReview-author"><span>Author:</span> {this.state.books && this.state.books[index] ? this.state.books[index].book.volumeInfo.authors[0] : ""}</ListGroupItemHeading>
                                <ListGroupItemHeading className="listReview-title"><span>Titulo:</span> {review.title}</ListGroupItemHeading>
                                <ListGroupItemText className="listReview-comentario">
                                    <span>Comentario:</span> {review.comment}
                                </ListGroupItemText>
                                <ListGroupItemText className="listReview-comentario">
                                    <Button id="btn-delete" color="primary" target="_blank" onClick={() => { this.handleDeleteReview(review._id) }}>Borrar</Button>
                                </ListGroupItemText>

                            </ListGroupItem>
                            )}
                            {!hasReviews && <ListGroupItem>No reviews added yet</ListGroupItem>}
                        </ListGroup>
                    </div>
                )}


                {modalLogin && (
                    <Col className="Unregister" sm={{ size: 6, offset: 1 }} md={{ size: 4, offset: 2 }}>
                        <Form className="Unregister-form text-center  form-register p-3 pl-5 pr-5 rounded" onSubmit={handleDeleteUser} isOpen={this.state.modalLogin} toggle={this.loginToggle}>
                            <h3>Unregister </h3>
                            <hr className="my-4" />
                            <FormGroup>
                                <Label className="titleRegister">Email</Label>
                                <Input className="m-3" type="text" onChange={keepEmail} name="Email" placeholder="Email" required autoFocus="true" />
                                <FormText>Email is required</FormText>
                            </FormGroup>
                            <FormGroup>
                                <Label for="examplePassword">Password</Label>
                                <Input className="m-3" type="password" onChange={keepPassword} name="password" placeholder="Password" required />
                            </FormGroup>
                            <Button className="m-2" color="danger" onClick={this.loginToggle}>Cancel</Button>
                            <Button className="m-2" color="primary" >Submit</Button>
                        </Form>
                    </Col>)
                }

                {modal && (
                    <Col className="Update" sm={{ size: 6, offset: 1 }} md={{ size: 4, offset: 2 }}>
                        <Form className="Update-form text-center  form-login p-3 pl-5 pr-5 rounded" onSubmit={handleUpdatesubmit} isOpen={this.state.modal} toggle={this.toggle}>
                            <h3>Update Password </h3>
                            <hr className="my-4" />
                            <FormGroup>
                                <Label for="exampleEmail">Email</Label>
                                <Input type="text" onChange={keepEmail} name="Email" placeholder="Email" required autoFocus="true" />
                            </FormGroup>
                            <FormGroup>
                                <Label for="examplePassword">Password</Label>
                                <Input type="password" onChange={keepPassword} name="password" placeholder="Password" required />
                            </FormGroup>
                            <FormGroup>
                                <Label for="examplenewPassword">Password</Label>
                                <Input type="password" onChange={keepNewPassword} name="newPassword" placeholder=" new Password" required />
                            </FormGroup>
                            <Button className="m-2" color="danger" onClick={this.toggle}>Cancel</Button>
                            <Button className="m-2" color="primary">Submit</Button>
                        </Form>
                    </Col>)
                }

                {modalFavorites && (

                    <Col className="favorites" md="6" sm="8">
                        {favorites.map((favorite, index) => <Card className="card" key={favorite.id}>
                            <CardBody className="favorite-body">
                                <CardImg top width="100%" height="461px" src={favorite.volumeInfo.imageLinks.thumbnail} alt="Card image cap" />
                              
                                    <CardTitle>{favorite.volumeInfo.title}</CardTitle>
                                    <CardSubtitle>Author: {favorite.volumeInfo.authors[0]}</CardSubtitle>
                                    <Button id="btn-delete" color="primary" target="_blank" onClick={() => { this.handleDeleteFavorite(favorites[index].id)}}>Borrar</Button>
                               
                            </CardBody>
                        </Card>)}
                    </Col>)}

            </div>
        )
    }
}

export default withRouter(Settings)