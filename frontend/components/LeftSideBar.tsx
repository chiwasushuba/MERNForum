import React, { useEffect, useState } from 'react'
import {useLogout} from '@/hooks/useLogout'
import Link from 'next/link';

const LeftSideBar = () => {
  
  const {logout} = useLogout();
  const [userId, setUserId] = useState("")


  useEffect(() => {
    const localItem = localStorage.getItem('userInfo')
    if(localItem){
      const parsedItem = JSON.parse(localItem)
      setUserId(parsedItem.userId)
    } 
  }, [])
  
  

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="fixed top-0 left-0 h-screen w-64 overflow-y-auto bg-gray-100 border-r border-gray-200">
        <div className="flex flex-col p-4 gap-4 h-full">
          <div className="font-bold text-xl">
            Dashboard
          </div>

          <nav className="flex flex-col gap-2 ml-3">
            <a href="/" className="p-2 hover:bg-gray-200 rounded">
              Home
            </a>

            <Link href={`/profile?id=${userId}`} className="p-2 hover:bg-gray-200 rounded">
              Profile
            </Link>
            <a href="/settings" className="p-2 hover:bg-gray-200 rounded">
              Settings
            </a>
            <a href="#" className="p-2 hover:bg-gray-200 rounded">
              Messages
            </a>
            <a href="#" className="p-2 hover:bg-gray-200 rounded">
              Notifications
            </a>
          </nav>

          <div className="flex mt-auto">
            <a
              onClick={handleLogout} 
              href="/login" 
              className="p-2 w-full hover:bg-gray-200 rounded">
              Logout
            </a>
          </div>
        </div>
      </div>
  )
}

export default LeftSideBar