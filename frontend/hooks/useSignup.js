import {useState} from "react"
import {useAuthContext} from "./useAuthContext"

export const useSignup = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(null)
  const {dispatch} = useAuthContext()

  const signup = async (username, password) => {
    setIsLoading(true)
    setError("")

    try{
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/signup`, {
        method: "POST",
        headers: {"Content-Type": 'application/json'},
        body: JSON.stringify({username, password})
  
      })
      const json = await response.json()
  
      if(!response.ok){
        setIsLoading(false)
        setError(json.error || "Something went wrong")
        return { success: false, error: json.error}
      }  

      localStorage.setItem('userInfo', JSON.stringify(json))
      dispatch({type: "LOGIN", payload: json})
      setIsLoading(false)
      return {success : true}

    } catch (err) {
      setIsLoading(true)
      setError("Network Error")
      return { success: false, error: "Network error"}
    }
  }

  return { signup, isLoading, error};
}


