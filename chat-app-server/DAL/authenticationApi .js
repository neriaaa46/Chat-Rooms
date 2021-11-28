const {usersModel} = require("../model/models")
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")
const {sendEmailToConfirm} = require("../utils/sendEmails")


async function register(userDetails){
    userDetails.password = await bcrypt.hash(userDetails.password, 10)
    
    const userNameExist = await usersModel.findOne({userName: userDetails.userName})
    const emailExist = await usersModel.findOne({email: userDetails.email})

    if(userNameExist){
         throw Error("שם משתמש קיים")

    } else if (emailExist){
        throw Error("אימייל קיים במערכת")

    } else{
        const user = new usersModel(userDetails)
        await user.save()
        sendEmailToConfirm(user)
        return {message: "Registration succeeded"}
    }
}


async function login({email, password}){
   
    const user = await usersModel.findOne({email: email})
    
    if(!user){
        throw Error("אימייל זה לא קיים במערכת")

    } else if(!await bcrypt.compare(password, user.password)){
        throw Error("סיסמא אינה נכונה")

    } else if(!user.confirmEmail){
        throw Error("חשבון לא אומת")

    } else {
        const accessToken = jwt.sign({id:user.id, userName: user.userName},process.env.SECRET_KEY, { expiresIn: '25m' })
        const refreshToken = jwt.sign({id:user.id, userName: user.userName}, process.env.SECRET_KEY, { expiresIn: '1y' })
        return {accessToken, refreshToken}
    }
}


async function confirmEmail(token){
    const decodeToken = jwt.verify(token, process.env.SECRET_KEY)
    const {id} = decodeToken
    
    const user = await usersModel.findOne({_id: id})
    user.confirmEmail = true 
    user.save()
}


async function verifyAccount(email){
    
    const user = await usersModel.findOne({email: email})
    if(!user) throw Error('חשבון זה לא קיים במערכת')
    
    const resetPasswordToken = jwt.sign({id:user.id, userName: user.userName}, process.env.SECRET_KEY, { expiresIn: '1h' })
    return [user, resetPasswordToken]
}


async function changePassword(password, token){
    password = await bcrypt.hash(password, 10)
    const {id} = jwt.decode(token)

    const user = await usersModel.findOne({id:id})
    user.password = password
    user.save()

    return {message: "איפוס סיסמא בוצע בהצלחה, הנך עובר לעמוד ההתחברות"}
}


module.exports = {register, confirmEmail, login, verifyAccount, changePassword}