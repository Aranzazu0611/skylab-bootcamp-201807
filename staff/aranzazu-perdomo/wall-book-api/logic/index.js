'use strict'

const validateEmail = require('../utils/validate-email/index')
const moment = require('moment')
const { User, Review } = require('../data/models')
const books = require("google-books-search-2")
const cloudinary = require('cloudinary')

const logic = {
    _validateStringField(name, value) {

        if (typeof value !== 'string' || !value.trim().length || value === '/n') throw new Error(`invalid ${name}`)
    },

    _validateEmail(email) {
        if (!validateEmail(email)) throw new Error('invalid email')
    },

    _validateNumber(name, value) {
        if (typeof value !== 'number') throw new Error(`invalid ${name}`)
    },

    register(email, name, password) {
        return Promise.resolve()
            .then(() => {
                this._validateEmail(email)
                this._validateStringField("name", name)
                this._validateStringField("password", password)

                return User.findOne({ email })
            })
            .then(user => {
                if (user) throw new Error(`user with ${email} email already exist`)

                return User.create({ email, name, password })
            })
            .then(() => true)

    },

    authenticate(email, password) {
        return Promise.resolve()
            .then(() => {
                this._validateEmail(email)
                this._validateStringField("password", password)

                return User.findOne({ email })
            })
            .then(user => {
                if (!user) throw new Error(`user with ${email} email already exist`)
                if (user.password !== password) throw new Error(`wrong password`)

                return true
            })
    },

    updatePassword(email, password, newPassword) {
        return Promise.resolve()
            .then(() => {
                this._validateEmail(email)
                this._validateStringField("password", password)
                this._validateStringField("newPassword", newPassword)

                return User.findOne({ email })
            })
            .then(user => {
                if (!user) throw new Error(`user with ${email} email already exist`)
                if (user.password !== password) throw new Error(`wrong password`)
                if (password === newPassword) throw new Error('new password must be different to old password')

                user.password = newPassword

                return user.save()

            })
            .then(() => true)

    },

    unregister(email, password) {
        return Promise.resolve()
            .then(() => {
                this._validateEmail(email)
                this._validateStringField("password", password)

                return User.findOne({ email })
            })
            .then(user => {
                if (!user) throw new Error(`user with ${email} email already exist`)
                if (user.password !== password) throw new Error(`wrong password`)

                return User.deleteOne({ _id: user._id })
            })
            .then(() => true)
    },

    addReview(email, book, vote, comment) {
        return Promise.resolve()
            .then(() => {
                this._validateEmail(email)
                this._validateStringField('book', book)
                this._validateNumber("vote", vote)
                this._validateStringField("comment", comment)

                return User.findOne({ email })
            })
            .then(user => {
                if (!user) throw new Error(`user with ${email} email already exist`)

                const review = { book, vote, comment, user: user.id }

                return Review.create(review)
            })
            .then(() => true)

    },

    listReviews(userId) {
        return Promise.resolve()
            .then(() => {
                return Review.find({ user: userId })
            })
            .then(reviews => {
                if (!reviews) throw new Error(`user ${userId} has no reviews`)

                return reviews
            })
    },
    deleteReviews(reviewId, userId) {
        return Promise.resolve()
            .then(() => Review.find({ user: userId, _id: reviewId }))
            .then(review => {
                if (!review || !review.length) throw new Error(`review ${reviewId} from user ${userId} not exist`)

                return Review.deleteOne({ _id: reviewId, user: userId })
            })
            .then(() => true)
    },

    searchBook(query, searchBy = 'title', orderBy = 'relevance') {
        if (searchBy !== undefined && typeof searchBy !== 'string') throw new Error(`invalid ${searchBy}`)
        if (orderBy !== undefined && typeof orderBy !== 'string') throw new Error(`invalid ${orderBy}`)

        return Promise.resolve()
            .then(() => {
                this._validateStringField("query", query)
                this._validateStringField("searchBy", searchBy)
                this._validateStringField("orderBy", orderBy)

                const options = {
                    field: searchBy,
                    offset: 0,
                    limit: 20,
                    type: 'books',
                    order: orderBy,
                    lang: 'es'
                };

                return books.search(query, options)
            })
            .then(results => results)
    },

    addFavorites(email, book) {
        return Promise.resolve()
            .then(() => {
                this._validateEmail(email)
                this._validateStringField("book", book)

                return User.find({ email })
            })
            .then(user => {
                if (!user) throw new Error(`user with ${email} email already exist`)

                user.favorites.push(book)

                return user.save()
            })
            .then(() => true)
    },

    listFavourites() {


    },

    updatePhoto(path) {
        //todo
        return Promise.resolve()
            .then(() => {

                return cloudinary.uploader.upload(path)
            })
            .then(results => results)
    }

}

module.exports = logic