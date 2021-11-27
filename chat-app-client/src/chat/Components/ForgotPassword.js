import {Form, Button, Row, Col, Container} from "react-bootstrap"
import {useState} from "react"
import { email ,validation} from "../Utils/validation"
import {sendEmailToResetPassword} from "../DAL/authenticationApi"

function ForgotPassword(){

    email.inValid = false 
    email.errors = [] 
    
    const [emailToResetPassword, setEmailToResetPassword] = useState({
          email: {...email, inValid: false, value: "", error: []}
        })
    const [message, setMessage] = useState("")


    async function submit(e){
        e.preventDefault()
        let isValid = true

        setEmailToResetPassword(validation({value:emailToResetPassword["email"].value, name:"email"}, emailToResetPassword, "forgotPassword"))
        if (emailToResetPassword["email"].errors.length !==0){
            isValid = false
        }
        
        if(isValid){
            const {message} = await sendEmailToResetPassword({email: emailToResetPassword["email"].value})
            setMessage(message)
            setTimeout(()=>{
                setMessage("")
            },4000)
        }
    }

    return <>
        <Container className="container-base mt-4">
            <Form className="form-base"> 
                
                <h1 className="text-center mt-3 mb-4">Forgot Password</h1>
                <Row className="justify-content-center">

                    <Col xs={11} md={8} lg={6}>
                        <Form.Group className="input-base">
                            <Form.Control type="email" name="email" isInvalid={emailToResetPassword["email"].inValid} placeholder="Email"
                            onBlur={(e)=>{setEmailToResetPassword(validation(e.target,emailToResetPassword, "forgotPassword"))}}/>
                            {emailToResetPassword["email"].errors.map((value,index)=>
                            {return <Form.Control.Feedback className="feedback" key={index} type="invalid"> {value} </Form.Control.Feedback>})}
                        </Form.Group>


                        <div className="text-center">
                            <Button className="btn-base mb-3" variant="dark" type="submit" onClick={(e)=>{submit(e)}}>
                                Submit
                            </Button>
                        </div>
                    </Col>

                    <Row className="message-base justify-content-center align-items-center mb-3">
                        {message&&<small>{message}</small>}
                    </Row>

                </Row>
                
            </Form>
        </Container>
    </>
}

export default ForgotPassword