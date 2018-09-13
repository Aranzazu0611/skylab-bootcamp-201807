import React, { Component } from "react"
import swal from 'sweetalert2'
import logicWallbook from "../../logic"
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
        modal: false,
        modalLogin: false,
    }

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
        const { reviews, password } = this.state

        return (
            <Container>

                <Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>Update form</ModalHeader>
                    <form onSubmit={this.handleUpdatesubmit}>
                        <ModalBody className="text-left">
                            <div className="mb-2 ">
                                <i className="fa fa-user mr-4" />
                                <Label for="exampleEmail">Email</Label>
                                <Input type="text" onChange={this.keepEmail} name="Email" placeholder="Email" required autoFocus="true" />
                            </div>

                            <div className="mb-2">
                                <i className="fa fa-lock mr-4" />
                                <Label for="examplePassword">Password</Label>
                                <Input type="password" onChange={this.keepPassword} name="password" placeholder="Password" required />

                            </div>
                            <div className="mb-2">
                                <i className="fa fa-lock mr-4" />
                                <Label for="examplePassword">Password</Label>
                                <Input type="password" onChange={this.keepNewPassword} name="newpassword" placeholder="New Password" required />

                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                            <Button color="primary">Submit</Button>
                        </ModalFooter>
                    </form>
                </Modal>

                <Modal isOpen={this.state.modalLogin} toggle={this.loginToggle}>
                    <ModalHeader toggle={this.loginToggle}>Delete User</ModalHeader>
                    <form onSubmit={this.handleDeleteUser}>
                        <ModalBody className="text-left">
                            <div className="mb-2 ">
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





                <Row>
                    <Col xs="6" sm="4">
                        <Card className="card">
                            <CardBody >
                                <div className="card_cardbody">
                                    <CardTitle>Usuario: {this.props.email}</CardTitle>
                                    <Button id="btn-delete" color="primary" target="_blank" onClick={this.loginToggle}>Unregister</Button>
                                    <Button id="btn-update" color="primary" target="_blank" onClick={this.toggle}>Update</Button>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>

                    <Col xs="6" sm="8">
                        <ListGroup className="listReview mt-5">
                            {reviews && reviews.length > 0 && reviews.map(review => <ListGroupItem key={review._id}>
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
                                    {/* <a href="/profile" className="Delete" onClick={() => { this.handleDeleteReview(reviews.id) }}>X</a> */}
                                    <Button id="btn-delete" color="primary" target="_blank" onClick={() => { this.handleDeleteReview(review._id) }}>Borrar</Button>
                                </ListGroupItemText>

                            </ListGroupItem>
                            )}
                        </ListGroup>
                    </Col>
                </Row>

            </Container>
        )
    }
}

export default withRouter(Settings)