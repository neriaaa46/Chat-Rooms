var express = require('express');
var router = express.Router();
const {validationServer} = require("../utils/middleware")
const {roomsValidation} = require("../utils/validation")
const {createNewRoom, getRooms, getMessages, getUsers, changeMessagesViewed} = require("../DAL/roomApi")


router.route('/')
.post(validationServer(roomsValidation), async function (req, res){
    try{
        const response = await createNewRoom(req.body)
        res.status(200).json(response)

    }catch(error){
        res.status(400).json({message: error.message})
    }
      
})

.get(async function (req, res){
    const {roomName} = req.query
    const response = await getRooms(roomName)
    res.status(200).json(response)
})


router.route('/messages')
.get(async function (req, res){
    const {id, skip} = req.query
    const response = await getMessages(id,skip)
    res.json(response)
})


router.route('/users/:id')
.get(async function (req, res){
    const {id} = req.params
    const response = await getUsers(id)
    res.json(response)
})

router.route('/changeViewed')
.put(async function (req, res){
    try{
        const messagesChanged = req.body
        changeMessagesViewed(messagesChanged)
        res.status(200).json({staus: "ok"})
    }catch(e){
        res.status(400).json({status: "failed"})
    }
})


module.exports = router