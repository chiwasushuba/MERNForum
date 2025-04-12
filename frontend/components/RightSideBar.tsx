import React from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import SearchBar from './SearchBar'


const RightSideBar = () => {

  return (
    <div className="fixed top-0 right-0 h-screen w-64 overflow-y-auto bg-gray-100 border-l border-gray-200">
        <div className="p-4">
          <div className="flex flex-col gap-3">
            <SearchBar/>
            <div className='rounded-sm border-solid border-gray-200 border'>
              <h3 className="font-bold mb-4">Recent Activity</h3>
              <p>text</p>
              <p>text</p>
              <p>text</p>
            </div>
          </div>
        </div>
      </div>
  )
}

export default RightSideBar