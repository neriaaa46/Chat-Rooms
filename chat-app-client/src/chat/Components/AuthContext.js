import jwt from "jsonwebtoken"
import {createContext} from "react"; 
import {useHistory} from "react-router";
import {useDispatch} from "react-redux";
import {updateTokens} from "../DAL/authenticationApi"



const MINUTE = 60 
let inMemoryToken = ""



const AuthContext = createContext({
    refreshToken: () => {}
}); 



function AuthContextProvider({children}){

    const history = useHistory()
    const dispatch = useDispatch()

    const logout = () => {
        dispatch({type: 'LOGOUT'})
    }
    
    
    function getRefreshToken(token){
        inMemoryToken = token

        const decode = jwt.decode(token)
        setTimeout(async () => {
            const {accessToken} = await updateTokens(inMemoryToken)
            if(accessToken) {
                getRefreshToken(accessToken)
            } else {
                logout()
                history.push('/login')
            }
    
        }, (decode.exp - decode.iat - MINUTE*3)*1000)  
    }


    return <>
        <AuthContext.Provider value = {{refreshToken: getRefreshToken}}>
            {children}
        </AuthContext.Provider>
    </>
}

export  {AuthContext, AuthContextProvider, inMemoryToken}