import "bootstrap/dist/css/bootstrap.min.css"
import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import App from "./chat/index"
import reportWebVitals from "./reportWebVitals"
import { BrowserRouter as Router } from "react-router-dom"
import { Provider } from "react-redux"
import store from "./chat/Redux/store"
import { AuthContextProvider } from "./chat/Components/AuthContext"

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <AuthContextProvider>
          <App/>
        </AuthContextProvider>
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
