"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import LeftSideBar from "@/components/LeftSideBar";
import RightSideBar from "@/components/RightSideBar";
import ProfileCard from "@/components/ProfileCard";
import axios from "axios";
import PostPreview from "@/components/PostPreview";
import { useAuthContext } from "@/hooks/useAuthContext";


interface Post {
  _id: string;
  title: string;
  content: string;
  image: string;
  user : {
    _id: string
    profile: string;
    username: string;
    verified: boolean;
  };
  likes: number;
  dislikes: number;
}

interface Follow {
  _id: string;
  username: string
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
  followedBy: Follow[];
  followingUsers: Follow[];
  verified: boolean,
}


const ProfileContent = () => {
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");
  const [userDetails, setUserDetails] = useState<UserDetails>();
  const [loading, setLoading] = useState<boolean>(true);
  const [posts, setPosts] = useState<Post[]>();

  // console.log(userId);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      document.title = "User Profile | Flux Talk"; // Default title if no user ID
      return;
    }

    const fetchEverything = async () => {
      try {
        const [userResp, postResp] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/user/${userId}`),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/user/post/${userId}`),
        ]);
        if (userResp.status === 200 && postResp.status === 200) {
          setUserDetails(userResp.data);
          setPosts(postResp.data);
          document.title = `${userResp.data.username}'s Profile | Flux Talk`;
        }
      } catch (error: unknown) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      } 
    };

    if (userId) {
      fetchEverything();
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
              following={userDetails.following}
              followers={userDetails.followers}
              followedBy={userDetails.followedBy} 
              followingUsers={userDetails.followingUsers}
              verified={userDetails.verified} />
          )}
          <div className="flex flex-col items-center gap-3 mt-10">
            {posts &&
              posts
                .slice()
                .reverse()
                .map((post: Post) => (
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

const Profile = () => (
  <Suspense fallback={<div>Loading Profile...</div>}>
    <ProfileContent />
  </Suspense>
);

export default Profile;