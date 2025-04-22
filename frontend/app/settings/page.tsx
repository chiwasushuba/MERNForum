'use client'

import React, {useEffect, useState} from 'react'
import axios from 'axios'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import LeftSideBar from '@/components/LeftSideBar'
import RightSideBar from '@/components/RightSideBar'
import { Label } from '@radix-ui/react-label'
import VerifyOTPDiv from '@/components/VerifyOTPDiv'



const page = () => {
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const localUser = localStorage.getItem('user')
    if(localUser){
      const parsedUser = JSON.parse(localUser)
      setUser(parsedUser.username)
      console.log(user)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const sendOTP = async () => {

      const response = await axios.post(`${process.env.NEXT_PUBLIC_URL_API}/api/otp/send`)

      if( response.status === 200){
        setIsOpen(true)
      }
      
    }

    console.log(email)
  }

  return (
    <div className='flex flex-row justify-around'>
      <LeftSideBar/>
        <Card className='w-200 p-4'>
          <Card className='pl-4 pr-4'>
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
            {isOpen && <VerifyOTPDiv username={user} email={email}/>}

          </Card>
        </Card>

      <RightSideBar/>
    </div>
  )
}

export default page