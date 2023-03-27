var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require("cors");
const {connectDataBase} = require("./utils/dbConnect")
const {addUser, addMessage, deleteSocket} = require("./DAL/roomApi")

require("dotenv").config();
connectDataBase()

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const emailRouter = require('./routes/email');
const refreshTokenRouter = require('./routes/refreshToken');
const roomRouter = require('./routes/rooms');


var app = express();

app.use(express.static(path.join(__dirname, 'views')));

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/api/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/email', emailRouter);
app.use('/api/refreshToken', refreshTokenRouter);
app.use('/api/rooms', roomRouter);


var server = require('http').Server(app);

var io = require('socket.io')(server, { cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "DELETE"]
        }
    })


io.on('connection', (socket) => {

    socket.on('join', async({id, name, room}) => {

       socket.join(`${room.roomName}`)
       const tabs = await addUser(id, room.id, room.roomName, socket.id)

       if(tabs === 1){
        socket.emit('message', { message: {user: "", text: ""}})
        socket.broadcast.to(room.roomName).emit('message', { message: {user: "", text: `${name} joined .`}})
       }
    })

    socket.on('sendMessage', async({name, room, message, view}) => {

        const messageId = await addMessage(name, room.id, message, view) // message id

        socket.emit('message', { message: {_id: messageId, user: name, text: `${message}`, view, date: new Date(Date.now()) }})
        socket.broadcast.to(room.roomName).emit('message', { message: {_id: messageId, user: name, text: `${message}`, view, date: new Date(Date.now())}})

    })

    socket.on('changeViewedMessages', ({room, messagesChanged}) => {
        socket.broadcast.to(room.roomName).emit('changeViewed', {messagesChanged})
    })


    socket.on('disconnection', async({name, room}) => {
        const {tabs} = await deleteSocket(socket.id, room.roomName)
        if(!tabs){
            socket.broadcast.to(room.roomName).emit('message', { message: {user: "", text: `${name} left .`}})
        }
    })

    socket.on("disconnecting", async() => {
        for (const room of socket.rooms) {
          if (room !== socket.id) {
            const {name, tabs} = await deleteSocket(socket.id, room)
            if(!tabs){
                socket.broadcast.to(room).emit('message', { message: {user: "", text: `${name} left .`}})
            }
          }
        }
      })
})

module.exports = {app: app, server: server};
