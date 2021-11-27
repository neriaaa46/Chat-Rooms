import { useEffect, useState, useRef } from "react"
import { useLocation } from "react-router"
import {decodeJwtToken, date} from "../Utils/function"
import io from 'socket.io-client'
import { Container, Row} from "react-bootstrap"
import InfiniteScrollReverse from "react-infinite-scroll-reverse"
import {getMessges, getUsers, changeMessagesViewed} from "../DAL/roomsApi"
import {BiMessageDetail} from "react-icons/bi"
import {FaUsers} from "react-icons/fa"
import {BsCheck} from "react-icons/bs"


let socket 
let morePagination = true

function Room(){

    const ENDPOINT = "localhost:3100"
    const messagesEndRef = useRef()
    const {id, userName} = decodeJwtToken()
    const {state} = useLocation()

    const [room, setRoom] = useState(state) // id, roomName, admin
    const [name, setName] = useState(userName) // userName
    const [isLoading, setIsLoading] = useState(true)

    const [usersRoom, setUsersRoom] = useState([])
    const [bottom, setBottom] = useState(true)
    const [message, setMessage] = useState('') 
    const [messages, setMessages] = useState([])



    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({})
    }

    useEffect(()=>{scrollToBottom()}, [bottom])
  
    useEffect(()=>{
        getListUsers()
        getMoreMessages(1)
    }, [])

   
    useEffect(()=>{
        socket = io(ENDPOINT)
        socket.emit('join', {id, name, room}, ()=>{
        })

        return () => {
            socket.emit('disconnection', {name, room}, ()=>{
            })

            socket.off()
        }
    }, [])


    useEffect(() => {
        socket.on('message', ({message}) => {

            if(message.user === "" && message.text === "") {  // i joined
                getListUsers()

            } else if(message.user === "" && message.text !== ""){ //else user joined or left
                getListUsers()
                setMessages(messages => [ ...messages, message ])

            } else{
                setMessages(messages => [ ...messages, message ])
                setBottom(prev => !prev) // when get new mesage the scroller go bottom
            }       
        })
    }, [])


    useEffect(() => {
        socket.on('changeViewed', ({messagesChanged}) => {

            const messagesId = messagesChanged.map(message => {
                if(message.userName === name){
                    return message.id
                }
            })

            setMessages(messages => messages.map(message => {
                if (messagesId.includes(message._id)){
                    return { ...message, view: true }
                } else {
                    return message
                }
            }))
        })
    },[])


    function sendMessage(){
        if(message.trim()){
            let view 
            usersRoom.length > 1 ? view = true : view = false
            socket.emit('sendMessage', {name, room, message, view}, ()=>{
            })
            setMessage("")
        }
    }

    async function getListUsers(){
        const users = await getUsers(room.id) 
        setUsersRoom(users)
    }

    async function getMoreMessages(skip) {
        setIsLoading(true)
        const {lastData, nextMessages} = await getMessges(room.id, skip-1) 

        setTimeout(() => {
            setMessages([...nextMessages, ...messages])
            setIsLoading(false)
            viewedMessages(nextMessages)
        }, 300)

        if(lastData) {
            morePagination = false
        }
    }

    function  viewedMessages(nextMessages){
        const messagesChanged = nextMessages.map((message)=>{ 
            if(message.user !== name && message.view === false){
                message.view = true 
                return {id: message._id, userName: message.user }
            }
        }).filter(message => message !== undefined)

        if(messagesChanged.length > 0){

            socket.emit('changeViewedMessages', {room, messagesChanged}, ()=>{
            })

            changeMessagesViewed(messagesChanged)
        }
    }


    return <>
        <Container>
            <Row className="justify-content-center mt-4">
                <div className="chat-header">
                    <h4 className="text-center mt-2">Chat Room</h4>
                </div>


                <div className="chat-body">
                    <div className="chat-side-bar">
                        <div className="name-room">
                            <BiMessageDetail size={25} className="icon-msg"/> <h6>Room Name :</h6>
                        </div>

                        <div className="header-room">
                            <h4 className="text-center">{room.roomName}</h4>
                        </div>

                        <div>
                            <div className="name-room mb-2">
                                <FaUsers size={25} className="icon-msg"/>
                                 <h6>Users :</h6>
                            </div>
                            <div className="users-room">
                                {usersRoom.map((user, index)=> <p key = {index}>{user.userName}</p>)}
                            </div>
                        </div>
                    </div>

                    <div className="chat-message-textArea">
                        <InfiniteScrollReverse
                        className="chat-messages"
                        hasMore={morePagination}
                        isLoading={isLoading}
                        loadMore={getMoreMessages}
                        loadArea={50}
                        >
                            
                            {messages.map((message, index)=>{
                                return  <div key={index} ref = {index === messages.length-1 ? messagesEndRef : null } className={`chat-out ${message.user === name ? "left" : "right" }`}> 
                                            <span className={`chat-rectangle ${message.user === name ? "my-color" : "other-color" }`}>
                                                {message.user&&<p className="chat-rectangle-name-date my-0 pt-1 pb-0"> <span>{message.user}</span> <span>{date(message.date)}</span></p>}
                                                <div className="d-flex justify-content-between">
                                                    <p className="chat-rectangle-message">{message.text}</p>
                                                    {message.user===name&&<BsCheck size = {30} className={`${message.view ? "icon-v-view" : "icon-v-not-view"} mt-0 mb-0`}/>}                                         
                                                </div>
                                            </span>
                                        </div> 
                            })}
                        
                        </InfiniteScrollReverse>

                        <div className="textarea-message">
                            <textarea className="textArea" rows="2" value={message} onChange={(e)=>setMessage(e.target.value)}/>
                            <button className="btn-message" variant="primary" onClick = {sendMessage}>Send</button>
                        </div>
                    </div>
                    
                </div>


                <div className="chat-footer">
                    <p>Admin : {room.admin.name}</p>
                </div>
            </Row>
        </Container>
    </>
}

export default Room