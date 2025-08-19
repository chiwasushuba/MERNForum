import React, { useEffect, useState } from 'react'
import {useLogout} from '@/hooks/useLogout'
import Link from 'next/link';

const LeftSideBar = () => {
  
  const {logout} = useLogout();
  const [userId, setUserId] = useState("")


  useEffect(() => {
    const localItem = localStorage.getItem('userInfo')

    if (!localItem) return;
    
    if(localItem){
      const parsedItem = JSON.parse(localItem)
      setUserId(parsedItem.userId)
      // alert(`UserId: ${userId}`)
    } 
  }, [])
  
  

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="fixed top-0 left-0 h-screen w-64 flex flex-col bg-white shadow-lg border-r border-gray-200">
  {/* App Logo / Title */}
  <div className="p-4 text-2xl font-bold text-blue-600 border-b">
    Flux Talk
  </div>

  {/* Navigation */}
  <nav className="flex flex-col p-4 gap-2 text-gray-700 font-medium">
    <Link href="/" className="p-2 rounded-lg hover:bg-blue-100 transition">
      Home
    </Link>
    <Link href={`/profile?id=${userId}`} className="p-2 rounded-lg hover:bg-blue-100 transition">
      Profile
    </Link>
    <Link href="/settings" className="p-2 rounded-lg hover:bg-blue-100 transition">
      Settings
    </Link>
    <Link href="/chat" className="p-2 rounded-lg hover:bg-blue-100 transition">
      Messages
    </Link>
  </nav>

  {/* Logout at Bottom */}
  <div className="mt-auto p-4 border-t">
    {userId ? (
      <Link
        onClick={handleLogout}
        href="/login"
        className="block text-center p-2 rounded-lg"
      >
        Logout
      </Link>
    ) : (
      <Link
        href="/login"
        className="block text-center p-2 rounded-lg"
      >
        Login
      </Link>
    )}
  </div>
</div>

  )
}

export default LeftSideBar