"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import LeftSideBar from "@/components/LeftSideBar";
import RightSideBar from "@/components/RightSideBar";
import ProfileCard from "@/components/ProfileCard";
import axios from "axios";
import PostPreview from "@/components/PostPreview";


const Page = () => {
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [posts, setPosts] = useState<any>(null)

  console.log(userId)

  useEffect(() => {
    if (!userId) {
      console.error("No user ID found in URL");
      setLoading(false);
      return;
    }

    const fetchEverything = async () => {

      try {
        const [userResp, postResp]= await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/user/${userId}`), // this is for user
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/user/post/${userId}`) // this is for the posts
        
        ])
        if (userResp.status === 200 && postResp.status === 200) {
          setUser(userResp.data); // setUser() the json that was recieved in the backend
          setPosts(postResp.data);
        }
      } catch (error) {
        console.error("Error fetching user:", error)
      } finally {
        setLoading(false);
      }
    };

    fetchEverything()

  }, [userId]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="flex justify-around">
      <LeftSideBar />
      <div className="flex flex-col">
        <div className="w-200">
          <ProfileCard _id={user._id} username={user.username} bio={user.bio} pfp={user.profile} />
          <div className="flex flex-col items-center gap-3 mt-10">

            {posts && posts.map((post: any) => (
              <PostPreview
                key={post._id}
                postId={post._id}
                title={post.title}
                author={post.user}
                profile={post.user.profile}
                content={post.content}
                image={post.image}
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
