'use client'

import React, {useEffect, useState} from 'react'
import axios from 'axios'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import LeftSideBar from '@/components/LeftSideBar'
import RightSideBar from '@/components/RightSideBar'
import { Label } from '@radix-ui/react-label'
import VerifyOTPDiv from '@/components/VerifyOTPDiv'



const Settings = () => {
  // const searchParams = useSearchParams();
  // const userId = searchParams.get("id");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("")

  useEffect(() => {
    const localUser = localStorage.getItem('userInfo')
    if(localUser){
      const parsedUser = JSON.parse(localUser)
      setUsername(parsedUser.username)
    }
  }, [])

  


  // Handle submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    console.log(username)
    const sendOTP = async () => {

      try{
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/otp/send`, {
          email: email
        })

        if( response.status === 200){
          setError("")
          setIsOpen(true)
          alert(`Alert sent to: ${email}`)
        } 
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data.message || "Failed to send OTP.") // yung akin na errors
        } else {
          setError("Unknown Error occured.")
        }
  
        console.error("OTP sending error:", err)
      }
    }

    sendOTP()
  }

  

  return (
    <div className='flex flex-row justify-around'>
      <LeftSideBar/>
        <Card className='w-200 p-4'>
          <Card className='pl-4 pr-4'>
            <div>
              <Label className='text-xl font-semibold '>Verify OTP</Label>
              <form className="flex flex-row gap-4" onSubmit={handleSubmit}>
                <Input 
                  className='w-70'
                  value={email}
                  onChange={(e) => {setEmail(e.target.value)}}
                />
                <Button 
                  className='bg-gray-700 text-white'
                  variant={'outline'}
                  type='submit'
                >
                  Verify
                </Button>
              </form>
              {error && <Label className='text-red-600'>{error}</Label>}
            </div>
            {isOpen && <VerifyOTPDiv username={username} email={email}/>}

          </Card>
        </Card>

      <RightSideBar/>
    </div>
  )
}

export default Settings