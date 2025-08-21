'use client'

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';
import { motion } from 'framer-motion'
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import {useSignup} from '@/hooks/useSignup'
import {useRouter} from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';

const Signup = () => {
  const [errorOpen ,setErrorOpen] = useState(false)
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const {signup, error} = useSignup()
  const router = useRouter()

  useEffect(() => {
    document.title = "Sign Up | Flux Talk"; // Set the title when the component mounts
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // const user = {username, password };

    const response = await signup(username ,password)

    console.log(response)

    if(!response.success){
      setErrorOpen(true)// Or redirect user, etc.
    } else {
      setErrorOpen(false)
      setUsername("")
      setPassword("")
      router.push("/")
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <div className="bg-card dark:border-2 dark:border-secondary rounded-2xl shadow-xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter">Sign-up</h1>
            <p className="text-muted-foreground">Enter your credentials to register an account</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input 
                id="username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input 
                  id="password" 
                  type={passwordVisible ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  />
                <button
                  type="button"
                  onClick={() => setPasswordVisible(!passwordVisible)} // Toggle password visibility
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {passwordVisible ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full hover:bg-gray-600 cursor-pointer">Sign-up</Button>
          </form>
          {errorOpen && <Label className='text-red-400'>{error}</Label>}

          <div className="text-center mt-4">
            <p className="text-muted-foreground">Already have an account?</p>
            <Link
              href="/login"
              className="text-primary-500 hover:underline"
            >
              Login
            </Link>
          </div>
        </div>

        <div className="text-center text-xs text-muted-foreground mt-4 [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
          By clicking continue, you agree to our <br />
          <a href="#" className="mr-2">Terms of Service</a> and
          <a href="#" className="ml-2">Privacy Policy</a>.
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
