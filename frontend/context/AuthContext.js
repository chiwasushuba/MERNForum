'use client'

import {createContext, useReducer, useEffect} from 'react'

export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch(action.type){
    case 'LOGIN':
      return {user: action.payload}
    case 'LOGOUT':
      return {user: null}
    case 'AUTH_READY': // checks if authorization is now okay (there is user already in localstorage)
      return { ...state, authIsReady: true };
    default:
      return state
  }

}

export const AuthContextProvider = ({children}) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    authIsReady: false,
  })

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))

    if(user){
      dispatch({type: "LOGIN", payload: user})
    }

    dispatch({type: "AUTH_READY"});

  }, [])


  return(
    <AuthContext.Provider value={{...state, dispatch}}>
      {children}
    </AuthContext.Provider>

  )

}


