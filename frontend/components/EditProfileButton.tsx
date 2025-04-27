'use client'

import React, {useState} from 'react'
import { Button } from './ui/button'
import EditProfileDiv from './EditProfileDiv';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const EditProfileButton = () => {

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
    
      <Button 
        onClick={() => (setIsOpen(true))}
        className="ml-2"
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