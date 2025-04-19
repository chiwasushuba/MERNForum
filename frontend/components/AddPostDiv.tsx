'use client'

import React, {ReactEventHandler, useState} from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from '@radix-ui/react-label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { X } from 'lucide-react'
import {useCreatePost} from "../hooks/useCreatePost"
import { Textarea } from './ui/textarea'
import axios from 'axios'

const AddPostDiv = ({setIsOpen}: any) => {

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const {createPost, error ,isLoading} = useCreatePost()
  const [openImageBtn, setIsOpenImageBtn] = useState(false)
  

  const handleSubmit = async(e: React.FormEvent) => {
    // e.preventDefault();
    if (!title || !content) return alert("Title and content are required!");


    const post = {title, content, imageUrl}

    const response = await createPost(post)

    setTitle('')
    setContent('')
    alert("Succesfully posted a post ")
  }

  return (
    <div className='relative h-screen w-screen'>
      {/* <Card className='absolute top-1/2 left-248 translate-x-[-50%] translate-y-[-50%] w-3/5 h-3/5 p-6'> */}
      <Card className='absolute top-1/2 left-3/5 transform -translate-x-1/2 -translate-y-1/2 w-3/5 min-h-[60%] p-6'>
        <CardHeader>
          <div className='flex flex-row justify-between'>
            <CardTitle className='text-4xl'>Add a Post</CardTitle>
            <Button 
            variant={'destructive'}
            className=''
            onClick={() => {setIsOpen(false)}}>
              <X size={48} strokeWidth={3} />
            </Button>
          </div>
          <CardDescription className='text-xl'>Enter below details about posts</CardDescription>
        </CardHeader>
        <CardContent >
          <Label className='text-xl mt-4'>Title</Label>
          <Input 
            className='mb-2 mt-2'
            placeholder='Add Title Name'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Label className='text-xl'>Content</Label>
          <Textarea
            className='mb-2 mt-2 h-1/2'
            placeholder='Add Content'
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          {/* <Label>Add Image</Label> */}
          <Button 
            onClick={() => setIsOpenImageBtn(prevState => !prevState)}>
              Add Image
          </Button>
          {openImageBtn && <Input
            type='file'
            className='w-auto mt-2 mb-2'
            onChange={(e) => setImageUrl(e.target.value)}
          />}
        </CardContent>
        <CardFooter className='flex flex-row-reverse'>
          <Button variant={'outline'} onClick={handleSubmit}>Post</Button>
        </CardFooter>    
      </Card>
    </div>
  )
}

export default AddPostDiv