'use strict'

const { Schema, Schema: { ObjectId } } = require('mongoose')

module.exports = new Schema({
    user: {
        type: ObjectId,
        ref: 'User'
    },
    book: { type: String },
    title: { type: String },
    vote: { type: Number },
    comment: { type: String },
})