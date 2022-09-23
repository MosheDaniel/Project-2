const { number } = require('joi')
const mongoose = require('mongoose')

const cardSchema = new mongoose.Schema({

    bizName:{
        type: String,
        require: true
    },

    bizDescription: {
        type: String,
        require: true
    },

    bizAddress: {
        type: String,
        require: true
    },

    bizPhone: {
        type: String,
        require: true
    },

    bizImage: {
        type: String,
        require: true
    },

    bizNumber: {
        type: Number
    },
    userId:{
        type: String
    }
})

const Card = mongoose.model("cards", cardSchema)
module.exports = Card