'use client'

import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';
import { Button } from './ui/button';
import { usePostsContext } from '@/hooks/usePostsContext';
import { useAuthContext } from '@/hooks/useAuthContext';
import { ThumbsDown, ThumbsUp } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image'
import axios from 'axios';

interface Author {
  _id: string;
  username: string;
  profile: string;
}

export interface PostInterface {
  postId: string;
  title: string;
  author: Author;
  profile: string;
  content: string;
  image: string;
  likes: number;
  dislikes: number;
}



const PostPreview: React.FC<PostInterface> = ({
  postId,
  title, 
  author,
  profile,
  content,
  image, 
  likes, 
  dislikes,
}) => {
  const [likeCount, setLikeCount] = useState(likes);
  const [dislikeCount, setDislikeCount] = useState(dislikes);


  const {user} = useAuthContext() 
  const {dispatch} = usePostsContext()

  const handleDelete = async () => {

    if(!user){
      return
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/post/${postId}`, {
      method: 'DELETE',
      headers: {
        "Authorization": `Bearer ${user.token}`,
      }
    });

    const json = await response.json();

    if (!response.ok) {
      throw new Error('Failed to delete post');
    }

    // Dispatch a delete action if deletion succeeds
    if(response.ok){
      dispatch({ type: 'DELETE_POST', payload: json});
      window.location.reload()
    }
    
  };

  const handleLike = async () => {
    if (!user) return;
    try {
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/post/${postId}/like`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setLikeCount(res.data.likes);
      setDislikeCount(res.data.dislikes); // in case dislike was removed
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };
  
  const handleDislike = async () => {
    if (!user) return;
    try {
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/post/${postId}/dislike`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setLikeCount(res.data.likes);     // in case like was removed
      setDislikeCount(res.data.dislikes);
    } catch (err) {
      console.error("Error disliking post:", err);
    }
  };
  
  
  


  return (
    <Card className='w-[600px] h-auto'>
      <CardHeader>
      
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="flex items-center gap-2">
          <Link href={`/profile?id=${author._id}`}>
            <Avatar>
              <AvatarImage className="size-8 rounded-full" src={profile} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </Link>
          <Link href={`/profile?id=${author._id}`} className="hover:underline text-sm font-medium text-gray-500">
            {author.username}
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 mb-4">{content}</p>
        {image && <Image 
          src={image} 
          alt="Post image" 
          width={500}
          height={300}
          priority 
        />}
      </CardContent>
      <CardFooter className="flex gap-4">
        <div className="flex items-center gap-1">
          <button
            className='bg-transparent hover:bg-blue-200 rounded p-2'
            onClick={handleLike} 
          >
            <ThumbsUp color="#000000" size={18} strokeWidth={3} />
          </button>
          <span className='text-2xl'>{likeCount}</span>
        </div>
        <div className="flex items-center gap-1">
          <button 
            className='bg-transparent hover:bg-red-200 rounded p-2'
            onClick={handleDislike} 
          >
            <ThumbsDown color="#000000" size={18} strokeWidth={3} />
          </button>
          <span className='text-2xl'>{dislikeCount}</span>
        </div>

        {/* Appears only when it's authorized/owner */}
        {user?.username === author.username && (<Button 
          variant="destructive" 
          onClick={handleDelete}
          className='hover:bg-red-400'
          >Delete</Button>)}
      </CardFooter>
    </Card>
  );
};

export default PostPreview;