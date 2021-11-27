const mongoose = require("mongoose");

const SocketSchema = new mongoose.Schema({
  socketId: {type: String, required: true,  unique : true },
  userId: {type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true }
})

const UserSchema = new mongoose.Schema({
  userName: {type: String, required: true,  unique : true },
  email: {type: String, required: true,  unique : true },
  confirmEmail: {type: Boolean, required: true, default: false },
  password: {type: String, required: true },
  tabs: {type: {}, required: true, default: {} } 
})

const MessagesSchema = new mongoose.Schema({
  user: {type: String, required: true },
  date: {type: Date, default: Date.now, required: true },
  text: {type: String, required: true },
  view: {type: Boolean, required: true, default: false }
})

const RoomsSchema = new mongoose.Schema({
  roomName: {type: String, required: true, unique: true },
  admin: {type: {}, required: true },
  users: [{type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true }],
  messages: [{type: mongoose.Schema.Types.ObjectId, ref: "Messages", required: true }]
})

const Socket = mongoose.model("Socket", SocketSchema)
const Users = mongoose.model("Users", UserSchema)
const Messages = mongoose.model("Messages", MessagesSchema)
const Rooms = mongoose.model("Rooms", RoomsSchema)

module.exports = {roomsModel: Rooms, messagesModel: Messages, usersModel: Users, socketModel: Socket}
