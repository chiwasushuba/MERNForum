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

  useEffect(() => {
    if (!userId) {
      console.error("No user ID found in URL");
      setLoading(false);
      return;
    }

    const fetchUser = async () => {

      try {
        const resp = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/user/${userId}`)
        if (resp.status === 200) {
          setUser(resp.data); // setUser() the json that was recieved in the backend
        }
      } catch (error) {
        console.error("Error fetching user:", error)
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  useEffect(() => {
    const fetchPosts = async () => {
      if(!user) return;

      try {
        const resp = await axios.get(`http://localhost:4000/api/user/post/${userId}`);

        if (resp.status === 200) {
          setPosts(resp.data); // setPosts() the json that was recieved in the backend (i get the data so i don't need to store it in an array structure)
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [userId])

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
                author={post.user.username}
                profile={post.user.profile}
                content={post.content}
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
