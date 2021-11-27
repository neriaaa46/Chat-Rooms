const jwt = require("jsonwebtoken")

async function getTokens(jwtToken, refreshTokenCookie){
    if(jwtToken !== 'undefined'){
       return await createNewTokens(jwtToken) 

    } else{
       return await createNewTokens(refreshTokenCookie)
    }
}

async function createNewTokens(jwtToken){
    
    const decode = jwt.verify(jwtToken, process.env.SECRET_KEY) 
    const accessToken = jwt.sign({id:decode.id, userName:decode.userName}, process.env.SECRET_KEY, { expiresIn: '25m' })
    const refreshToken = jwt.sign({id:decode.id, userName:decode.userName}, process.env.SECRET_KEY, { expiresIn: '1y' })
    
    return {accessToken, refreshToken}

}

module.exports = {getTokens, createNewTokens}