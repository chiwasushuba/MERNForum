'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import DeleteAccountButton from "./DeleteAccountButton";
import { useAuthContext } from "@/hooks/useAuthContext";
import EditProfileButton from "./EditProfileButton";
import { BadgeCheck } from "lucide-react";
import { Label } from "@radix-ui/react-label";
import FollowButton from "./FollowButton";
import { useState } from "react";
import FollowersDiv from "./FollowersDiv";
import FollowingDiv from "./FollowingDiv";

interface Follow {
  _id: string;
  username: string
}
export interface ProfileInfo {
  _id: string;
  username: string;
  pfp: string;
  bio: string;
  following: number;
  followers: number;
  followedBy: Follow[];
  followingUsers: Follow[];
  verified: boolean;
}

export default function ProfileCard({_id, username, pfp, bio, following, followers, followedBy, followingUsers, verified}: ProfileInfo){

  const [isOpenFollowers, setIsOpenFollowers] = useState(false)
  const [isOpenFollowing, setIsOpenFollowings] = useState(false)
  const {userInfo} = useAuthContext() 

  if (!userInfo) {
    return <div>User not logged in</div>;
  }

  // console.log(followingUsers)
  
  return (
    <Card className="w-full z-30">
      <CardHeader>
        <div className="relative w-full h-32 bg-gray-400">
        
        <Avatar className="absolute left-2 bottom-[-30px] w-20 h-20 border-2 border-black bg-white">
        <AvatarImage src={pfp} alt="Avatar" />
        <AvatarFallback>
            <span className="material-symbols-rounded medium">
            account_circle
            </span>
        </AvatarFallback>
        </Avatar>
        </div>
        <div className="flex gap-2 pt-10">

          <p className="">{username}</p>
          {verified && 
            <div className='flex items-center'>
            <BadgeCheck size={18} color='#10B981'/> 
            <Label className='text-green-500'>Verified</Label>
            </div>}
        </div>
        

        <CardDescription>{bio}</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
      <div className="flex gap-3">
        <span 
          onClick={() => setIsOpenFollowers(true)}
          className="cursor-pointer hover:underline "
          >Followers {followers}
        </span>

        <span 
          onClick={() => (setIsOpenFollowings(true))}
          className="cursor-pointer hover:underline"
        >
          Following {following}
        </span>
      </div>

      {isOpenFollowers && <FollowersDiv setIsOpen={setIsOpenFollowers} followedBy={followedBy} />}
      {isOpenFollowing && <FollowingDiv setIsOpen={setIsOpenFollowings} followingUsers={followingUsers} />}

      {userInfo.username === username ? (
        <div className="flex">
          <EditProfileButton />
          <DeleteAccountButton /> 
        </div>
      ) : (
        <FollowButton followingUserId={_id} />
      )}
      </CardFooter>
    </Card>
  )

}
