import React from 'react'
import { Button } from './ui/button'
// import CreatePost from './createPost'
import {useLogout} from '@/hooks/useLogout'

const LeftSideBar = () => {

  const {logout} = useLogout();

  let userId=""
  const sessionItem = sessionStorage.getItem('user')
  if(sessionItem){
    const parsedItem = JSON.parse(sessionItem)
    userId = parsedItem._id
  } 
  

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

            <a href={`/profile?id=${userId}`} className="p-2 hover:bg-gray-200 rounded">
              Profile
            </a>
            <a href="#" className="p-2 hover:bg-gray-200 rounded">
              Settings
            </a>
            <a href="#" className="p-2 hover:bg-gray-200 rounded">
              Messages
            </a>
            <a href="#" className="p-2 hover:bg-gray-200 rounded">
              Notifications
            </a>
          </nav>
          {/* <CreatePost/> */}


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