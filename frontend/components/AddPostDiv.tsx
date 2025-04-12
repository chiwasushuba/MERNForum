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

const AddPostDiv = ({setIsOpen}: any) => {

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const {createPost, error ,isLoading} = useCreatePost()

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    
    const post = {title, content}

    const response = await createPost(title, content)

    setTitle('')
    setContent('')
    alert("Succesfully posted a post ")
  }

  return (
    <form className='relative h-screen w-screen' onSubmit={handleSubmit}>
      <Card className='absolute top-1/2 left-248 translate-x-[-50%] translate-y-[-50%] w-3/5 h-3/5 p-6'>
        <CardHeader>
          <div className='flex flex-row justify-between'>
            <CardTitle>Add a Post</CardTitle>
            <Button 
            variant={'destructive'}
            className=''
            onClick={() => {setIsOpen(false)}}>
              <X size={48} strokeWidth={3} />
            </Button>
          </div>
          <CardDescription>Enter below details about posts</CardDescription>
        </CardHeader>
        <CardContent>
          <Label>Title</Label>
          <Input placeholder='Add Title Name'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Label>Content</Label>
          <Input placeholder='Add Content'
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </CardContent>
        <CardFooter>
          <Button variant={'outline'}>Post</Button>
        </CardFooter>    
      </Card>
    </form>
  )
}

export default AddPostDiv