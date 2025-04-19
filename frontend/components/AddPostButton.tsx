'use client'

import React, {useState} from 'react'
import { Button } from './ui/button'
import AddPostDiv from './AddPostDiv';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

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
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          exit={{ opacity: 0, scale: 1.9 }}
        >
          <AddPostDiv setIsOpen={setIsOpen}/>
        </motion.div>
      )}
    </div>
  )
}

export default AddPostButton