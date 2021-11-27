var express = require('express')
var router = express.Router()
const {getTokens} = require("../utils/tokens")


router.route('/')
.post(async function(req, res){
    try{
        if (!req.cookies.refreshToken) throw Error
        const jwtToken = req.headers['authorization'].replace('Bearer ', '')        
        const {accessToken, refreshToken} = await getTokens(jwtToken, req.cookies.refreshToken)

        res.cookie("refreshToken", refreshToken, { httpOnly: true })
        res.status(200).json({accessToken})

    }catch(error){
        res.status(401).json({})
    }
    
})

module.exports = router