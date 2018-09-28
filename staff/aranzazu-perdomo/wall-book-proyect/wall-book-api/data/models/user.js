'use strict'

const moongose = require('mongoose')
const { User } = require('./schemas')

module.exports = moongose.model("User", User)
