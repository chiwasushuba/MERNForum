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
import { motion } from 'framer-motion'
import imageCompression from 'browser-image-compression';
import { useAuthContext } from '@/hooks/useAuthContext'

interface AddPostDivProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddPostDiv = ({ setIsOpen } : AddPostDivProps) => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [image, setImage] = useState<File | null>(null); // Changed to null for consistency
  const [compressedImage, setCompressedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('') // Added for image preview
  const { createPost, isLoading } = useCreatePost()
  const [openImageBtn, setIsOpenImageBtn] = useState(false)
  const {userInfo} = useAuthContext();

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
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      };

      try {
        const compressedBlob = await imageCompression(file, options);

        const compressedFile = new File([compressedBlob], file.name, {
          type: file.type,
          lastModified: Date.now(),
        });

        setImage(compressedFile); 
        const previewUrl = URL.createObjectURL(compressedFile);
        setImagePreview(previewUrl);
      } catch (error) {
        console.error("Image compression failed:", error);
      }
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    e.stopPropagation()
    
    if (!title.trim() || !content.trim()) {
      return alert("Title and content are required!")
    }

    if (!userInfo || !userInfo.token) {
      return alert("You must be logged in to create a post!");
    }

    try {
      // Pass the actual file object to createPost
      const response = await createPost(title, content, image)

      console.log(response?.status)

      // Reset form after successful submission
      if (response?.status == 201){
        alert("Successfully posted a post")
        setTitle('')
        setContent('')
        setImage(null)
        setImagePreview('')
        setIsOpenImageBtn(false)
        window.location.reload()
      } 
      
      
    } catch (err) {
      alert(`Failed to create post. Please try again. ${err}`)
    }
  }

  // Function to remove selected image
  const removeImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview); // release memory
    }
    setImage(null);
    setImagePreview('');
  };

  return (
    <motion.div 
        className="fixed inset-0 z-50 flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        >
    <div className='fixed inset-0 flex justify-center items-center z-50 '>
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
        
        <form onSubmit={(e) => {handleSubmit(e)}} encType='multipart/form-data'>
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
    </motion.div>
  )
}

export default AddPostDiv