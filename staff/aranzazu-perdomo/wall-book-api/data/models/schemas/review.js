'use strict'

const { Schema, Schema: { ObjectId } } = require('mongoose')

module.exports = new Schema({
    user: {
        type: ObjectId,
        ref: 'User'
    },
    book: String,
    vote: Number,
    comment: String
})