var express = require('express');
var router = express.Router();
const {confirmEmail, verifyAccount} = require("../DAL/authenticationApi ");
const { sendEmailToResetPassword } = require('../utils/sendEmails');

router.route("/confirm/:token")
.get(async function(req, res){
    try{
       confirmEmail(req.params.token)
       res.status(302).redirect("https://chat-rooms-react-app.onrender.com/login")
    }catch(error){
        res.status(400).json({error: error.message})
    }
})


router.route('/resetPassword')
.post(async function (req, res){
    try{
        const {email} = req.body
        const [userDetails, resetPasswordToken] = await verifyAccount(email)
        sendEmailToResetPassword(userDetails, resetPasswordToken)
        res.status(200).json({message: "מייל אימות בדרך אליך, נא בדוק את תיבת המייל"})

    }catch(error){
        console.log(error)
        res.status(400).json({message: error.message})
    }
    
})


module.exports = router 