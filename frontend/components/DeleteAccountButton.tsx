import React from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import { useLogout } from '@/hooks/useLogout';
import { useAuthContext } from "@/hooks/useAuthContext"; 

// Define interfaces for better type safety
interface UserData {
  token: string;
  userId: string;
  username: string;
}

interface Post {
  _id: string;
  title: string;
  content: string;
  image: string;
  user: {
    _id: string;
    profile: string;
    username: string;
  };
  likes: number;
  dislikes: number;
}

// interface Comment {
//   _id: string;
//   // Add other comment properties as needed
// }

const DeleteAccountButton = () => {
  const router = useRouter();
  const { logout } = useLogout();
  const { userInfo } = useAuthContext();

  const handleClick = async () => {
    const confirm = window.confirm("Are you sure you want to delete your account?");

    if (confirm) {
      if (!userInfo.userId || !userInfo.token) {
        console.log("User ID or token not found");
        return;
      }

      try {
        // Fetch all posts of the user (using destructuring to directly extract posts)
        const { data: posts } = await axios.get<Post[]>(`${process.env.NEXT_PUBLIC_API_URL}/api/user/post/${userInfo.userId}`);

        if (posts.length > 0) {
          // Delete all posts in parallel, catching errors for individual deletions
          await Promise.all(
            posts.map((post) =>
              axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/post/${post._id}`, {
                headers: { Authorization: `Bearer ${userInfo.token}` },
              }).catch((error) => console.error(`Failed to delete post with ID: ${post._id}`, error))
            )
          );
          console.log("All posts deleted successfully");
        }

        // Delete user account
        const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/user/${userInfo.userId}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });

        if (response.status === 200) {
          alert('Account deleted successfully');
          router.push('/login');
          logout();
           // Redirect to login page
        } else {
          console.error('Failed to delete account');
        }
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          console.error(
            'Error deleting account:', 
            error.response?.data || error.message
          );
        } else {
          console.error('Unknown error:', error);
        }
        alert('An error occurred while deleting your account.');
      }
    } else {
      alert("Account not deleted");
    }
  };

  return (
    <Button className='bg-red-600 ml-2' onClick={handleClick}>
      Delete
    </Button>
  );
};

export default DeleteAccountButton;
