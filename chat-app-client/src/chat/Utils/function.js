import { inMemoryToken } from "../Components/AuthContext";
import jwt from "jsonwebtoken"

function decodeJwtToken(){
    return jwt.decode(inMemoryToken)
}


function date(DateTime){

    let date
    let time

        date = DateTime.slice(0,10).split("-").reverse().join("/")
        time = DateTime.slice(11,16)

    return time +" "+date
}


export {decodeJwtToken, date}
