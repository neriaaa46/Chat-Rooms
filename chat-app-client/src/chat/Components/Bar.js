import {Navbar, Nav} from "react-bootstrap"
import {NavLink, useHistory} from "react-router-dom"
import { useSelector, useDispatch} from "react-redux"
import {logoutUser} from "../DAL/authenticationApi"
import {decodeJwtToken} from "../Utils/function"

function Bar(){

    const history = useHistory()
    const dispatch = useDispatch()
    const isLoggedIn = useSelector(state => state.isLoggedIn)
    
    if(isLoggedIn){
        var {userName} = decodeJwtToken()
    }
    
    const logout = () => {
        dispatch({type: 'LOGOUT'})
    }


    function toLogout(){
        logout()
        history.push('/')
        logoutUser()
    }

    return <>
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" className="Nav-Bar">
        <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
        <Navbar.Collapse id="responsive-navbar-nav">
                {!isLoggedIn&&<Nav>
                    <NavLink to="/register" className="nav-link nav-auth">Register</NavLink>
                    <NavLink to="/login" className="nav-link nav-auth">Login</NavLink>
                </Nav>}

                {isLoggedIn&&<Navbar.Collapse className="link-rooms">
                    <Nav>
                        <NavLink to="/rooms" className="nav-link nav-auth">Chat Rooms</NavLink>
                        <NavLink to="/createRoom" className="nav-link nav-auth">Create Room</NavLink>
                    </Nav>
                    <Nav className="">
                        <div className="userName-nav"><b>Hello, {userName}</b></div>
                        <NavLink to="/" className="nav-link nav-auth" onClick = {()=>toLogout()}>Logout</NavLink>
                    </Nav>
                </Navbar.Collapse>}
            </Navbar.Collapse>

    </Navbar>
    </>
}

export default Bar