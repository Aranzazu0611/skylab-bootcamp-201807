import React, { Component } from "react"
import {
    Button,
    Form,
    InputGroup,
    InputGroupAddon,
    Input,
} from "reactstrap"

import logicWallbook from "../../logic"
import swal from "sweetalert2";


class Search extends Component {
    state = {
        userId: "",
        query: "",
        searchBy: "",
        orderBy: "",
        books: []
    }

    keepUserId = e => this.setState({ userId: e.target.value, error: '' })
    keepQuery = e => this.setState({ query: e.target.value, error: '' })
    keepSearchBy = e => this.setState({ searchBy: e.target.value, error: '' })
    keepOrderBy = e => this.setState({ orderBy: e.target.value, error: '' })

    onSearch = event => {
        event.preventDefault()
        const { query } = this.state

        logicWallbook.searchBook(userId, query, searchBy, orderBy)
            .then(res => this.state({ res: books }))
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
        return <div id="searchPanel">

            <Form onSubmit={this.onSearch}>
                <InputGroup>
                    <Input id="searchInput" onChange={this.keepQuery} placeholder="Search a book..." autoFocus="true" autoComplete="off" />
                    <InputGroupAddon addonType="append"><Button id="searchButton">Search</Button></InputGroupAddon>
                </InputGroup>
            </Form>
        </div>
    }
}

export default Search