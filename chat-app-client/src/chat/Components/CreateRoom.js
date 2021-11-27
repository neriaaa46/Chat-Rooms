import { useState } from "react"
import {Form, Row, Col, Container, Button} from "react-bootstrap"
import {roomName, validation} from "../Utils/validation"
import {createNewRoom} from "../DAL/roomsApi"
import {decodeJwtToken} from "../Utils/function"
import { useHistory } from "react-router"

function CreateRoom(){

    const history = useHistory()
    const {id} = decodeJwtToken()


    const [message, setMessage] = useState("")
    const [roomDetails, setRoomDetails] = useState({ 
        roomName,
        })

    async function submit(e){
        e.preventDefault()

        let isValid = true
        let room = {}


       for (const key in roomDetails) {

            room[key] = roomDetails[key].value
            setRoomDetails(validation({value:roomDetails[key].value,name:key},roomDetails))
            if (roomDetails[key].errors.length !==0){
                isValid = false
            }
        }

        if(isValid){
            room["admin"] = id
            const response = await createNewRoom(room)
            const {message} = await response.json()
            setMessage(message)

            if(response.ok){
                setTimeout(()=>{
                    history.push('/rooms')
                }, 2000)
                
            } else {
                setTimeout(()=>{
                    setMessage("")
                }, 4000)
            }
        }
    }
    


    return<>
    <Container className="container-base mt-4">
        <Form className="form-base">

            <h1 className="text-center mt-3 mb-4">Create Room</h1>

            <Row className="justify-content-center mt-5 ">

                <Col className="input-create-room" xs={11} md={7} lg={5}>
                    <Form.Group>
                        <Form.Control id="roomName" type="text" name="roomName" isInvalid={roomDetails["roomName"].inValid} placeholder="Room Name"
                        onBlur={(e)=>{setRoomDetails(validation(e.target, roomDetails))}}/>
                        {roomDetails["roomName"].errors.map((value,index)=>
                        {return <Form.Control.Feedback className="feedback" key={index} type="invalid"> {value} </Form.Control.Feedback>})}
                    </Form.Group>
                </Col>

                <div className="text-center">
                    <Button className="btn-base mb-3 mt-5" variant="dark" type="submit" onClick={(e)=>submit(e)}>
                        Create
                    </Button>
                </div>

                <Row className="message-base justify-content-center align-items-center mb-3">
                    {message&&<small>{message}</small>}
                </Row>

            </Row>
        </Form>
    </Container>
    </>
}

export default CreateRoom