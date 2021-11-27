import {useEffect, useContext} from "react"
import {useDispatch} from "react-redux"
import {AuthContext} from '../Components/AuthContext'
import Loader from "./Loader"
import {updateTokens} from "../DAL/authenticationApi"


function Initialization(){

    const ctx = useContext(AuthContext)

    const dispatch = useDispatch()

    const login = () => {
        dispatch({type: 'LOGIN'})
    }

    const logout = () => {
        dispatch({type: 'LOGOUT'})
    }

    const start = () => {
        dispatch({type: 'START'})
    }

    useEffect(()=>{
        (async ()=>{
            const {accessToken} = await updateTokens()
            if(accessToken) {
                login()
                ctx.refreshToken(accessToken)
            } else {
                logout()
            }
            setTimeout(()=>{
                start()
            }, 350)
        })()
    },[])

    return <>
        <Loader/>
    </>
}

export default Initialization