'use client'

import React, { useEffect, useState } from 'react'
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
import { X, ImageIcon } from 'lucide-react'
import { useCreatePost } from "../hooks/useCreatePost"
import { Textarea } from './ui/textarea'

const AddPostDiv = ({ setIsOpen } : any) => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [image, setImage] = useState<File | null>(null); // Changed to null for consistency
  const [imagePreview, setImagePreview] = useState('') // Added for image preview
  const { createPost, isLoading } = useCreatePost()
  const [openImageBtn, setIsOpenImageBtn] = useState(false)

  // Handles memory leak
  useEffect(() => {
    // Cleanup previous preview URL to prevent memory leaks
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]); 

  
  // Fixed handleImageChange function
  const handleImageChange = (e: any) => {
    const file = e.target.files[0]; // Fixed: files not file
    
    if (file) {
      setImage(file) // Store the actual file object
      
      // Create a preview URL for the image
      const previewUrl = URL.createObjectURL(file)
      setImagePreview(previewUrl)
    }
  }

  const handleSubmit = async (e: any) => {
    // e.preventDefault(); // Added to prevent default form submission
    
    if (!title.trim() || !content.trim()) {
      return alert("Title and content are required!")
    }

    try {
      // Pass the actual file object to createPost
      await createPost(title, content, image)
      
      // Reset form after successful submission
      setTitle('')
      setContent('')
      setImage(null)
      setImagePreview('')
      setIsOpenImageBtn(false)
      
      alert("Successfully posted a post")
    } catch (err) {
      console.error("Error creating post:", err)
      alert("Failed to create post. Please try again.")
    }
  }

  // Function to remove selected image
  const removeImage = () => {
    setImage(null)
    setImagePreview('')
  }

  return (
    <div className='fixed inset-0 flex justify-center items-center z-50'>
      {/* className='absolute top-1/2 left-3/5 transform -translate-x-1/2 -translate-y-1/2 w-3/5 min-h-[60%] p-6' */}
      <Card className='w-3/5 min-h-[60%] max-h-[80%] p-6 overflow-y-auto'>
        <CardHeader>
          <div className='flex flex-row justify-between'>
            <CardTitle className='text-4xl'>Add a Post</CardTitle>
            <Button 
              variant={'destructive'}
              onClick={() => {setIsOpen(false)}}>
              <X size={48} strokeWidth={3} />
            </Button>
          </div>
          <CardDescription className='text-xl'>Enter below details about posts</CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit} encType='multipart/form-data'>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className='text-xl' htmlFor="title">Title</Label>
                <Input 
                  id="title"
                  className='mb-2'
                  placeholder='Add Title Name'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label className='text-xl' htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  className='mb-2 min-h-[150px]'
                  placeholder='Add Content'
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                {!openImageBtn ? (
                  <Button 
                    type="button"
                    onClick={() => setIsOpenImageBtn(true)}
                    className="flex items-center gap-2"
                  >
                    <ImageIcon size={16} />
                    Add Image
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="image">Upload Image</Label>
                    <Input
                      id="image"
                      type='file'
                      accept="image/*" // Only accept image files
                      className='w-full'
                      onChange={handleImageChange} // Use the correct handler
                    />
                    
                    {/* Image preview */}
                    {imagePreview && (
                      <div className="relative mt-2">
                        <img 
                          src={imagePreview || "/placeholder.svg"} 
                          alt="Preview" 
                          className="max-h-[200px] rounded-md object-contain" 
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={removeImage}
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    )}
                    
                    {!imagePreview && (
                      <Button 
                        type="button"
                        variant="outline" 
                        onClick={() => setIsOpenImageBtn(false)}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          
          <CardFooter className='flex flex-row-reverse'>
            <Button 
              type="submit" 
            >
              {isLoading ? 'Posting...' : 'Post'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export default AddPostDiv