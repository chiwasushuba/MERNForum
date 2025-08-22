'use client'

import LeftSideBar from "@/components/LeftSideBar";
import RightSideBar from "@/components/RightSideBar";
import { usePostsContext } from "@/hooks/usePostsContext";
import { useEffect, useState } from "react";
import { useAuthContext } from "@/hooks/useAuthContext";  
import AddPostButton from "@/components/AddPostButton";
import PostPreview from "@/components/PostPreview";

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

export default function Home() {
  const { posts, dispatch } = usePostsContext();
  const { userInfo } = useAuthContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const fetchPosts = async () => {
      try {
        const headers: HeadersInit = {};
        if (userInfo?.token) {
          headers["Authorization"] = `Bearer ${userInfo.token}`;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/post/`, {
          headers,
        });

        if (!response.ok) {
          throw new Error("Backend not ready");
        }

        const json = await response.json();
        dispatch({ type: "SET_POSTS", payload: json });
        setIsLoading(false);
        document.title = `Flux Talk`;

        if (intervalId) clearInterval(intervalId); 
      } catch (error) {
        console.warn("Backend not ready, retrying in 5s...");
        setIsLoading(true);
      }
    };
    
    fetchPosts();

    // Keep retrying every 5 seconds until it works
    intervalId = setInterval(fetchPosts, 5000);

    return () => clearInterval(intervalId);
  }, [dispatch, userInfo]);

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="flex justify-around">
      <LeftSideBar />
      <div className="bg-gray-100 w-full min-h-screen ">
        <div className="flex flex-col ">
          <div className="flex flex-col items-center gap-5">
            {posts && posts.map((post: Post) => (
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
            <div className="fixed bottom-5 right-75">
              {userInfo && <AddPostButton />}
            </div>
          </div>
        </div>
      </div>
      <RightSideBar />
    </div>
  );
}
