import React, { Component } from "react"
import logicWallbook from "../../logic"
import { Redirect } from "react-router";
import swal from "sweetalert2";


class Review extends Component {

    state = {

    }

    onAddReview = event => {
        event.preventDefault()
        const {book, _vote, comment } = this.state

        const userId = sessionStorage.getItem('userId')
        const token = sessionStorage.getItem('token')

        logicWallbook.addReview(userId, book, _vote, comment, token)
        .then(Review => )
        .catch(err =>
            swal({
                title: "Failed! :(",
                text: err,
                type: "error",
                confirmButtonText: "Try again"
            })
        );


    }

}
    export default Review