'use strict'

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
        if (typeof value !== 'number') throw new Error(`invalid ${name}`)
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

                return this._call('authenticate', 'post', { 'Content-Type': 'application/json' }, JSON.stringify({ email, password }),200)
                    .then(res => res.json())
                    .then(({ id, token }) => { id, token })
            })

    },
    /**
     * Update a new Password with his/her email and a password 
     * @param {String} email
     * @param {String} password 
     * @param {String} newPassword
     * @param {String} token
     * 
     *  @returns {boolean} TRUE => if it is update new password correctly
     */
    updatePassword(email, password, newPassword) {
        return Promise.resolve()
            .then(() => {
                this._validateEmail(email)
                this._validateStringField("password", password)
                this._validateStringField("newPassword", newPassword)

                return this._call('/user/${email}/updatePassword', 'patch', { 'Content-Type': 'application/json', authorization: `bearer ${token}` }, JSON.stringify({ email, password, newPassword }))
                    .then(res => res.json())
                    .then(() => true)
            })
    },

    /**
     * Unregister user with his/her email and a password 
     * @param {String} email
     * @param {String} password 
     * @param {String} token 
     * 
     * @returns {boolean} TRUE => if it is unregister user correctly
     */
    unregister(email, password) {
        return Promise.resolve()
            .then(() => {
                this._validateEmail(email)
                this._validateStringField("password", password)

                return this._call('/unregister', 'delete', { 'Content-Type': 'aplication/json', authorization: `bearer ${token}` }, JSON.stringify({ email, password }))
                    .then(res => res.json())
                    .then(() => true)
            })
    },

    /**
     * Add review requiring different parameters
     * @param {String} userId
     * @param {String} book
     * @param {Number} _vote
     * @param {String} comment
     * @param {String} token
     * 
     * 
     * @returns {Response} response with message notifying review was added correctly
     */
    addReview(userId, book, _vote, comment) {
        return Promise.resolve()
            .then(() => {
                this._validateStringField("userId", userId)
                this._validateStringField("book", book)
                this._validateNumber("vote", _vote ? Number(_vote) : _vote)
                this._validateStringField("comment", comment)

                return this._call('/user/${userId}/reviews', 'post', { 'Content-Type': 'aplication/json', authorization: `bearer ${token}` }, JSON.stringify({ userId, book, _vote, comment }),201)
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
    listReviews(userId) {
        return Promise.resolve()
            .then(() => {
                this._call('user/user/${userId}/reviews', 'get', { 'Content-Type': 'aplication/json', authorization: `bearer ${token}` }, JSON.stringify({ userId }))
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
   deleteReviews(reviewId, userId){
    return Promise.resolve()
    .then(()=> {
        this._call('useruser/${userId}/reviews/${reviewId}', 'delete',{ 'Content-Type': 'aplication/json', authorization: `bearer ${token}` })
         .then(res => res.json())
         .then(() => true)
    })
   },
}
