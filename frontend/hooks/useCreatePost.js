import {useState} from "react"
import {usePostsContext} from "./usePostsContext"
import { useAuthContext } from "./useAuthContext"

export const useCreatePost = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(null)
  const {dispatch} = usePostsContext()
  const {user} = useAuthContext();

  const createPost = async (title, content, imageFile) => {
    setIsLoading(true)
    setError(null)

    if(!user){
      setError("You must be logged in")
      setIsLoading(false)
      return
    }

    try{

      // updated to FormData so that uploading file will be compatible
      const formData = new FormData();
      formData.append('title', title)
      formData.append('content', content)

      if(imageFile){
        formData.append('image', imageFile)
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/post`, {
        method: "POST",
        headers: {"Content-Type": 'application/json', "Authorization": `Bearer ${user.token}`},
        body: formData
  
      })

      const json = await response.json()

      if(!response.ok){
        setIsLoading(false)
        setError(json.error)
      }
  
      if(response.ok){
        dispatch({type: "CREATE_POST", payload: json})
      }  

    } catch(e){
      console.error(e)
    }
  }

  return { createPost, isLoading, error};
}


