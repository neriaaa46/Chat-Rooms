import {Form, Button, Row, Col, Container} from "react-bootstrap"
import {useState} from "react"
import {validation, userName, email, password, confirmPassword} from "../Utils/validation"
import {register} from "../DAL/authenticationApi"

function Register(){

    const [errorMessage, setErrorMessage] = useState("")
    const [validMessage, setValidMessage] = useState("")
    const [registerInputsDetails, setRegisterInputsDetails] = useState({ 
        userName,
        email: {...email, inValid: false, value: "", error: []},
        password: {...password, inValid: false, value: "", error: []},
        confirmPassword: {...confirmPassword, inValid: false, value: "", error: []}
        })

    async function submit(e){
        e.preventDefault()

        let isValid = true
        let user = {}

       for (const key in registerInputsDetails) {

            user[key] = registerInputsDetails[key].value
            setRegisterInputsDetails(validation({value:registerInputsDetails[key].value,name:key},registerInputsDetails, "register"))
            if (registerInputsDetails[key].errors.length !==0){
                isValid = false
            }
        }

        if(isValid){
            const response = await register(user)
            const {message} = await response.json()
            if(response.ok){
                setValidMessage(message)
            } else {
                setErrorMessage(message)
                setTimeout(()=>{
                    setErrorMessage("")
                }, 4500)
            }     
        }
    }


    return<>
        <Container className="container-base mt-4">
            <Form className="form-base"> 

                {!validMessage&&
                <Row className="justify-content-center">
                    <h1 className="text-center mt-3 mb-4">Register</h1>

                    <Col xs={10} md={8} lg={5}>
                        <Form.Group className="input-base">
                            <Form.Control id="userName" type="text" name="userName" isInvalid={registerInputsDetails["userName"].inValid} placeholder="Username"
                            onBlur={(e)=>{setRegisterInputsDetails(validation(e.target, registerInputsDetails, "register"))}}/>
                            {registerInputsDetails["userName"].errors.map((value,index)=>
                            {return <Form.Control.Feedback className="feedback" key={index} type="invalid"> {value} </Form.Control.Feedback>})}
                        </Form.Group>

                
                        <Form.Group className="input-base">
                            <Form.Control type="email" name="email" isInvalid={registerInputsDetails["email"].inValid} placeholder="Email"
                            onBlur={(e)=>{setRegisterInputsDetails(validation(e.target, registerInputsDetails, "register"))}}/>
                            {registerInputsDetails["email"].errors.map((value,index)=>
                            {return <Form.Control.Feedback className="feedback" key={index} type="invalid"> {value} </Form.Control.Feedback>})}
                        </Form.Group>
                    </Col>
                
                    <Col xs={10} md={8} lg={5}>  
                        <Form.Group className="input-base">
                            <Form.Control type="password" name="password" isInvalid={registerInputsDetails["password"].inValid} placeholder="Password"
                            onBlur={(e)=>{setRegisterInputsDetails(validation(e.target, registerInputsDetails, "register"))}}/>
                            {registerInputsDetails["password"].errors.map((value,index)=>
                            {return <Form.Control.Feedback className="feedback" key={index} type="invalid"> {value} </Form.Control.Feedback>})}
                        </Form.Group>
                
                        <Form.Group className="input-base">
                            <Form.Control type="password" name="confirmPassword" isInvalid={registerInputsDetails["confirmPassword"].inValid} placeholder="Confirm password"
                            onBlur={(e)=>{setRegisterInputsDetails(validation(e.target, registerInputsDetails, "register"))}}/>
                            {registerInputsDetails["confirmPassword"].errors.map((value,index)=>
                            {return <Form.Control.Feedback className="feedback" key={index} type="invalid"> {value} </Form.Control.Feedback>})}
                        </Form.Group>
            
                    </Col>

                    <div className="text-center">
                            <Button className="btn-base mb-3" variant="dark" type="submit" onClick={(e)=>submit(e)}>
                                Register
                            </Button>
                    </div>

                    <Row className="message-base justify-content-center align-items-center">
                    {errorMessage&&<small>{errorMessage}</small>}
                    </Row>
                    
                </Row>}


                {validMessage&&
                <Row className="valid-register">
                    <h1 className="register-valid-message-header mt-4 text-center">{validMessage}</h1>
                    <h4 className="register-valid-message-confirm text-center">In order to complete the sign-up process, please click the confirmation link in your inbox</h4>
                </Row>}
                
            </Form>
        </Container>
    </>
}

export default Register