import {useState} from "react"
import {usePostsContext} from "./usePostsContext"
import { useAuthContext } from "./useAuthContext"

export const useCreatePost = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(null)
  const {dispatch} = usePostsContext()
  const {userInfo} = useAuthContext();

  const createPost = async (title, content, imageFile) => {
    setIsLoading(true)
    setError(null)

    if(!userInfo){
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
        headers: {"Authorization": `Bearer ${userInfo.token}`}, 
        body: formData
      })

      const json = await response.json();
      
      if (!response.ok) {
        setIsLoading(false);
        setError(json.error || "An error occurred.");
        return;
      }

      // Successfully created the post
      dispatch({ type: "CREATE_POST", payload: json });
      setIsLoading(false);
      return json;

    } catch(e){
      console.error(e)
      setIsLoading(true);
      setError("An error occurred while creating the post.");
    }
  }

  return { createPost, isLoading, error};
}


