import {Form, Button, Row, Col, Container} from "react-bootstrap"
import {Link} from "react-router-dom"
import {useState, useContext} from "react"
import {useHistory} from "react-router"
import {useDispatch} from "react-redux"
import {validation, email, password} from "../Utils/validation"
import {loginUser} from "../DAL/authenticationApi"
import {AuthContext} from "../Components/AuthContext"


function Login(){

    const history = useHistory()
    const dispatch = useDispatch()
    const ctx = useContext(AuthContext)

    const login = () => {
        dispatch({type: 'LOGIN'})
    }

    const [message, setMessage] = useState("")
    const [loginInputDetails, setLoginInputDetails] = useState({
        email: {...email, inValid: false, value: "", error: []},
        password: {...password, inValid: false, value: "", error: []}
        })

        async function submit(e){
            e.preventDefault()
    
            let isValid = true
            let user = {}
    
           for (const key in loginInputDetails) {
    
                user[key] = loginInputDetails[key].value
                setLoginInputDetails(validation({value:loginInputDetails[key].value,name:key},loginInputDetails, "login"))
                if (loginInputDetails[key].errors.length !==0){
                    isValid = false
                }
            }
    
            if(isValid){
                const response = await loginUser(user)
                const {accessToken, message} = await response.json()
                setMessage(message)

                if(response.ok){
                    setTimeout(()=>{
                        ctx.refreshToken(accessToken)
                        login()
                        history.push('/rooms')
                    }, 2000)
                    
                } else {
                    setTimeout(()=>{
                        setMessage("")
                    }, 5000)
                }
            }
        }


    return <>
        <Container className="container-base mt-4">
            <Form className="form-base"> 
                
                <h1 className="text-center mt-3 mb-4">Login</h1>
                
                <Row className="justify-content-center">

                    <Col xs={11} md={8} lg={6}>
                        <Form.Group className="input-base">
                            <Form.Control type="email" name="email" isInvalid={loginInputDetails["email"].inValid} placeholder="Email"
                            onBlur={(e)=>{setLoginInputDetails(validation(e.target,loginInputDetails, "login"))}}/>
                            {loginInputDetails["email"].errors.map((value,index)=>
                            {return <Form.Control.Feedback className="feedback" key={index} type="invalid"> {value} </Form.Control.Feedback>})}
                        </Form.Group>

                        <Form.Group className="input-base">
                            <Form.Control type="password" name="password" isInvalid={loginInputDetails["password"].inValid} placeholder="Password"
                            onBlur={(e)=>{setLoginInputDetails(validation(e.target,loginInputDetails, "login"))}}/>
                            {loginInputDetails["password"].errors.map((value,index)=>
                            {return <Form.Control.Feedback className="feedback" key={index} type="invalid"> {value} </Form.Control.Feedback>})}
                        </Form.Group>

                        <Row className="btn-link-base mb-3">
                            <Button className="btn-login" variant="dark" type="submit" onClick={(e)=>{submit(e)}}>
                                Login
                            </Button> 
                            <Link className="link-forgot text-center" to="/forgotPassword">Forgot Password ?</Link>
                        </Row>
                       
                    </Col>

                    <Row className="message-base justify-content-center align-items-center mb-3">
                        {message&&<small>{message}</small>}
                    </Row>

                </Row>
                
            </Form>
        </Container>
        
    </>
}

export default Login