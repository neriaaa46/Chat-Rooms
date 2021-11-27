const baseUrl = "http://localhost:3100/api"


async function createNewRoom(room){
    const response = await fetch(`${baseUrl}/rooms`, {
        method: 'POST', 
        credentials: 'include', 
        headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify(room)
    })
    return response
}

async function getRooms(roomName){
    const response = await fetch(`${baseUrl}/rooms?roomName=${roomName}`)
    return response.json()
}

async function getMessges(id, skip){
    const response = await fetch(`${baseUrl}/rooms/messages/?id=${id}&skip=${skip}`)
    return response.json()
}

async function getUsers(id){
    const response = await fetch(`${baseUrl}/rooms/users/${id}`)
    return response.json()
}

async function changeMessagesViewed(messagesChanged){
    const response = await fetch(`${baseUrl}/rooms/changeViewed`, {
        method: 'PUT', 
        credentials: 'include', 
        headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify(messagesChanged)
    })
    return response.json()
}


export {createNewRoom, getRooms, getMessges, getUsers, changeMessagesViewed}