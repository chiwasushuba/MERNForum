import React from 'react'
import SearchBar from './SearchBar'


const RightSideBar = () => {

  return (
    <div className="fixed top-0 right-0 h-screen w-64 overflow-y-auto bg-gray-200 border-l border-gray-300">
        <div className="p-4">
          <div className="flex flex-col gap-3">
            <SearchBar/>
            <div className='rounded-sm border-solid border-gray-200 border'>
              <h3 className="font-bold mb-4">Features Available</h3>
              <ul className="list-disc pl-5">
                <li>Like and Dislike</li>
                <li>Follow and Unfollow</li>
                <li>User Verification using Email in Settings</li>
                <li>Delete Account along with their posts</li>
                <li>Edit Account</li>
                <li>
                  Every image was stored in <span className="line-through text-gray-500">Firebase</span>, 
                  now migrated to <span className="font-semibold">AWS S3</span>
                </li>
                <li>Search Posts and Users based on similarity of words in posts contents, title and user's name</li>
            </ul>
            </div>
          </div>
        </div>
      </div>
  )
}

export default RightSideBar