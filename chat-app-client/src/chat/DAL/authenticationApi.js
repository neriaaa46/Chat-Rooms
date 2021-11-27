// import { inMemoryToken } from "../Components/AuthContext"
const baseUrl = "http://localhost:3100/api"


async function register(user){
    const response = await fetch(`${baseUrl}/users/register`, {
        method:'POST', 
        credentials: 'include',
        headers:{'Content-Type': 'application/json'}, 
        body: JSON.stringify(user)
    })
    return response
}

async function loginUser(user){
    const response = await fetch(`${baseUrl}/users/login`,{
        method: 'POST', 
        credentials: 'include',
        headers:{'Content-Type': 'application/json'}, 
        body: JSON.stringify(user)
    })
    return response
}


async function updateTokens(inMemoryToken){
    const response = await fetch(`${baseUrl}/refreshToken`, {
        method: 'POST', 
        credentials: 'include',
        headers:{'Content-Type': 'application/json', 
                 'authorization': `Bearer ${inMemoryToken}`}
    })
    return response.json()
}


async function logoutUser(){
    fetch(`${baseUrl}/users/logout`,{
        method: 'POST', 
        credentials: 'include', 
        headers:{'Content-Type': 'application/json'}
    }) 
} 


async function sendEmailToResetPassword(email){
    const response = await fetch(`${baseUrl}/email/resetPassword`, {
        method: 'POST', 
        credentials: 'include',
        headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify(email)
    })
    return response.json()
}



async function changePassword(reset){
    const response = await fetch(`${baseUrl}/users/changePassword`, {
        method: 'PUT', 
        cardentials: 'include',
        headers:{'Content-type': 'application/json'},
        body: JSON.stringify(reset)
    })
    return response
}


export {register, loginUser, updateTokens, logoutUser, sendEmailToResetPassword, changePassword}