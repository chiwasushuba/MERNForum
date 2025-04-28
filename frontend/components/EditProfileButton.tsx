'use client'

import React, {useState} from 'react'
import { Button } from './ui/button'
import EditProfileDiv from './EditProfileDiv';


const EditProfileButton = () => {

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
    
      <Button 
        onClick={() => (setIsOpen(true))}
        className="ml-2 hover:bg-opacity-50"
        >
          Edit Profile
      </Button>
      {isOpen && (
        
          <EditProfileDiv setIsOpen={setIsOpen}/>
      )}
    </div>
  )
}

export default EditProfileButton