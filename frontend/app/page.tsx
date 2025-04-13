'use client'

import LeftSideBar from "@/components/LeftSideBar";
import Post from "@/components/Post";
import RightSideBar from "@/components/RightSideBar";
import { Separator } from "@/components/ui/separator";
import { usePostsContext } from "@/hooks/usePostsContext";
import { useEffect } from "react";
import { useAuthContext } from "@/hooks/useAuthContext";  
import AddPostButton from "@/components/AddPostButton";



export default function Home() {

  let contentVar = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean posuere metus vitae ex maximus, quis consectetur metus lacinia. Sed bibendum, metus sit amet venenatis aliquet, ante diam ornare ante, in semper est nisi quis urna. Nulla facilisi. Aliquam lacus nisl, imperdiet eget faucibus sit amet, ornare mattis diam. Vivamus mollis ligula sit amet dolor tristique finibus. Suspendisse ac condimentum diam. Proin quis mi odio. In neque nulla, pretium a ultricies id, ultrices in eros. Etiam eget ante non velit molestie dictum. Integer ultricies, nisl ut sagittis fermentum, nisi tortor consectetur nisi, vel fermentum neque tellus nec lorem. Mauris et mauris justo. Quisque tempus magna vitae imperdiet ultricies. ";

  const {posts, dispatch} = usePostsContext();
  const {user} = useAuthContext();

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch("http://localhost:4000/api/post/", {
        headers:{
          "Authorization": `Bearer ${user.token}`
        }
      });
      const json = await response.json()

      if (response.ok) {
        console.log("Fetched posts:", json);
        dispatch({ type: 'SET_POSTS', payload: json });
      } else {
        console.error('Failed to fetch posts');
      }
    }

    if(user){
      fetchPosts();
    }
  }, [dispatch, user]);

  

  console.log(posts);

  return(
    <div className="flex justify-around">
      <LeftSideBar />
      <div className="bg-gray-100 w-full min-h-screen ">
        <div className="flex flex-col ">
          
          {/* .
          I want to add a feature in this part (something like a header nav)
          . */}

          <div className="flex flex-col items-center gap-5">
            {posts && posts.map((post: any) => (
              <Post
                key={post._id}
                postId={post._id}
                title={post.title}
                author={post.user.username}
                profile={post.user.profile}
                content={post.content}
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
