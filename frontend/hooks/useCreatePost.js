import {useState} from "react"
import {usePostsContext} from "./usePostsContext"
import { useAuthContext } from "./useAuthContext"

export const useCreatePost = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(null)
  const {dispatch} = usePostsContext()
  const {user} = useAuthContext();

  const createPost = async (title, content) => {
    setIsLoading(true)
    setError(null)

    if(!user){
      setError("You must be logged in")
      return
    }

    const response = await fetch(`${process.env.NEXT_API_URL}/api/post`, {
      method: "POST",
      headers: {"Content-Type": 'application/json', "Authorization": `Bearer ${user.token}`},
      body: JSON.stringify({title, content})

    })
    const json = await response.json()

    if(!response.ok){
      setIsLoading(false)
      setError(json.error)
    }

    if(response.ok){
      dispatch({type: "CREATE_POST", payload: json})
    }

  }

  return { createPost, isLoading, error};
}


