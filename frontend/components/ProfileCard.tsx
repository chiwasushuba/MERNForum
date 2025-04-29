'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
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


export interface ProfileInfo {
  username: string;
  pfp: string;
  bio: string;
  verified: boolean;
}

export default function ProfileCard({username, pfp, bio, verified}: ProfileInfo){

  const {userInfo} = useAuthContext() 

  if (!userInfo) {
    return <div>User not logged in</div>;
  }
  
  return (
    <Card className="w-full">
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
      <CardFooter className="flex justify-end">
        {(userInfo.username === username) && (
          <>
            <EditProfileButton />
            <DeleteAccountButton /> 
            {/* <Button>Delete</Button> */}
          </>
        )}
        
      </CardFooter>
    </Card>
  )

}
