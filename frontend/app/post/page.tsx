'use client'

import DeleteAccountButton from "@/components/DeleteAccountButton"
import LeftSideBar from "@/components/LeftSideBar"
import RightSideBar from "@/components/RightSideBar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar"
import {useState, useEffect} from "react"

const PostPage = () => {
    

    return(
        <div>
            <LeftSideBar/>
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
                    {(user.username === username) && (
                    <>
                        {/* <EditProfileButton /> */}
                        <DeleteAccountButton /> 
                        {/* <Button>Delete</Button> */}
                    </>
                    )}
                    
                </CardFooter>
                </Card>


            <RightSideBar/>
        </div>
    )

}

export default PostPage