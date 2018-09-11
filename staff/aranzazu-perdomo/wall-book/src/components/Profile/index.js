import React, { Component } from "react"
import swal from 'sweetalert2'
import logicWallbook from "../../logic"
import { Redirect } from "react-router";
import { Button, Form, FormGroup, Label, Input, FormText, Container } from 'reactstrap'

class Settings extends Component {

    state = {

        userId: "",
        password: "",
        newPassword: null,
        token: sessionStorage.getItem('token') || "",
        redirectHome: false

    }

    keepUserId = event => this.setState({ userId: event.target.value })
    keepPassword = event => this.setState({ password: event.target.value })
    keepNewPassword = event => this.setState({ newPassword: event.target.value })

    onUpdate = event => {
        event.preventDefault()

        const {userId, password, newPassword } = this.state

        logicWallbook.updatePassword(userId,password,newPassword,token)
        .then(token =>)
    }
    render() {
        return (
            <Col xs="6" sm="4">
                <Card className="card">
                    <CardHeader className="text-muted"></CardHeader>
                    <CardBody >
                        
                            <div className="card_cardbody">
                            <CardTitle>Name: {this.sessionStorage.getItem('name')}</CardTitle>
                            <CardSubtitle>email: {this.sessionStorage.getItem('email')}</CardSubtitle>
                            <Button id="btn-logout" color="primary" target="_blank" onClick={this.props.onLogout}>Logout</Button>
                            <Button id="btn-delete" color="primary" target="_blank" onClick={this.props.onLogout}>Delete</Button>
                            <Button id="btn-update" color="primary" target="_blank" onClick={this.onUpdate}>Update</Button>
                           
                        </div>
                        <Button color="primary" target="_blank" onClick={() => this.props.onBookDetail(bookId)} >See more</Button>
                    </CardBody>
                </Card>
            </Col>
        )
    }
}

export default Settings