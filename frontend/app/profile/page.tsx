"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import LeftSideBar from "@/components/LeftSideBar";
import RightSideBar from "@/components/RightSideBar";
import ProfileCard from "@/components/ProfileCard";
import axios from "axios";
import PostPreview from "@/components/PostPreview";
import { Author } from "next/dist/lib/metadata/types/metadata-types";


interface Post {
  _id: string;
  title: string;
  content: string;
  image: string;
  user : {
    _id: string
    profile: string;
    username: string;
  };
  likes: number;
  dislikes: number;
}

interface UserDetails {
  _id: string;
  email: string,
  username: string,
  password: string,
  profile: string,
  bio: string,
  followers: number,
  following: number,
  verified: boolean,
}


const Page = () => {
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");
  const [userDetails, setUserDetails] = useState<UserDetails>();
  const [loading, setLoading] = useState<boolean>(true);
  const [posts, setPosts] = useState<Post[]>()

  console.log(userId)

  useEffect(() => {
    if(!userId){
      setLoading(false)
    }

    const fetchEverything = async () => {

      try {
        const [userResp, postResp]= await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/user/${userId}`), // this is for user
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/user/post/${userId}`) // this is for the posts
        
        ])
        if (userResp.status === 200 && postResp.status === 200) {
          setUserDetails(userResp.data); // setUser() the json that was recieved in the backend
          setPosts(postResp.data);
        }
      } catch (error) {
        console.error("Error fetching user:", error)
      } finally {
        setLoading(false);
      }
    };

    if(userId){
      fetchEverything()
    }
    

  }, [userId]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="flex justify-around">
      <LeftSideBar />
      <div className="flex flex-col">
        <div className="w-200">
          {userDetails && (
              <ProfileCard
                _id={userDetails._id}
                username={userDetails.username}
                bio={userDetails.bio}
                pfp={userDetails.profile}
              />
            )}
          <div className="flex flex-col items-center gap-3 mt-10">

            {/* Just want to try this out slice to keep the original array of posts remains unchanged then reverse it */}
            {posts && posts.slice().reverse().map((post: Post) => (
              <PostPreview
                key={post._id}
                postId={post._id}
                title={post.title}
                user={post.user}
                profile={post.user.profile}
                content={post.content}
                image={post.image}
                likes={post.likes}
                dislikes={post.dislikes}
              />
            ))}

          </div>
          
        </div>
      </div>
      <RightSideBar />
    </div>
  );
};

export default Page;
