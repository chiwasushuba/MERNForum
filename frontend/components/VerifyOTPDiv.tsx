'use client'

import React, { useState } from 'react'
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface VerifyProps {
  username: string
  email: string
}

const VerifyOTPDiv: React.FC<VerifyProps> = ({ username, email }) => {
  const [otp, setOtp] = useState<string>('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.length === 6) {
      toast({
        title: "OTP Submitted",
        description: (
          <pre className="mt-2 w-full rounded-md bg-slate-950 p-4">
            <code className="text-white">{otp}</code>
          </pre>
        ),
      })
    } else {
      toast({
        title: "Invalid OTP",
        description: "Your OTP must be 6 characters long.",
      })
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputOTP maxLength={6} value={otp} onChange={setOtp}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>

        <div className="text-center text-sm">
          {otp === "" ? (
            <>Enter your one-time password.</>
          ) : (
            <>You entered: {otp}</>
          )}
        </div>

        <Button type="submit" className="w-full mt-2">Verify</Button>
      </form>
    </div>
  )
}

export default VerifyOTPDiv
