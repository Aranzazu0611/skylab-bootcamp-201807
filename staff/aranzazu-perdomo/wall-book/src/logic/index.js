'use strict'
const validateEmail = require('../utils/validate-email/index')

const logicWallbook = {
    url: 'http://localhost:8080/api',

    _call(path, method, headers, body, expectedStatus) {
        const config = { method }

        if (headers) config.headers = headers
        if (body) config.body = body
        return fetch(`${this.url}/${path}`, config)
            .then(res => {
                if (res.status === expectedStatus) {
                    return res
                } else
                    return res.json()
                        .then(({ message }) => {
                            throw new Error(message)
                        })
            })
    },

    /**
   * Validates a field to be type of string and have a minimun length
   * @param {String} name 
   * @param {String} value 
   * 
   * @throws {Error} invalid name
   */
    _validateStringField(name, value) {
        if (typeof value !== 'string' || !value.trim().length || value === '/n') throw new Error(`invalid ${name}`)
    },

    /**
     * Validates a field to be type of email
     * @param {String} email
     *
     * @throws {Error} invalid  email
     */
    _validateEmail(email) {
        if (!validateEmail(email)) throw new Error('invalid email')
    },

    /**
     * Validates a field to be type of number
     * @param {String} name 
     * @param {Number} value 
     * 
     * @throws {Error} invalid name
     */
    _validateNumber(name, value) {
        debugger;
        if (!Number.isInteger(value)) throw new Error(`invalid ${name}`)
    },

    /**
    * Registers an user with a email, name and password 
    * @param {String} email 
    * @param {String} name 
    * @param {String} password 
    * 
    * @returns {boolean} TRUE => if it is registered correctly
    */

    register(email, name, password) {
        return Promise.resolve()
            .then(() => {
                this._validateEmail(email)
                this._validateStringField("name", name)
                this._validateStringField("password", password)

                return this._call('register', 'post', { 'Content-Type': 'application/json' }, JSON.stringify({ email, name, password }), 201)
                    .then(res => res.json())
                    .then(() => true)
            })
    },

    /**
     * Authenticate an user with his/her email and a password 
     * @param {String} email
     * @param {String} password 
     * 
     * 
     * @returns {Object} user id and token
     */

    authenticate(email, password) {
        return Promise.resolve()
            .then(() => {
                this._validateEmail(email)
                this._validateStringField("password", password)

                return this._call(
                    'authenticate',
                    'POST',
                    { 'Content-Type': 'application/json' },
                    JSON.stringify({ email, password }),
                    200
                )
                    .then(res => res.json())

            })

    },
    /**
     * Update a new Password with his/her email and a password 
     * @param {String} userId
     * @param {String} password 
     * @param {String} newPassword
     * @param {String} token
     * 
     *  @returns {boolean} TRUE => if it is update new password correctly
     */

    updatePassword(userId, password, newPassword, token) {
        return Promise.resolve()
            .then(() => {
                this._validateStringField("userId", userId)
                this._validateStringField("password", password)
                this._validateStringField("newPassword", newPassword)
                this._validateStringField("token", token)

                return this._call(`user/${userId}`, 'PATCH', { 'Content-Type': 'application/json', authorization: `Bearer ${token}` }, JSON.stringify({ password, newPassword }), 200)
                    .then(res => res.json())
                    .then(() => true)
            })
    },

    retrieveBook(userId, bookId, token) {
        return Promise.resolve()
            .then(() => {
                this._validateStringField("userId", userId)
                this._validateStringField("bookId", bookId)
                this._validateStringField("token", token)

                return this._call(`user/${userId}/book/${bookId}`, 'GET', { 'Content-Type': 'application/json', authorization: `Bearer ${token}` }, undefined, 200)
                    .then(res => res.json())
                    .then(res => res)
                //.then(() => true)
            })
    },

    /**
     * Unregister user with his/her email and a password 
     * @param {String} userId
     * @param {String} password 
     * @param {String} token 
     * 
     * @returns {boolean} TRUE => if it is unregister user correctly
     */

    unregister(userId, password) {
        return Promise.resolve()
            .then(() => {
                this._validateStringField("userId", userId)
                this._validateStringField("password", password)

                return this._call('unregister', 'delete', { 'Content-Type': 'application/json' }, JSON.stringify({ userId, password }), 200)
                    .then(res => res.json())
                    .then(() => true)
            })
    },

    /**
     * Add review requiring different parameters
     * @param {String} userId
     * @param {String} book
     * @param {String} title
     * @param {Number} _vote
     * @param {String} comment
     * @param {String} token
     * 
     * 
     * @returns {Response} response with message notifying review was added correctly
     */

    addReview(userId, book, title, _vote, comment, token) {
        debugger;
        return Promise.resolve()
            .then(() => {
                let vote = parseInt(_vote)

                this._validateStringField("userId", userId)
                this._validateStringField("book", book)
                this._validateStringField("title", title)
                this._validateNumber("vote", vote)
                this._validateStringField("comment", comment)

                return this._call(
                    `user/${userId}/reviews`,
                    'post',
                    {
                        'Content-Type': 'application/json',
                        authorization: `bearer ${token}`
                    },
                    JSON.stringify({ userId, book, title, vote, comment }),
                    201
                )
                    .then(res => res.json())
                    .then(res => res)
            })
    },

    /**
    * List all reviews 
    * @param {String} userId
    * @param {String} token
    *        
    * @returns {Response} all reviews in an array or an empty array
    */

    listReviews(userId, token) {
        debugger;
        return Promise.resolve()
            .then(() => {
                this._validateStringField('userId', userId)
                this._validateStringField('token', token)

                return this._call(`user/${userId}/reviews`, 'GET', { authorization: `Bearer ${token}` }, undefined, 200)
                    .then(res => res.json())
            })
    },

     /**
    * List all reviews by book 
    * @param {String} bookId
    * @param {String} userId
    * @param {String} token
    *        
    * @returns {Response} all reviews in an array or an empty array
    */

    listReviewsByBook(bookId, userId, token) {
        return Promise.resolve()
            .then(() => {
                this._validateStringField('bookId', bookId)
                this._validateStringField('userId', userId)
                this._validateStringField('token', token)
               
                return this._call(`user/${userId}/book/${bookId}/reviews`, 'GET', { authorization: `Bearer ${token}` }, undefined, 200)
                    .then(res => res.json())
                  
            })
    },

    /**
   * Delete reviews
   * @param {String} reviewId
   * @param {String} userId
   * @param {String} token
   * 
   * @returns {Boolean} True =>if it is delete reviews correctly
   */

    deleteReviews(reviewId, userId, token) {
        return Promise.resolve()
            .then(() => {
                this._validateStringField("reviewId", reviewId)
                this._validateStringField("userId", userId)
                this._validateStringField("token", token)

                return this._call(`user/${userId}/reviews/${reviewId}`, 'delete', { 'Content-Type': 'application/json', authorization: `bearer ${token}` }, undefined, 200)
                    .then(res => res.json())
                    .then(() => true)
            })
    },
    /**
    * Search books whith different parameters
    * @param {String} query
    * @param {String} searchBy
    * @param {String} orderBy
    * @param {String} token
    * 
    * @returns {Response} All books in an Array
    */
    searchBook(userId, query, searchBy = 'title', orderBy = 'relevance', token) {
        return Promise.resolve()
            .then(() => {
                this._validateStringField("userId", userId)
                this._validateStringField("query", query)
                this._validateStringField("searchBy", searchBy)
                this._validateStringField("orderBy", orderBy)

                return this._call(`user/${userId}/searchbook?query=${query}&searchBy=${searchBy}&orderBy=${orderBy}`, 'GET', { 'Content-Type': 'application/json', authorization: `bearer ${token}` }, undefined, 200)
                    .then(res => res.json())
            })
    },
    /**
    * Add favorites requiring different parameters
    * @param {String} userId
    * @param {String} bookId
    * @param {String} token
    * 
    *@returns {Response} response with message notifying favorites was added correctly
    */
    addFavorite(userId, bookId, token) {
        return Promise.resolve()
            .then(() => {
                this._validateStringField("userId", userId)
                this._validateStringField("bookId", bookId)
                this._validateStringField("token", token)


                return this._call(`user/${userId}/favorites`, 'post', { 'Content-Type': 'application/json', authorization: `Bearer ${token}` }, JSON.stringify({ bookId }), 201)
                    .then(res => res.json())
                    .then(res => res)
            })

    },

    /**
    * List all favorites
    * @param {String} userId
    * @param {String} token       
    *   
    * @returns {Response} all favorites in an array or an empty array 
    */

    listFavorites(userId, token) {
        return Promise.resolve()
            .then(() => {
                this._validateStringField("userId", userId)
                this._validateStringField("token", token)

            
                return this._call(`user/${userId}/favorites`, 'get', { 'Content-Type': 'application/json', authorization: `bearer ${token}` }, undefined, 200)
                    .then(res => res.json())
            })
    },

    /**
    * Delete favorites
    * @param {String} userId
    * @param {String} bookId
    * @param {String} token
    * 
    * 
    * @returns {Boolean} True =>if it is delete favorites correctly
    */

    deleteFavorite(userId, bookId, token) {
        return Promise.resolve()
            .then(() => {
                this._validateStringField("userId", userId)
                this._validateStringField("bookId", bookId)
                this._validateStringField("token", token)

                return this._call(`user/${userId}/favorites/${bookId}`, 'delete', { 'Content-Type': 'application/json', authorization: `bearer ${token}` }, undefined, 200)
                    .then(res => res.json())
                    .then(() => true)
            })
    },

    /**
  * Save image of profile
  * @param {String} userId
  * @param {String} base64Image
  * @param {String} token
  * 
  * @returns {Response} Photo Profile
  */
    saveImageProfile(userId, base64Image, token) {
        return Promise.resolve()
            .then(() => {
                this._validateStringField("userId", userId)
                this._validateStringField("base64Image", base64Image)
                this._validateStringField("token", token)

                return this._call(`user/${userId}/saveimage`, 'post', { 'Content-Type': 'application/json', authorization: `bearer ${token}` }, JSON.stringify({ userId, base64Image }), 201)
                    .then(res => res.json())
                    .then(res => res)
            })
    }

}
module.exports = logicWallbook;