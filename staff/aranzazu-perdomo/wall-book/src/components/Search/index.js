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
// import Toggle from 'react-toggle'


class Search extends Component {
    toggle = this.toggle.bind(this);

    state = {

        query: "",
        searchBy: 'title',
        orderBy: 'relevance',
        books: [],
        collapsed: true,
        vote: []
    }

    toggle() {
        this.setState({
            collapsed: !this.state.collapsed,

        });
    }

    onToggleSearchBy = e => {
        e.preventDefault()

        const { searchBy } = this.state

        if (searchBy === 'title') {
            this.setState({ searchBy: 'author' })
        }
        else {
            this.setState({ searchBy: 'title' })
        }
    }

    onToggleOrderBy = e => {
        e.preventDefault()

        const { orderBy } = this.state

        if (orderBy === 'relevance') {
            this.setState({ orderBy: 'newest' })
        }
        else {
            this.setState({ orderBy: 'relevance' })
        }
    }

    keepQuery = e => this.setState({ query: e.target.value, error: '' })

    onSearch = event => {
        event.preventDefault()

        console.log("HOLA SUBMIT")
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

    onProfile = () => {
        const userId = sessionStorage.getItem('userId')
        this.props.onProfile(userId)
    }




    render() {
        const { books } = this.state

        return <Container className="container" >
            <Row className="justify-content-center">
                <Col xs="12" className="Search">
                    <Form onSubmit={this.onSearch} className="form-wrapper">
                        <InputGroup>
                            <Input id="searchInput" onChange={this.keepQuery} placeholder="Search for title, author, newest..." autoFocus="true" autoComplete="off" />
                            <Button id="Author" onClick={this.onToggleSearchBy}>{this.state.searchBy === 'title' ? 'author' : 'title'}</Button>
                            <Button id="Newest" onClick={this.onToggleOrderBy}>{this.state.orderBy === 'relevance' ? 'newest' : 'relevance'}</Button>

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
                                    <CardHeader className="text-muted">
                                        {/* <label>
                                            <Toggle
                                                defaultChecked={this.state.aubergineIsReady}
                                                className='custom-classname'
                                                onChange={this.handleAubergineChange} />
                                            <span>Custom className</span>
                                        </label> */}
                                    </CardHeader>
                                    <CardBody >
                                        <CardImg top width="100%" height="461px" src={book.thumbnail} alt="Card image cap" />
                                        <div className="card_cardbody">
                                            <CardTitle>{book.title}</CardTitle>
                                            <CardSubtitle>ISBN: {book.isbn.identifier}</CardSubtitle>
                                            <CardSubtitle>Language: {book.language}</CardSubtitle>
                                            <CardText>{description}</CardText>
                                        </div>
                                        <Button color="primary" target="_blank" onClick={() => this.props.onBookDetail(bookId)} >See reviews</Button>
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