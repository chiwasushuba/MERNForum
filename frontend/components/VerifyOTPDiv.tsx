"use client"

import type React from "react"
import { useState } from "react"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Button } from "@/components/ui/button"
import { Label } from "@radix-ui/react-label"
import axios from "axios"

interface VerifyProps {
  username: string
  email: string
}

const VerifyOTPDiv: React.FC<VerifyProps> = ({ username, email }) => {
  const [otp, setOtp] = useState<string>("")
  const [error, setError] = useState("")
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("OTP submitted:", otp)
    // Add your submission logic here

    const verifyOtp = async () =>{

      // ${process.env.NEXT_PUBLIC_URL_API}/api/otp/verify`

      try{
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/otp/verify`, {
          username,
          email,
          otp
        })
  
        if(response.status === 200){
          alert("Your Account is now verified!!!")
        } else if (response.status === 400){
          alert(response.data.message)
        } 
      } catch (err: unknown){

        console.error(err)
        if (axios.isAxiosError(err)) {
          setError(err.response?.data.message || "Failed to send OTP.") // safe my personal errors (400)
        } else {
          setError("Unexpected Error.")
        }
      }
    }

    verifyOtp()
  }

  return (
    <div className="flex flex-col gap-4">
      <Label>Input sent OTP</Label>
      <div>
        <form onSubmit={handleSubmit} className="flex gap-4">
          <InputOTP value={otp} onChange={setOtp} maxLength={6}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>

          <Button type="submit">Submit</Button>
        </form>
      </div>
      {error && <Label className='text-red-600'>{error}</Label>}
    </div>
  )
}

export default VerifyOTPDiv
