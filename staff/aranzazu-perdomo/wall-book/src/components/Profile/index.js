import React, { Component } from "react"
import swal from 'sweetalert2'
import logicWallbook from "../../logic"
import { Redirect } from "react-router";
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

} from 'reactstrap'

class Settings extends Component {


    state = {

        userId: sessionStorage.getItem('userId') || "",
        password: "",
        newPassword: null,
        token: sessionStorage.getItem('token') || "",
        redirectHome: false,
        collapsed: true,
        modal: false,

    }

    toggle = () => {
        this.setState({
            modal: !this.state.modal,


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


    handleDelete = event => {
        event.preventDefault()

        const { state: { userId, password } } = this

    }


    render() {
        const { reviews } = this.state

        return (
            <Container>

                <Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>Registration form</ModalHeader>
                    <form onSubmit={this.handleUpdatesubmit}>
                        <ModalBody className="text-left">
                            <div className="mb-2 ">
                                <i className="fa fa-user mr-4" />
                                <Label for="exampleEmail">userId</Label>
                                <Input type="text" value={this.props.userId} name="userId" placeholder="userId" required autoFocus="true" />
                            </div>
                            <div className="mb-2">
                                <i className="fa fa-lock mr-4" />
                                <Label for="examplePassword">Password</Label>
                                <Input type="password" onChange={this.keepPassword} name="password" placeholder="Password" required />

                            </div>
                            <div className="mb-2">
                                <i className="fa fa-lock mr-4" />
                                <Label for="exampleNewPassword">New Password</Label>
                                <Input type="password" onChange={this.keepNewPassword} name="newPassword" placeholder="NewPassword" required />

                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                            <Button color="primary">Submit</Button>
                        </ModalFooter>
                    </form>
                </Modal>

                <Col xs="6" sm="4">
                    <Card className="card">
                        <CardHeader className="text-muted"></CardHeader>
                        <CardBody >

                            <div className="card_cardbody">
                                <CardTitle>Name: {this.props.name}</CardTitle>
                                <CardSubtitle>email: {this.props.email}</CardSubtitle>
                                <Button id="btn-logout" color="primary" target="_blank" onClick={this.props.onLogout}>Logout</Button>
                                <Button id="btn-delete" color="primary" target="_blank">Delete</Button>
                                <Button id="btn-update" color="primary" target="_blank" onClick={this.toggle}>Update</Button>

                            </div>
                            {/* <Button color="primary" target="_blank" onClick={() => this.props.onBookDetail(bookId)} >See more</Button> */}
                        </CardBody>
                    </Card>
                </Col>

                {reviews && reviews.length > 0 && <ul>{reviews.map(({ title }) => <li>{title}</li>)}</ul>}
            </Container>
        )
    }
}

export default Settings