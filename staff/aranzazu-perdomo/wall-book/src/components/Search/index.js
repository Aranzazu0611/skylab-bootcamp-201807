import React, { Component } from "react"
import { Switch, Route, withRouter, Redirect } from 'react-router-dom'
import {
    Card,
    CardImg,
    CardBody,
    CardHeader,
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
    Row,
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    ReactStars

} from "reactstrap"

import logicWallbook from "../../logic"
import swal from "sweetalert2"
import Style from './style.css'
import './style.css'
// import ReactStars from 'react-stars'




class Search extends Component {
    toggle = this.toggle.bind(this);

    state = {
       
        query: "",
        searchBy: undefined,
        orderBy: undefined,
        books: [],
        collapsed: true,
        dropdownOpen: false,
        vote: []
    }

    toggle() {
        this.setState({
            collapsed: !this.state.collapsed,
            dropdownOpen: !this.state.dropdownOpen
        });
    }

    keepQuery = e => this.setState({ query: e.target.value, error: '' })
    keepSearchBy = e => this.setState({ searchBy: e.target.value, error: '' })
    keepOrderBy = e => this.setState({ orderBy: e.target.value, error: '' })

    onSearch = event => {
        event.preventDefault()
        const { query, searchBy, orderBy } = this.state

        const token = sessionStorage.getItem('token')
        const userId = sessionStorage.getItem('userId')

        logicWallbook.searchBook(userId, query, searchBy, orderBy, token)
            .then(books => {
                this.setState({ books: books.books })
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


    // ratingChanged = (vote) => {
    //     this.setState('vote')
    // }


    render() {
        const { books } = this.state

        return <Container className="container" >

            <div>
                <Navbar color="dark" light >
                    <NavbarBrand href="/" className="mr-auto">Wall-book</NavbarBrand>
                    <Button id="btn-profile" color="primary" target="_blank"  onClick={this.props.onProfile}>Profile</Button>
                    <Button id="btn-logout" color="primary" target="_blank" onClick={this.props.onLogout}>Logout</Button>
                </Navbar>
            </div>
            <Row className="justify-content-center">
                <Col xs="12" className="Search">
                    <Form onSubmit={this.onSearch} className="form-wrapper">
                        <InputGroup>
                            <Input id="searchInput" onChange={this.keepQuery} placeholder="Search for title, author, newest..." autoFocus="true" autoComplete="off" />
                            <Input type="submit" value="Author" id="Author" />
                            <Input type="submit" value="Newest" id="Newest" />
                            <Input type="submit" value="Search" id="submit" />
                        </InputGroup>
                    </Form>
                </Col>
            </Row>

            <Row className="justify-content-center">
                {books.map(book => {
                    if (book.hasOwnProperty('description') && book.hasOwnProperty('thumbnail') && book.hasOwnProperty('isbn') && book.hasOwnProperty('infoLink')) {
                        const { infoLink } = book
                        const bookId = infoLink.substring(infoLink.indexOf('id') + 3, infoLink.indexOf('&'))
                        let description = book.description

                        if (description.length > 350) {
                            description = description.substring(0, 350) + "..."
                        }


                        return (
                            <Col xs="6" sm="4">
                                <Card className="card">
                                    <CardHeader className="text-muted"></CardHeader>
                                    <CardBody >
                                        <CardImg top width="100%" height="461px" src={book.thumbnail} alt="Card image cap" />
                                        <div className="card_cardbody">
                                            <CardTitle>{book.title}</CardTitle>
                                            <CardSubtitle>ISBN: {book.isbn.identifier}</CardSubtitle>
                                            <CardSubtitle>Language: {book.language}</CardSubtitle>
                                            {/* <ReactStars
                                                count={5}
                                                onChange={ratingChanged}
                                                size={24}
                                                color2={'#ffd700'} /> */}

                                            <CardText>{description}</CardText>
                                        </div>
                                        <Button color="primary" target="_blank" onClick={() => this.props.onBookDetail(bookId)} >See more</Button>
                                    </CardBody>
                                </Card>
                            </Col>
                        )
                    }
                })}
            </Row>

        </Container >
    }
}
export default withRouter(Search);