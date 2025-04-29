'use client'

import LeftSideBar from "@/components/LeftSideBar";
import RightSideBar from "@/components/RightSideBar";
import { usePostsContext } from "@/hooks/usePostsContext";
import { useEffect } from "react";
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
  };
  likes: number;
  dislikes: number;
}


export default function Home() {

  const {posts, dispatch} = usePostsContext();
  const {userInfo} = useAuthContext();

  
  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/post/`, {
        headers:{
          "Authorization": `Bearer ${userInfo.token}`
        }
      });
      const json = await response.json()

      if (response.ok) {
        dispatch({ type: 'SET_POSTS', payload: json });
      } else {
        console.error('Failed to fetch posts');
      }
    }

    if(userInfo){
      fetchPosts();
      console.log(userInfo.verified)
    }
  }, [dispatch, userInfo]);

  
  
  return(
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
                userVerified={userInfo.verified}
              />
            ))}
            <div className="fixed bottom-5 right-75">
              <AddPostButton />
            </div>
          </div>
        </div>
      </div>
      <RightSideBar />
    </div>
  );
}
