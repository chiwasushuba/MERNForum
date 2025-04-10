import React, {useEffect, useState} from 'react'
import { Button } from './ui/button';

const CreatePost = () => {

  const [isOpen, setIsOpen] = useState(false);



  return (
    <>
      <Button className=''>
        Post
      </Button>
    </>
  )
}

export default CreatePost