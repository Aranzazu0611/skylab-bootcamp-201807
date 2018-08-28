'use strict'

const mongoose = require('mongoose')
const  { Reviews } = require('./schemas')

module.exports = mongoose.model("Reviews", Reviews)