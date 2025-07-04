'use client'

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';
import { Button } from './ui/button';
import { usePostsContext } from '@/hooks/usePostsContext';
import { useAuthContext } from '@/hooks/useAuthContext';
import { BadgeCheck, ThumbsDown, ThumbsUp, Verified } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image'
import axios from 'axios';
import { Label } from '@radix-ui/react-label';

interface User {
  _id: string;
  username: string;
  profile: string;
  verified: boolean;
}

export interface PostInterface {
  postId: string;
  title: string;
  user: User;
  profile: string;
  content: string;
  image: string;
  likes: number;
  dislikes: number;
}



const PostPreview: React.FC<PostInterface> = ({
  postId,
  title, 
  user,
  profile,
  content,
  image, 
  likes, 
  dislikes,
}) => {
  const [likeCount, setLikeCount] = useState(likes);
  const [dislikeCount, setDislikeCount] = useState(dislikes);
  // const [showVerified, setShowVerified] = useState(false);


  const {userInfo} = useAuthContext() 
  const {dispatch} = usePostsContext()

  // useEffect(() => {
  //   if (userVerified && userInfo && userInfo.username === user.username) {
  //     setShowVerified(true);
  //   }
  // }, [userVerified, userInfo, user.username]);
  
  
  const handleDelete = async () => {

    if(!userInfo){
      return
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/post/${postId}`, {
      method: 'DELETE',
      headers: {
        "Authorization": `Bearer ${userInfo.token}`,
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
    if (!userInfo) {
      alert("Login to Like / Dislike a post");
      return;
    };
    try {
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/post/${postId}/like`,
        {},
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      setLikeCount(res.data.likes);
      setDislikeCount(res.data.dislikes); // in case dislike was removed
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };
  
  const handleDislike = async () => {
    if (!userInfo) {
      alert("Login to Like / Dislike a post");
      return
    };
    try {
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/post/${postId}/dislike`,
        {},
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
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
          <Link href={`/profile?id=${user._id}`}>
            <Avatar>
              <AvatarImage className="size-8 rounded-full border border-black" src={profile} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </Link>
          <Link href={`/profile?id=${user._id}`} className="hover:underline text-sm font-medium text-gray-500">
            {user.username}
          </Link>
          {user.verified && 
            <div className='flex items-center'>
            <BadgeCheck size={18} color='#10B981'/> 
            <Label className='text-green-500'>Verified</Label>
            </div>}
          
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
        {userInfo?.username === user.username && (<Button 
          variant="destructive" 
          onClick={handleDelete}
          className='hover:bg-red-400'
          >Delete</Button>)}
      </CardFooter>
    </Card>
  );
};

export default PostPreview;