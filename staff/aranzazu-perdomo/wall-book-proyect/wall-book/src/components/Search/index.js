import React, { Component } from "react"
import { withRouter } from 'react-router-dom'
import {
    Card,
    CardImg,
    CardBody,
    CardTitle,
    CardSubtitle,
    CardText,
    Button,
    Form,
    InputGroup,
    Input,
    Col,
    Row,
    
} from "reactstrap"

import logicWallbook from "../../logic"
import swal from "sweetalert2"
import './style.css'



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
        const { books, searchBy, orderBy } = this.state

        return <div className="section" >
            <div className="container-search">
                <Row className="justify-content-center">
                    <Col xs="12" className="Search">
                        <Form onSubmit={this.onSearch} className="form-inline md-form mr-auto mb-4">
                            <InputGroup>
                                <Input id="searchInput" onChange={this.keepQuery} placeholder="Search for title, author, newest..." autoFocus="true" autoComplete="off" />
                                <Input className="btn btn-primary" id="searchButton" type="submit" value="Search" />
                                <div className="buttons">
                                    <Button className="btn btn-warning" onClick={this.onToggleSearchBy}>{searchBy === 'title' ? 'author' : 'title'}</Button>
                                    <Button className="btn btn-success" onClick={this.onToggleOrderBy}>{orderBy === 'relevance' ? 'newest' : 'relevance'}</Button>
                                </div>
                            </InputGroup>
                        </Form>
                    </Col>
                </Row>
            </div>
            <div className="container-cards">
                <Row className="books-card justify-content-center ">
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
                                        <CardBody >
                                            <CardImg top width="100%" height="461px" src={book.thumbnail} alt="Card image cap" onClick={() => this.props.onBookDetail(bookId)} />
                                            <div className="card_cardbody">
                                                <CardTitle><span> {book.title}</span></CardTitle>
                                                <CardSubtitle className="subtitle"><span>ISBN:</span> {book.isbn.identifier}</CardSubtitle>
                                                <CardSubtitle className="subtitle"><span>Language:</span> {book.language}</CardSubtitle>
                                                <CardText> {description}</CardText>
                                            </div>
                                            <Button color="primary" target="_blank" onClick={() => this.props.onBookDetail(bookId)} >See reviews</Button>
                                        </CardBody>
                                    </Card>
                                </Col>
                            )
                        }
                    })}
                </Row>
            </div>
        </div>
    }
}
export default withRouter(Search);