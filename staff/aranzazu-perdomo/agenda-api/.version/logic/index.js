'use strict'
const validateMail = require('../utils/validate-mail/index')

const logic = {

    _users: null,

    _validateStringField(fieldName, fieldValue) {
        if (typeof fieldValue !== 'string' || !fieldValue.length) throw new LogicError(`invalid ${fieldName}`)
    },

    register(email, username ,password){

        return Promise.resolve()
            .then(() => {
                validateMail( email )
                this._validateStringField('username', username)
                this._validateStringField('password', password)

                return this._users.findOne({ email })
            })
            .then( user => {
                if (user) throw new LogicError(`email ${email} already exists`)

                const _user = { email, username, password }

                return this._users.insertOne(_user)

            })


    },

    authenticate(email,password){

        return Promise.resolve()
            .then(() => {
                validateMail( email )
                this._validateStringField('password', password)

                return this._users.findOne({ email })
            })
            .then(user => {
                if (!user) throw new LogicError(`email ${email} not exists`)

                if (user.password !== password) throw new LogicError('wrong credentials')

                return true

            })

    },

    addNote(email,title,content,date){

        return Promise.resolve()
            .then(() => {
                validateMail( email )
                this._validateStringField("title", title)
                this._validateStringField("content", content)
                this._validateStringField("date", date)

                return this._users.findOne({ email })

            })
            .then(user => {
                
                if (!user) throw new SuperError(`user ${email} not exists`)

                return this._users.updateOne({email}, {$push:{notes:{id,title,content,date}}})

                    .then(() => id)

            })




    }



  
}

class LogicError extends Error {
    constructor(message) {
        super(message)
    }
}

module.exports = { logic, LogicError }

