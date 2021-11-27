const jwt = require("jsonwebtoken")
const {validation} = require("./validation")


function verifyToken(req, res, next){
    const jwtToken = req.headers['authorization'].replace('Bearer ', '')
    try{
        jwt.verify(jwtToken, process.env.SECRET_KEY)
        next()
    }catch(error){
        res.status(400).json({message: 'עליך לבצע התחברות מחדש, הנך עובר לדף ההתחברות'})
    }
}

function verifyTokenChangePassword(req, res, next){
    const {token} = req.body
    try{
        jwt.verify(token, process.env.SECRET_KEY)
        next()
    }catch(error){
        res.status(400).json({message: 'תוקף עבר, עליך לבצע תהליך זה מחדש'})
    }
}

function validationServer(objectValidation){
    return function (req, res, next){
        try{
            const inputsDetails = req.body 
            let inValid = false

            if(Object.keys(inputsDetails).length !== Object.keys(objectValidation).length) throw Error

            for (const key in objectValidation) {
                if(validation({value: inputsDetails[key], name: key}, objectValidation)){
                    inValid = true
                }
            } 
            
            if(!inValid) {
                next()
            } else throw Error 

        } catch(error){
            res.status(400).send("אחד או יותר מהשדות אינם חוקיים")
        }
    }
}


module.exports = {verifyToken, validationServer, verifyTokenChangePassword}