'use strict'

const validateEmail = require('../utils/validate-email/index')
const moment = require('moment')
const { User } = require('../data/models')

const logic = {
    _validateStringField(name, value) {

        if (typeof value !== 'string' || !value.trim().length || value === '/n') throw new Error(`invalid ${name}`)
    },

    _validateEmail(email) {
        if (!validateEmail(email)) throw new Error('invalid email')
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
                
                user.password = password
                
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
    }


}

module.exports = logic