'use strict'

const axios = require('axios')

const logicWallBookAxios = {
    _url() {

        return 'http://localhost:8080/api'
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


    register: function (email, name, password) {
        return axios.post(`${this._url()}/register`, { email, name, password })
    },

    authenticate: function (email, password) {
        return axios.post(`${this._url()}/authenticate`, { email, password })
    },

    unregister: function (email, password) {
        return axios.delete(`${this._url()}/unregister`, { email, password })
    },

    updatePassword: function (email, password, newPassword) {
        return axios.patch(`${this._url()}/user/${email}/updatePassword`, { email, password, newPassword })
    },

    addReview: function (userId, book, _vote, comment) {
        return axios.post(`${this._url()}/user/${userId}/reviews`, { userId, book, _vote, comment })
    },

    listReviews: function (userId) {
        return axios.get(`${this._url()}/user/${userId}/reviews`, { userId })
    },

    deleteReviews: function (reviewId, userId) {
        return axios.delete(`${this._url()}/user/${userId}/reviews/${reviewId}`, { reviewId, userId })
    },

    addFavorites: function (userId, book) {
        return axios.post(`${this._url()}/user/${userId}/favorites`, { userId, book })
    },

    listfavorites: function (userId) {
        return axios.get(`${this._url()}/user/${userId}/favorites`, { userId })
    },

    deleteFavourites: function (userId, bookId) {
        return axios.delete(`${this._url()}/user/${userId}/favorites/${bookId}`, { userId, bookId })
    },

    searchBook: function (query, searchBy, orderBy) {
        return axios.post(`${this._url()}/user/${userId}/searchbook`, { query, searchBy, orderBy })
    },

    saveImageProfile: function (userId, base64Image) {
        return axios.post(`${this._url()}/user/${userId}/saveimage`, { userId, base64Image })
    }

}
module.exports = logicWallBookAxios