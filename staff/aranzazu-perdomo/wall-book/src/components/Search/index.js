import React, { Component } from "react"
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

} from "reactstrap"

import logicWallbook from "../../logic"
import swal from "sweetalert2"
import Style from './style.css'


class Search extends Component {
    toggleNavbar = this.toggleNavbar.bind(this);
    state = {
        query: "",
        searchBy: undefined,
        orderBy: undefined,
        books: [],
        collapsed: true
    }

    toggleNavbar() {
        this.setState({
            collapsed: !this.state.collapsed
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
            .then(books => this.setState({ books: books.books }))
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
        const { books } = this.state

        return <Container>

            <Card>
                <Container>
                    <div>
                        <Navbar color="dark" light>
                            <NavbarBrand href="/" className="mr-auto">Wall-book</NavbarBrand>
                            <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
                            <Collapse isOpen={!this.state.collapsed} navbar>
                                <Nav navbar>
                                    <NavItem>
                                        <NavLink href="/components/">Settings</NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink href="https://github.com/reactstrap/reactstrap">GitHub</NavLink>
                                    </NavItem>
                                </Nav>
                            </Collapse>
                        </Navbar>
                    </div>
                    <Row>
                        <Col xs="12">
                            <Form onSubmit={this.onSearch}>
                                <InputGroup>
                                    <Input id="searchInput" onChange={this.keepQuery} placeholder="Search a book..." autoFocus="true" autoComplete="off" />
                                    <InputGroupAddon addonType="append"><Button id="searchButton">Search</Button></InputGroupAddon>
                                    <Input id="searchType" onChange={this.keepSearchBy} placeholder="Choose a type..." autoComplete="off" />
                                    <Input id="searchOrder" onChange={this.keepOrderBy} placeholder="Choose a order..." autoComplete="off" />
                                </InputGroup>
                            </Form>
                        </Col>
                    </Row>

                    <Row>
                        {books.map(book => {
                            if (book.hasOwnProperty('description') && book.hasOwnProperty('thumbnail')) {
                                return (
                                    <Col xs="4">
                                        <Card>
                                            <CardHeader className="text-muted"><img className="icons" src="../../../public/icons/001-heart.png"></img></CardHeader>
                                            <CardBody>
                                                <CardImg top width="100%" src={book.thumbnail} alt="Card image cap" />
                                                <CardTitle>{book.title}</CardTitle>
                                                <CardSubtitle>ISBN: {book.isbn.identifier}</CardSubtitle>
                                                <CardSubtitle>Language: {book.language}</CardSubtitle>
                                                <CardText>{book.description.substring(0, 80)}...</CardText>
                                                <Button color="primary" target="_blank" rel="" href="/bookDetail" >See more</Button>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                )
                            }
                        })}
                    </Row>
                </Container>
            </Card>
        </Container>
    }
}
export default Search;