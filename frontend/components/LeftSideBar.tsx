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
    <div className="fixed top-0 left-0 h-screen w-64 overflow-y-auto bg-gray-200 border-r border-gray-300">
        <div className="flex flex-col p-4 gap-4 h-full">
          <div className="font-bold text-xl">
            Flux Talk
          </div>

          <nav className="flex flex-col gap-2 ml-3">
            <Link href="/" className="p-2 hover:bg-gray-200 rounded">
              Home
            </Link>

            <Link href={`/profile?id=${userId}`} className="p-2 hover:bg-gray-200 rounded">
              Profile
            </Link>
            <Link href="/settings" className="p-2 hover:bg-gray-200 rounded">
              Settings
            </Link>
            <Link href="/chat" className="p-2 hover:bg-gray-200 rounded">
              Messages
            </Link>
          </nav>

          <div className="flex mt-auto">
            {userId ? <Link
              onClick={handleLogout} 
              href="/login" 
              className="p-2 w-full hover:bg-gray-200 rounded">
              Logout
            </Link> : <Link href={"/login"}
              className="p-2 w-full hover:bg-gray-200 rounded">
              Login 
            </Link>
            }
          </div>
        </div>
      </div>
  )
}

export default LeftSideBar