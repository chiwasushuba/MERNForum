import React from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import {useLogout} from '@/hooks/useLogout'

const RightSideBar = () => {

  const {logout} = useLogout();

  const handleLogout = () => {
    logout()
  }


  return (
    <div className="fixed top-0 right-0 h-screen w-64 overflow-y-auto bg-gray-100 border-l border-gray-200">
        <div className="p-4">
          <div className="flex flex-col gap-3">
            <Input className='rounded-sm' placeholder='Search' />
            <div className='rounded-sm border-solid border-gray-200 border'>
              <h3 className="font-bold mb-4">Recent Activity</h3>
              <p>text</p>
              <p>text</p>
              <p>text</p>
            </div>
          </div>
          <Button variant={'outline'} onClick={handleLogout}>Logout</Button>
        </div>
      </div>
  )
}

export default RightSideBar