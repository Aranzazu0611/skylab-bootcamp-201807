' use strict '

const { Schema } = require('mongoose')

function validatePassword(password) {
    if (password.length < 6) throw new Error('password length is too short')
}

module.exports = new Schema({

    email: {

        type: String,
        required: true,
        match: /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
    },

    name: {

        type: String,
        required: true,
    },

    password: {

        type: String,
        required: true,
        validate: validatePassword
    },

    photo: {

        type: String

    },

    favorites: [String]


})