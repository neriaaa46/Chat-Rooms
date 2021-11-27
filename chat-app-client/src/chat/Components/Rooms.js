import { useEffect, useState } from "react"
import { getRooms } from "../DAL/roomsApi"
import { Container, Row, Col, Spinner } from "react-bootstrap"
import CardRoom from "../Components/CardRoom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

function Rooms(){

    const [rooms, setRooms] = useState([]) // id, roomName, admin, roomType
    const [searchRoom, setSearchRoom] = useState('') // id, roomName, admin, roomType
    const [spinner, setSpinner] = useState(true) // id, roomName, admin, roomType

    useEffect(()=>{
        const timeToOpreate = setTimeout(async()=>{
            setSpinner(true)
            const search = await getRooms(searchRoom)
            setRooms(search)
            stopSpinner()
        }, 600)

        return () => {
            clearTimeout(timeToOpreate)
        }

    }, [searchRoom])


    function stopSpinner(){
        setTimeout(()=>{
            setSpinner(false)
        }, 400)
    }


    return <>
        <h1 className ="header text-center">Chat Rooms</h1>
        <Container>
            <div className=" mb-4 d-flex justify-content-center">
                <div className="search-rooms d-flex col-10 col-lg-4 col-md-6">
                    <input className="search-input" type='text' placeholder="Search Room" onChange={(e)=>setSearchRoom(e.target.value.trim())}></input>
                    <FontAwesomeIcon icon={faSearch} className="icon-search"/>
                </div>
            </div>

            {!spinner && rooms.length !== 0 &&<Row>
                {rooms.map((room, index) =>
                {return <Col key={index} xs={9} md={6} lg={4} className="mb-3 mx-auto mx-md-0">
                    <CardRoom room = {room}/>
                </Col>})}
            </Row>}

            {!spinner && rooms.length === 0 &&<Row>
                        <h3 className="text-center">No Results</h3>
                    </Row>}

            {spinner&&<div className="d-flex justify-content-center mt-5">
                        <h6 className="text-center">Loading</h6>
                        <Spinner animation="grow" size="sm" className="mx-2 my-auto"/>
                    </div>}
        </Container>
    </>
}

export default Rooms