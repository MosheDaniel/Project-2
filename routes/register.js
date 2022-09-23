const express = require("express")
const User = require("../models/User")
const router = express.Router()
const _ = require("lodash")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const joi = require("joi")
const { boolean } = require("joi")

const registerSchemaJoi = joi.object({
    name: joi.string().required().min(2),
    email: joi.string().required().min(6).email(),
    password: joi.string().required().min(6),
    biz: joi.boolean()
})


router.post("/", async (req,res)=>{
    try {
        // joi validation
        const {error} = registerSchemaJoi.validate(req.body)
        if(error) return res.status(400).send(error.message
            )

        // check for existing user
        let user = await User.findOne({email: req.body.email})
        if (user) return res.status(400).send("User already exist")

        // add new user
        user = new User(req.body)

        // encrypd password
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(user.password, salt)

        // create token
        const genToken = jwt.sign({_id: user._id, biz: user.biz}, process.env.secretKey)
        await user.save()
        res.status(201).send({token: genToken})

    } catch (error) {
       res.status(400).send("Error in Register" + error) 
    }
})


module.exports = router