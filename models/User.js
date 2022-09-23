const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            require: true,
            minlength: 2
        },

        email: {
            type: String,
            require: true,
            minlength: 6,
            unique: true
        },

        password:{
            type: String,
            require: true,
            minlength: 6
        },

        biz:{
            type: Boolean,
            require: true           
        }
    }
)

const User = mongoose.model("users", userSchema)
module.exports = User