import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import axios from 'axios';
import { useAuthContext } from '@/hooks/useAuthContext';

interface FollowButtonProps {
  followingUserId: string;
}

const FollowButton = ( {followingUserId}: FollowButtonProps) => {
  const { userInfo } = useAuthContext();
  const [followed, setFollowed] = useState<boolean | null>(null); // null means loading

  // Fetch whether the logged-in user already follows this user
  useEffect(() => {
    const fetchFollowStatus = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/user/follow/status/${followingUserId}`,
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        setFollowed(response.data.isFollowing);
      } catch (error) {
        console.error('Error fetching follow status', error);
      }
    };

    if (userInfo?.token) {
      fetchFollowStatus();
    }
  }, [followingUserId, userInfo]);

  const handleClick = async () => {
    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/follow/${followingUserId}`,
        {}, // body is empty; token is in headers
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );

      // Toggle follow status locally
      setFollowed((prev) => !prev);
    } catch (error) {
      console.error('Error toggling follow', error);
    }
  };

  if (followed === null) {
    return <Button disabled>Loading...</Button>;
  }

  return (
    <Button onClick={handleClick}>
      {followed ? 'Unfollow' : 'Follow'}
    </Button>
  );
};

export default FollowButton;
