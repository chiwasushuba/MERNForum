import React from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios';

// Define interfaces for better type safety
interface UserData {
  token: string;
  _id: string;
  username: string;
}

interface Post {
  _id: string;
  // Add other post properties as needed
}

interface Comment {
  _id: string;
  // Add other comment properties as needed
}

const DeleteAccountButton = () => {
  const router = useRouter();

  const userData = sessionStorage.getItem('user');
  const parsedUserData: UserData | null = userData ? JSON.parse(userData) : null;
  const token = parsedUserData?.token || null;
  const userId = parsedUserData?._id || null;
  const username = parsedUserData?.username || null;

  const handleClick = async () => {
    const confirm = window.confirm("Are you sure you want to delete your account?");

    if (confirm) {
      if (!userId || !token) {
        console.log("User ID or token not found");
        return;
      }

      try {
        // Fetch all posts of the user
        const { data: posts } = await axios.get<Post[]>(`http://localhost:3001/api/posts/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Fetch all user replies
        const { data: comments } = await axios.get<Comment[]>(`http://localhost:3001/api/posts/user/${userId}/comments`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (comments.length > 0) {
          // Delete all comments by user
          await axios.delete(`http://localhost:3001/api/posts/user/${userId}/comments`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log(`All comments by ${username} have been deleted`);
        }

        console.log("Deleting posts:", posts.map((post) => post._id));

        if (posts.length > 0) {
          // Delete all posts
          await Promise.all(
            posts.map((post) =>
              axios.delete(`http://localhost:3001/api/posts/${post._id}`, {
                headers: { Authorization: `Bearer ${token}` },
              })
            )
          );
          console.log("All posts deleted successfully");
        }

        // Delete user account
        const response = await axios.delete(`http://localhost:3001/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          alert('Account deleted successfully');
          sessionStorage.removeItem('user'); // Deletes user from session
          router.push('/login'); // Redirect to login page
        } else {
          console.error('Failed to delete account');
        }
      } catch (error: unknown) {
        // Properly type the error
        const axiosError = error as AxiosError;
        console.error(
          'Error deleting account:', 
          axiosError.response?.data || axiosError.message
        );
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