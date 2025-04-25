'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
// import EditProfileButton from "./edit-profile-button";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import DeleteAccountButton from "./DeleteAccountButton";
import { Button } from "./ui/button";
import { useAuthContext } from "@/hooks/useAuthContext";
import EditProfileButton from "./EditProfileButton";


export interface ProfileInfo {
  _id: string;
  username: string;
  pfp: string;
  bio: string;
}

export default function ProfileCard({_id, username, pfp, bio }: ProfileInfo){

  const {userInfo} = useAuthContext() 
  
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
        <div className="pt-10">

          <CardTitle></CardTitle>
          <p className="">{username}</p>
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
