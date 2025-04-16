import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';
import { Button } from './ui/button';
import { usePostsContext } from '@/hooks/usePostsContext';
import { useAuthContext } from '@/hooks/useAuthContext';
import { ThumbsDown, ThumbsUp } from 'lucide-react';


export interface PostInterface {
  postId: string;
  title: string;
  author: string;
  profile: string;
  content: string;
  likes?: number;
  dislikes?: number;
  onLike?: () => void;
  onDislike?: () => void;
}

const Post: React.FC<PostInterface> = ({
  postId,
  title, 
  author,
  profile,
  content, 
  likes = 0, 
  dislikes = 0,
  onLike,
  onDislike 
}) => {

  const {user} = useAuthContext() 
  const {dispatch} = usePostsContext()

  const handleDelete = async () => {

    if(!user){
      return
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/post/${postId}`, {
      method: 'DELETE',
      headers: {
        "Authorization": `Bearer ${user.token}`,
      }
    });

    const json = await response.json();

    if (!response.ok) {
      throw new Error('Failed to delete post');
    }

    // Dispatch a delete action if deletion succeeds
    if(response.ok){
      dispatch({ type: 'DELETE_POST', payload: json});
      window.location.reload()
    }
    
  };
  


  return (
    <Card className='w-[600px] h-auto'>
      <CardHeader>
      
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage className="size-8 rounded-full" src={profile} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <p className="text-sm text-gray-500">By {author}</p>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700">{content}</p>
      </CardContent>
      <CardFooter className="flex gap-4">
        <div className="flex items-center gap-1">
          <Button
            className=''
            onClick={onLike} 
            disabled={!onLike}
          >
            <ThumbsUp size={48} strokeWidth={3} />
          </Button>
          <span className='text-2xl'>{likes}</span>
        </div>
        <div className="flex items-center gap-1">
          <Button 
            onClick={onDislike} 
            disabled={!onDislike}
          >
            <ThumbsDown size={48} strokeWidth={3} />
          </Button>
          <span className='text-2xl'>{dislikes}</span>
        </div>
        <Button 
          variant="destructive" 
          onClick={handleDelete}
          className='hover:bg-red-400'
          >Delete</Button>
      </CardFooter>
    </Card>
  );
};

export default Post;