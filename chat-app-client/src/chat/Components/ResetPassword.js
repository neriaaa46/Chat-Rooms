import {Form, Button, Row, Col, Container} from "react-bootstrap"
import { useState } from "react"
import { useParams, useHistory } from "react-router"
import { confirmPassword, password, validation } from "../Utils/validation"
import {changePassword} from "../DAL/authenticationApi"

function ResetPassword(){

    let { token } = useParams()
    const history = useHistory()

    const [resetPassword, setResetPassword] = useState({
        password: {...password, inValid: false, value: "", error: []}, 
        confirmPassword: {...confirmPassword, inValid: false, value: "", error: []}
    })

    const [message, setMessage] = useState("")


    async function submit(e){
        e.preventDefault()
        let isValid = true
            let reset = {}
    
           for (const key in resetPassword) {
    
            reset[key] = resetPassword[key].value
                setResetPassword(validation({value:resetPassword[key].value,name:key},resetPassword, "login"))
                if (resetPassword[key].errors.length !==0){
                    isValid = false
                }
            }
    
            if(isValid){
                reset["token"] = token
                const response = await changePassword(reset)
                const {message} = await response.json()
                setMessage(message)
                if(response.ok){
                    setTimeout(()=>{
                        setMessage("")
                        history.push("/login")
                    }, 3000)
                } else {
                    setTimeout(()=>{
                        setMessage("")
                    }, 3000)
                }
                
            }
    }



    return <>
         <Container className="container-base mt-4">
            <Form className="form-base"> 
                <h1 className="text-center mt-3 mb-4">Reset Password</h1>
                <Row className="justify-content-center">

                    <Col xs={11} md={8} lg={6}>
                        <Form.Group className="input-base">
                            <Form.Control type="password" name="password" isInvalid={resetPassword["password"].inValid} placeholder="Password"
                            onBlur={(e)=>{setResetPassword(validation(e.target,resetPassword, "resetPassword"))}}/>
                            {resetPassword["password"].errors.map((value,index)=>
                            {return <Form.Control.Feedback className="feedback" key={index} type="invalid"> {value} </Form.Control.Feedback>})}
                        </Form.Group>

                        <Form.Group className="input-base">
                            <Form.Control type="password" name="confirmPassword" isInvalid={resetPassword["confirmPassword"].inValid} placeholder="Confirm Password"
                            onBlur={(e)=>{setResetPassword(validation(e.target,resetPassword, "resetPassword"))}}/>
                            {resetPassword["confirmPassword"].errors.map((value,index)=>
                            {return <Form.Control.Feedback className="feedback" key={index} type="invalid"> {value} </Form.Control.Feedback>})}
                        </Form.Group>


                        <div className="text-center">
                            <Button className="btn-base mb-3" variant="dark" type="submit" onClick={(e)=>submit(e)}>
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

export default ResetPassword