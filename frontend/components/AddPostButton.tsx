'use client'

import React, {useState} from 'react'
import { Button } from './ui/button'
import AddPostDiv from './AddPostDiv';
import { Plus } from 'lucide-react';

const AddPostButton = () => {

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Button 
        onClick={() => (setIsOpen(!isOpen))}
        className="flex items-center justify-center p-2 rounded-full h-12 w-12"
        >
          <Plus size={48} strokeWidth={3} />
      </Button>
      {isOpen && <AddPostDiv setIsOpen={setIsOpen}/>}
    </div>
  )
}

export default AddPostButton