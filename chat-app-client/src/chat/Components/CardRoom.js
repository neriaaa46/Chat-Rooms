import {useHistory} from "react-router-dom"

function CardRoom({room}){

    const history = useHistory()

    return<>
        <div className="room-card">
            <h5 className="text-center">{room.roomName}</h5>
            <hr className="mb-4"></hr>
            <p>Admin : {room.admin.name}</p>
            <p className="inside-room" onClick={()=>history.push(`/room/${room.roomName}`, room)}><b>Get Inside</b></p>
        </div>

    </>
}

export default CardRoom