'use strict'

const validateEmail = require('../utils/validate-email/index')
const moment = require('moment')
const { User, Review } = require('../data/models')
const books = require("google-books-search-2")
const cloudinary = require('cloudinary')

cloudinary.config({
    presentname: "xmjoy1y2",
    cloudname: "wallbook",
    apikey: 782539495716937,
})

const logic = {

    /**
     * Validates a field to be type of string and have a minimun length
     * @param {String} name 
     * @param {String} value 
     * 
     * @throws {LogicError} invalid name
     */
    _validateStringField(name, value) {
        if (typeof value !== 'string' || !value.trim().length || value === '/n') throw new LogicError(`invalid ${name}`)
    },
   
    /**
     * Validates a field to be type of email
     * @param {String} email
     *     * 
     * @throws {LogicError} invalid email
     */
    _validateEmail(email) {
        if (!validateEmail(email)) throw new LogicError('invalid email')
    },
  
    /**
     * Validates a field to be type of number
     * @param {String} name
     * @param {Number} value
     *  
     * @throws {LogicError} invalid name
     */
    _validateNumber(name, value) {
        debugger
        if (!Number.isInteger(value)) throw new LogicError(`invalid ${name}`)
    },
   
    /**
    * Registers an user with a email, name and password 
    * @param {String} email 
    * @param {String} name 
    * @param {String} password 
    * 
    * @throws {LogicError} if user with email already exist
    * 
    * @returns {boolean} TRUE => if it is registered correctly
    */
    register(email, name, password) {
        return Promise.resolve()
            .then(() => {
                this._validateEmail(email)
                this._validateStringField("name", name)
                this._validateStringField("password", password)

                return User.findOne({ email })
            })
            .then(user => {
                if (user) throw new LogicError(`user with ${email} email already exist`)

                return User.create({ email, name, password })
            })
            .then(() => true)

    },
   
    /**
     * Authenticate an user with his/her email and a password 
     * @param {String} email
     * @param {String} password 
     * 
     * @throws {LogicError} if user with email already exist
     * @throws {LogicError} if password is wrong
     * 
     * @returns {Object} user id
     */

    authenticate(email, password) {
        return Promise.resolve()
            .then(() => {
                this._validateEmail(email)
                this._validateStringField("password", password)

                return User.findOne({ email })
            })
            .then(user => {
                if (!user) throw new LogicError(`user with ${email} email does not exist`)
                if (user.password !== password) throw new LogicError('wrong password')

                return user._id.toString()
            })
    },
   
    /**
     * Update a new Password with his/her email and a password 
     * @param {String} email
     * @param {String} password 
     * @param {String} newPassword
     * 
     * @throws {LogicError} if user with email already exist
     * @throws {LogicError} if password is wrong
     * @throws {LogicError} if new password must be different to old password
     * 
     * @returns {boolean} TRUE => if it is update new password correctly
     */
    updatePassword(email, password, newPassword) {
        return Promise.resolve()
            .then(() => {
                this._validateEmail(email)
                this._validateStringField("password", password)
                this._validateStringField("newPassword", newPassword)

                return User.findOne({ email })
            })
            .then(user => {
                if (!user) throw new LogicError(`user with ${email} email already exist`)
                if (user.password !== password) throw new LogicError(`wrong password`)
                if (password === newPassword) throw new LogicError('new password must be different to old password')

                user.password = newPassword

                return user.save()

            })
            .then(() => true)

    },
   
    /**
     * Unregister user with his/her email and a password 
     * @param {String} email
     * @param {String} password 
     * 
     * @throws {LogicError} if user with email already exist
     * @throws {LogicError} if password is wrong
     *      
     * @returns {boolean} TRUE => if it is unregister user correctly
     */
    unregister(email, password) {
        return Promise.resolve()
            .then(() => {
                this._validateEmail(email)
                this._validateStringField("password", password)

                return User.findOne({ email })
            })
            .then(user => {
                if (!user) throw new LogicError(`user with ${email} email already exist`)
                if (user.password !== password) throw new LogicError(`wrong password`)

                return User.deleteOne({ _id: user._id })
            })
            .then(() => true)
    },
    
    /**
     * Add review requiring different parameters
     * @param {String} userId
     * @param {String} book
     * @param {Number} _vote
     * @param {String} comment
     * 
     * @throws {LogicError} if user with email already exist
     *      
     * @returns {boolean} TRUE => if it is add review correctly
     */
    addReview(userId, book, _vote, comment){
        let vote
        
        return Promise.resolve()
            .then(() => {
                vote = parseInt(_vote)

                debugger

                this._validateStringField("userId", userId)
                this._validateStringField("book", book)
                this._validateNumber("vote", vote)
                this._validateStringField("comment", comment)

                return User.findById(userId)
            })
            .then(user => {
                if (!user) throw new LogicError(`user with ${userId} does not exists`)

                const review = { book, vote, comment, user: user.id }

                return Review.create(review)
            })
            .then(() => true)
    },
   
    /**
    * List all reviews 
    * @param {String} userId
    * 
    * @throws {LogicError} if user has no reviws
    *      
    * @returns {Array} reviews information
    */
    listReviews(userId) {
        return Promise.resolve()
            .then(() => {

                return Review.find({ user: userId })
            })
            .then(reviews => {
                if (!reviews) throw new LogicError(`user ${userId} has no reviews`)

                return reviews
            })
    },
   
    /**
    * Delete reviews
    * @param {String} reviewId
    * @param {String} userId
    * 
    * @throws {LogicError} if reviews from user not exist
    *
    *      
    * @returns {Boolean} True =>if it is delete reviews correctly
    */
    deleteReviews(reviewId, userId) {
        return Promise.resolve()
            .then(() => Review.find({ user: userId, _id: reviewId }))
            .then(review => {
                if (!review || !review.length) throw new LogicError(`review ${reviewId} from user ${userId} not exist`)

                return Review.deleteOne({ _id: reviewId, user: userId })
            })
            .then(() => true)
    },
    
    /**
    * Search books whith different parameters
    * @param {String} query
    * @param {String} searchBy
    * @param {String} orderBy
    * 
    * @throws {LogicError} if invalid searchBy
    * @throws {LogicError} if invalid orderBy
    *      
    * @returns {Array} results => books information
    */
    searchBook(query, searchBy = 'title', orderBy = 'relevance') {
        return Promise.resolve()
            .then(() => {
                if (searchBy !== undefined && typeof searchBy !== 'string') throw new LogicError(`invalid ${searchBy}`)
                if (orderBy !== undefined && typeof orderBy !== 'string') throw new LogicError(`invalid ${orderBy}`)

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
    
    /**
     * Add favorites requiring different parameters
     * @param {String} userId
     * @param {String} book
     *
     * @throws {LogicError} if user with userId does not exists
     *
     * @returns {boolean} TRUE => if it is add favorites correctly
     */
    addFavorites(userId, book) {
        return Promise.resolve()
            .then(() => {
                
                this._validateStringField("userId", userId)
                this._validateStringField("book", book)

                return User.findById(userId)
            })
            .then(user => {
                if (!user) throw new LogicError(`user with ${userId} does not exists`)

                user.favorites.push(book)

                return user.save()
            })
            .then(() => true)
    },
   
    /**
    * List all favorites
    * @param {String} userId
    * 
    * @throws {LogicError} if user does not exists        
    * @returns {Array} books favorites 
    */
    listFavorites(userId) {
        return Promise.resolve()
            .then(() => {
                return User.findById(userId)
            })
            .then(user => {
                if (!user) throw new LogicError(`user ${userId} does not exists`)

                const bookPromises = user.favorites.map(isbn =>
                    this.searchBook(isbn, 'isbn').then(book => book[0])
                )

                return Promise.all(bookPromises)
            })
            .then(books => books)
    },
    
    /**
    * Delete favorites
    * @param {String} userId
    * @param {String} bookId
    * 
    * @throws {LogicError} if book from user not exist    
    * @returns {Boolean} True =>if it is delete favorites correctly
    */
    deleteFavorites(userId, bookId) {
        return Promise.resolve()
            .then(() => Review.find({ user: userId, _id: bookId }))
            .then(favorite => {
                if (!favorite || !favorite.length) throw new LogicError(`book ${bookId} from user ${userId} not exist`)

                return User.favorites.deleteOne({ user: userId, _id: bookId })
            })
            .then(() => true)

    },

    /**
    * Save image of profile
    * @param {String} userId
    * @param {String} base64Image
    * 
    * @returns {object} Photo Profile
    */
    saveImageProfile(userId, base64Image) {

        return Promise.resolve()
            .then(() => {
                return new Promise((resolve, reject) => {
                    return cloudinary.v2.uploader.upload(base64Image, function (err, data) {
                        if (err) return reject(err)
                        resolve(data.url)
                    })
                })
                    .then(urlCloudinary => {
                        return User.findByIdAndUpdate(userId, { photoProfile: urlCloudinary }, { new: true })
                            .then(user => {
                                return user.photoProfile
                            })
                    })
            })
    }

}

/**
 * To difference errors from logic to frequent errors
 * @class LOGIC ERROR => extends from Error
 */
class LogicError extends Error {
    constructor(message) {
        super(message)
    }
}

module.exports = { logic, LogicError }