'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader } from './ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar'
import { Label } from '@radix-ui/react-label'
import { BadgeCheck } from 'lucide-react'
import { Button } from './ui/button'
import Link from 'next/link'
import FollowButton from './FollowButton'
import { useAuthContext } from '@/hooks/useAuthContext';

interface UserProps{
  _id: string
  profile: string
  username: string
  bio: string
  followers: number
  following: number
  verified: boolean
}

const UserPreview = ({_id ,profile, username, bio, followers, following, verified}: UserProps) => {
  const { userInfo } = useAuthContext();

  return (
    <Card className='w-[600px] h-auto'> 
      <CardHeader>
      <div className="flex items-center gap-2">
          <Link href={`/profile?id=${_id}`}>
            <Avatar>
              <AvatarImage className="size-8 rounded-full border border-black" src={profile} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </Link>
          <Link href={`/profile?id=${_id}`} className="hover:underline text-sm font-medium text-gray-500">
            {username}
          </Link>
          {verified && 
            <div className='flex items-center'>
            <BadgeCheck size={18} color='#10B981'/> 
            <Label className='text-green-500'>Verified</Label>
          </div>}
        </div>
      </CardHeader>
      <CardContent>
        <div className='text-gray-500'>
          {bio}
        </div>
      </CardContent>
      <CardFooter className='flex justify-between'>
      <div className='flex gap-4 text-sm text-gray-600'>
        <span>Followers: {followers}</span>
        <span>Following: {following}</span>
      </div>
      {(userInfo.username !== username) && (
        <FollowButton followingUserId={_id} />
      )}
      
      
      </CardFooter>
    </Card>
  )
}

export default UserPreview