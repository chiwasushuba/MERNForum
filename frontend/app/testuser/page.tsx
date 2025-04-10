'use client'

import React, {useEffect, useState} from 'react'
import {usePostsContext} from '@/hooks/usePostsContext'

const Page = () => {
  const {posts, dispatch} = usePostsContext();

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch("http://localhost:4000/api/user");
      const json = await response.json()

      if(response.ok){
        dispatch({type: 'SET_POSTS', payload: json})
      }
    }



  }, []);
  

  return (
    <div>
      <h2>Users</h2>
        <ul>
          {users.map((user) => (
            <li key={user._id}>{user.username}</li>
          ))}
        </ul>

    </div>
  )
}

export default Page