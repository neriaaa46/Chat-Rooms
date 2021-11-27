import { createStore } from "redux"

const initialStates = { isLoggedIn: 0, loader: true }

const myStates = (state = initialStates, action) => {
  if (action.type === "LOGIN") {
    return {
      ...state,
      isLoggedIn: true,
    }
  }

  if (action.type === "LOGOUT") {
    return {
      ...state,
      isLoggedIn: false,
    }
  }

  if (action.type === "LOADING") {
    return {
      ...state,
      loader: true,
    }
  }

  if (action.type === "START") {
    return {
      ...state,
      loader: false,
    }
  }

  return state
}

const store = createStore(myStates)

export default store
