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

  const {posts, dispatch} = usePostsContext();
  const {userInfo} = useAuthContext();
  const [isLoading, setIsLoading] = useState(true)

  
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const headers: HeadersInit = {};

        if (userInfo?.token) {
          headers["Authorization"] = `Bearer ${userInfo.token}`;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/post/`, {
          headers,
        });

        const json = await response.json();

        if (response.ok) {
          dispatch({ type: "SET_POSTS", payload: json });
          document.title = `Flux Talk`;
        } else {
          console.error("Failed to fetch posts", json);
        }
      } catch (error: unknown) {
        console.error("Error fetching posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Always call fetchPosts — allow guests to see posts
    fetchPosts();
  }, [dispatch, userInfo]);


  if (isLoading) return <p>Loading...</p>;
  
  return(
    <div className="flex justify-around">
      <LeftSideBar />
      <div className="bg-gray-100 w-full min-h-screen ">
        <div className="flex flex-col ">
          <div className="flex flex-col items-center gap-5">
            {/* <UserPreview id={"680f6421f33116cabec2f563"} profile={"https://img.pokemondb.net/sprites/sword-shield/normal/charizard.png"} username={"testJoshua2"} bio={"testJoshua2"} followers={0} following={0} verified={false}/> */}
            {/* {(!posts || posts.length === 0) && <Label className="text-gray-200">No Post Yet.........</Label>} */}
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
