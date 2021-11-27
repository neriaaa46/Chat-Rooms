function validation({value,name},inputsDetails){

    const newErrors = []
    let inValid = false
    const {validations} = inputsDetails[name]

    if(name==="userName" || name === "email" || name==="roomName"){
        value = value.trim()
    }
    
    if(validations.required && !value){
      newErrors.push(`נדרש - ${inputsDetails[name].name}`)
      inValid = true
    }

    if(validations.pattern && !validations.pattern.test(value)){
          newErrors.push(`${inputsDetails[name].name} - ${inputsDetails[name].appropriateError}`)
          inValid = true
    }

    if(name==="confirmPassword" && inputsDetails["password"].value !== value){
        newErrors.push("אין התאמה לסיסמא שנבחרה")
        inValid = true
    }
    
    inputsDetails[name].inValid = inValid
    inputsDetails[name].value = value
    inputsDetails[name].errors = newErrors 

    return inValid

}


const userName = {
    value: '',
    name:"שם משפחה",
    inValid:false,
    appropriateError:"אותיות וספרות בלבד",
    errors:[], 
    validations:{
        required: true, 
        pattern: /^[a-zA-Z0-9 \u0590-\u05fe]+$/i
    }
}

const email = {
    value: '',
    name:"דואר אלקטרוני",
    inValid:false,
    appropriateError:"לא תקין", 
    errors:[], 
    validations:{
        required: true, 
        pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ 
    }
} 

const password = {
    value: '',
    name:"סיסמא",
    inValid:false,
    appropriateError:"לפחות 6 תווים עם אות (אנגלית) וספרה",
    errors:[], 
    validations:{
        required: true, 
        pattern: /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.{6,})/ 
    }
}

const confirmPassword = {
    value: '',
    name:"אימות סיסמא",
    inValid:false,
    errors:[], 
    validations:{
        required: true, 
    }
}

const token = {
    value: '',
    name:"בדיקה",
    inValid:false,
    errors:[], 
    validations:{
        required: false, 
    }
}

const id = {
    value: '',
    name:"מספר מזהה",
    inValid:false,
    errors:[], 
    validations:{
        required: false,
    }
}

const roomName = {
    value: '',
    name:"שם חדר",
    inValid:false,
    appropriateError:"אותיות (אנגלית) וספרות",
    errors:[], 
    validations:{
        required: true,
        pattern: /^[a-zA-Z0-9 ]+$/i 
    }
}


const loginValidation = {
    email, 
    password
}

const registerValidation = {
    userName, 
    email, 
    password, 
    confirmPassword
}

const changePasswordValidation = {
    password, 
    confirmPassword,
    token
}

const roomsValidation = {
    id,
    roomName
}


module.exports =  {validation, loginValidation, registerValidation, changePasswordValidation, roomsValidation}