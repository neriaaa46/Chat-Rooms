const {usersModel, messagesModel, roomsModel, socketModel} = require("../model/models")
const limitMessages = 50


async function createNewRoom(room){
    
    const roomExists = await roomsModel.findOne({roomName: room.roomName})
    if(roomExists) throw Error("קיים חדר בשם הזה")

    const user = await usersModel.findOne({_id: room.admin})
    room.admin = {id: user.id, name: user.userName}

    const rooms = new roomsModel(room)
    rooms.save()
    return {message: "חדר צא'ט נוצר בהצלחה"}
}


async function getRooms(roomName){

    let rooms

    if(roomName){
        rooms = await roomsModel.find({roomName})
    } else {
        rooms = await roomsModel.find()
    }
    rooms = rooms.map((room)=> { 
        return {id: room._id, roomName: room.roomName, admin: room.admin}
    })

    return rooms
}


async function getMessages(id, skip){

    let lastData 

    const nextData = await roomsModel.findOne({_id: id}).populate({
        path: 'messages', options: {sort: { '_id': -1 }, limit: limitMessages, skip: skip*limitMessages+1}})

    nextData.messages.length < limitMessages ? lastData = true : lastData = false
    
    const room = await roomsModel.findOne({_id: id}).populate({
        path: 'messages', options: {sort: { '_id': -1 }, limit: limitMessages, skip: skip*limitMessages}})

    return {lastData, nextMessages: room.messages.reverse()}
}


async function getUsers(id){
    const room = await roomsModel.findOne({_id: id}).populate('users', '_id userName')
    return room.users
}



async function changeMessagesViewed(messagesChanged){
    for(let i = 0 ; i < messagesChanged.length ; i ++ ){
        const message = await messagesModel.findOne({ _id: messagesChanged[i].id})
        message.view = true 
        message.save()
    }
}

async function addMessage(name, roomId, message, view){

    const messages = new messagesModel({user: name, text: message, view})
    messages.save()

    const room = await roomsModel.findOne({_id: roomId})
    room.messages.push(messages)
    room.save()

    return await messages._id
}

async function addUser(userId, roomId, roomName, socketId){

    const newConnection = new socketModel({socketId, userId})
    newConnection.save()

    const user = await usersModel.findOne({_id: userId})
    
    if (user.tabs[roomName]){
        user.tabs[roomName] += 1

    } else {
        user.tabs[roomName] = 1
    }
    user.markModified('tabs')
    user.save()
    

    if(user.tabs[roomName] === 1){
        const room = await roomsModel.findOne({_id: roomId})
        room.users.push(user._id)
        room.save()
    }

    return user.tabs[roomName]
}


async function deleteSocket(socketId, room){
    const {userId} = await socketModel.findOneAndDelete({socketId})
    const nameAndTabs = await deleteUser(userId, room)
    return nameAndTabs
 
}

async function deleteUser(userId, roomName){

    const user = await usersModel.findOne({_id: userId})
    
    if(user.tabs[roomName] > 1){
        user.tabs[roomName] -= 1 
    } else {
       delete user.tabs[roomName]
    }
    user.markModified('tabs')
    user.save()

    if(!user.tabs[roomName]){
        let room = await roomsModel.findOne({roomName})
        const users = room.users.filter(id => String(id) !== String(user._id))
        room.users = users
        room.save()
    }

    return {name: user.userName, tabs: user.tabs[roomName]}
}


module.exports = {createNewRoom, getRooms, getMessages, getUsers, changeMessagesViewed,
                 addUser, addMessage, deleteSocket}