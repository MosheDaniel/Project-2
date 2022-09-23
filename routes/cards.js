const express = require("express")
const router = express.Router()
const auth = require("../middlewares/auth") 
const Card = require("../models/Card")
const joi = require("joi")
const _ = require("lodash")

const cardSchemaJoi = joi.object({
    bizName: joi.string().required(),
    bizDescription: joi.string().required(),
    bizAddress: joi.string().required(),
    bizPhone: joi.string().required(),
    bizImage: joi.string().required(),
    bizNumber: joi.number(),
    userId: joi.string()
})

router.post("/", auth, async (req, res)=>{

    try {
        //joi validation
    const {error} = cardSchemaJoi.validate(req.body)
    if(error) return res.status(400).send(error.message)

    //add new card
    let card = new Card(req.body)

    //create random number
    let bizFlag = true

    while(bizFlag){
        let newBizNum = _.random(1, 1000)
        let checkCard = await Card.findOne({bizNumber: newBizNum})
        if(!checkCard) bizFlag = false
        card.bizNumber = newBizNum
        card.userId = req.payload._id
    }
    await card.save()
    res.status(201).send(card)
 
    } catch (error) {
         res.status(400).send(error);
    }})

   // Get all cards
    router.get("/all", auth, async (req, res)=>{
        try {
           const cards = await Card.find()
           if(!cards) return res.status(404).send("No cards found")
           res.status(200).send(cards)

        } catch (error) {
            res.status(400).send(error);
        }
    })

      // Get all user's cards
    router.get("/myCards", auth, async (req, res)=>{
        try {
            const cards = await Card.find({userId: req.payload._id})
            if(!cards) return res.status(404).send("No cards found")
            res.status(200).send(cards)

        } catch (error) {
            res.status(400).send(error); 
        }
    })

    // card details by id
    router.get("/:id", auth, async (req, res)=>{
        try {
            let card = await Card.findById(req.params.id)
            if(!card) return res.status(404).send("No Such Card")
            res.status(200).send(card)
        } catch (error) {
           res.status(400).send(error); 
        }
    })

    //  Update card by id
    router.put("/:id", auth, async (req, res)=>{
        try {
           //joi validation
            const {error} = cardSchemaJoi.validate(req.body)
            if(error) return res.status(400).send(error.message)

            // Update card
            let card = await Card.findByIdAndUpdate(req.params.id, req.body, {new: true})
            if(!card) return res.status(400).send("No Such Card")
            res.status(200).send(card)
        } catch (error) {
           res.status(400).send(error);  
        }
    })

    //  Remove card by id
    router.delete("/:id", auth, async (req, res)=>{
        try {
        let card = await Card.findByIdAndRemove(req.params.id)
        if(!card) return res.status(404).send("No Such Card")
        res.status(200).send("Card removed successfully")
        } catch (error) {
            res.status(400).send(error); 
        }
    })

module.exports = router