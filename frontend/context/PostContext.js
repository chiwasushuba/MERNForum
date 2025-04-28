'use client'

import { createContext, useReducer} from "react";

export const PostContext = createContext();

export const postReducer = (state, action) => {
  switch(action.type){
    case 'SET_POSTS':
    return {
      ...state,
      posts: action.payload
    }
    case 'CREATE_POST':
      return {
        posts: [action.payload, ...state.posts]
      }
    case "DELETE_POST":
      return{
        posts: state.posts.filter((p) => p._id !== action.payload._id)
      }
    default:
      return state
  }


}

export const PostContextProvider = ({children}) => {

  const [state, dispatch] = useReducer(postReducer, {
    posts: []
  })


  return (
    <PostContext.Provider value={{ posts: state.posts, dispatch}}>
      {children}
    </PostContext.Provider>

  );


}





