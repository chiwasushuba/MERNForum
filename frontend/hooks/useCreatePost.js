import {useState} from "react"
import {usePostsContext} from "./usePostsContext"

export const useCreatePost = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(null)
  const {dispatch} = usePostsContext()

  const createPost = async (title, content) => {
    setIsLoading(true)
    setError(null)

    const response = await fetch("http://localhost:4000/api/post", {
      method: "POST",
      headers: {"Content-Type": 'application/json'},
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


