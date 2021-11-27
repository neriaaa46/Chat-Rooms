import "bootstrap/dist/css/bootstrap.min.css"
import "./CSS/index.css"
import { Switch, Route, Redirect } from "react-router-dom"
import { useSelector } from "react-redux"
import HomePage from "./Components/HomePage"
import Register from "./Components/Register"
import Login from "./Components/Login"
import Bar from "./Components/Bar"
import ForgotPassword from "./Components/ForgotPassword"
import ResetPassword from "./Components/ResetPassword"
import Initialization from "./Components/Initialization"
import CreateRoom from "./Components/CreateRoom"
import Rooms from "./Components/Rooms"
import Room from "./Components/Room"


function App() {
  const isLoggedIn = useSelector((state) => state.isLoggedIn)
  const loader = useSelector((state) => state.loader)
  
  if (loader) return <Initialization/>
  return (
    <>
      <Bar />
      <Switch>
        <Route exact path="/">
        {!isLoggedIn && <HomePage />}
          {isLoggedIn && <Redirect to="/rooms"/>}
        </Route>

        <Route exact path="/register">
          {!isLoggedIn && <Register />}
          {isLoggedIn && <Redirect to="/" />}
        </Route>

        <Route exact path="/login">
          {!isLoggedIn && <Login />}
          {isLoggedIn && <Redirect to="/" />}
        </Route>

        <Route exact path="/forgotPassword">
          {!isLoggedIn && <ForgotPassword />}
          {isLoggedIn && <Redirect to="/" />}
        </Route>

        <Route exact path="/resetPassword/:token">
          {!isLoggedIn && <ResetPassword />}
          {isLoggedIn && <Redirect to="/" />}
        </Route>

        <Route exact path="/createRoom">
          {isLoggedIn && <CreateRoom/>}
          {!isLoggedIn && <Redirect to="/"/>}
        </Route>

        <Route exact path="/rooms">
          {isLoggedIn && <Rooms/>}
          {!isLoggedIn && <Redirect to="/"/>}
        </Route>

        <Route exact path="/room/:name">
          {isLoggedIn && <Room/>}
          {!isLoggedIn && <Redirect to="/"/>}
        </Route>

        <Route path="*">
          <Redirect to="/" />
        </Route>
      </Switch>
    </>
  )
}

export default App
