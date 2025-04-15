"use client";

import React, { useEffect, useState } from "react";
import LeftSideBar from "@/components/LeftSideBar";
import RightSideBar from "@/components/RightSideBar";
import ProfileCard from "@/components/ProfileCard";
import axios from "axios";

const Page = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async () => {
      const unparsedData = localStorage.getItem("user");

      if (!unparsedData) {
        console.error("No user data found");
        setLoading(false);
        return;
      }

      const userData = JSON.parse(unparsedData);

      try {
        const resp = await axios.get(`http://localhost:4000/api/user/${userData.userId}`);

        if (resp.status === 200) {
          setUser(resp.data); // ✅ Use resp.data instead of resp
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <LeftSideBar />
      <div className="flex flex-col">
        {user ? (
          <ProfileCard _id={user._id} username={user.username} bio={user.bio} pfp={user.profile} />
        ) : (
          <p>User not found.</p>
        )}
      </div>
      <RightSideBar />
    </div>
  );
};

export default Page;
