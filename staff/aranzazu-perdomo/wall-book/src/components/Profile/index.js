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
    Container,
    Col,
    Card,
    CardHeader,
    CardBody,
    CardTitle,
    CardSubtitle,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Modal,
    ListGroup,
    ListGroupItem,
    ListGroupItemHeading,
    ListGroupItemText,
    Row
} from 'reactstrap'
import ReactStars from 'react-stars'
import './style.css'

class Settings extends Component {
    state = {
        userId: sessionStorage.getItem('userId') || "",
        password: "",
        newPassword: null,
        token: sessionStorage.getItem('token') || "",
        redirectHome: false,
        modals: {
            modal: false,
            modalLogin: false,
            modalReviews: true,
        },
        
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
   
    // showFavorites = () => {
    //     const modalsList = convertAllPropsToFalse(this.state.modals);
    //     this.setState(({ modals }) => ({
    //         modals: { ...modalsList, modalFavorites: !modals.modalFavorites }
    //     }));
    // };
    
    loginToggle = () => {
        const modalsList = convertAllPropsToFalse(this.state.modals);
        this.setState(({ modals }) => {
            return ({modals: { ...modalsList, modalLogin: !modals.modalLogin }})
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
    }

    listReviews = () => {
        const userId = sessionStorage.getItem('userId')
        const token = sessionStorage.getItem('token')

        logicWallbook.listReviews(userId, token)
            .then(reviews => this.setState({ reviews }))
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

        logicWallbook.unregister(userId, password)
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

        logicWallbook.deleteReviews(reviewId, userId, token)
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


    render() {
        const { state: { reviews, modals }, keepEmail, keepNewPassword, keepPassword, handleUpdatesubmit, handleDeleteUser } = this;
        const { modalReviews, modalLogin, modal } = modals;

        const shouldShowReviews = modalReviews && reviews && reviews.length;
   

        return (
            <div className="Profile">

             <Row className="profile-container">
                    <Col md="3" sm="12">
                        <Card className="card">
                            <CardBody >
                                <div className="card_cardbody">
                                    <CardTitle>Usuario: {this.props.email}</CardTitle>
                                    <Button id="btn-delete" color="primary" target="_blank" onClick={this.loginToggle}>Unregister</Button>
                                    <Button id="btn-update" color="primary" target="_blank" onClick={this.toggle}>Update</Button>
                                    <Button id="btn-reviews" color="primary" target="_blank" onClick={this.showReviews}>Reviews</Button>
                                    <Button id="btn-favorite" color="primary" target="_blank" onClick={this.showFavorites}>Favorite</Button>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>

                    <Col md="6" sm="8">
                        <ListGroup className="listReview mt-5">
                            {shouldShowReviews && reviews.map(review => <ListGroupItem key={review._id}>
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
                                <ListGroupItemText className="listReview-comentario">
                                    <Button id="btn-delete" color="primary" target="_blank" onClick={() => { this.handleDeleteReview(review._id) }}>Borrar</Button>
                                </ListGroupItemText>

                            </ListGroupItem>
                            )}
                            {(!reviews || !reviews.length) && <ListGroupItem>No reviews added yet</ListGroupItem>}
                        </ListGroup>
                    </Col>
                </Row>

                {modalLogin && (
                    <Col sm={{ size: 10, offset: 1 }} md={{ size: 4, offset: 2 }}>
                        <Form className=" text-center  form-register p-3 pl-5 pr-5 rounded" onSubmit={handleDeleteUser} isOpen={this.state.modalLogin} toggle={this.loginToggle}>
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
                <Col sm={{ size: 10, offset: 1 }} md={{ size: 4, offset: 2 }}>
                    <Form className="text-center  form-login p-3 pl-5 pr-5 rounded" onSubmit={handleUpdatesubmit} isOpen={this.state.modal} toggle={this.toggle}>
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
            </div>
        )
    }
}

export default withRouter(Settings)