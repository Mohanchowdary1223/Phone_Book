const mongoose = require('mongoose')

const phoneSchema = new mongoose.Schema(({
    name : { type : String, required : true },
    phone : { type : String, required : true }
}))

const PhoneBook = mongoose.model('numbers', phoneSchema)

module.exports = PhoneBook