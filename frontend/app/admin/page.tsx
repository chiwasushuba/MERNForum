'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

interface Follow {
  _id: string
  username: string
}

interface UserDetails {
  _id: string
  email: string
  username: string
  password: string
  profile: string
  bio: string
  followers: number
  following: number
  followedBy: Follow[]
  followingUsers: Follow[]
  verified: boolean
}

const Page = () => {
  const [users, setUsers] = useState<UserDetails[]>([])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const resp = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/user`)
        setUsers(resp.data)
      } catch (err) {
        console.error('Error fetching users:', err)
      }
    }

    fetchUsers()
  }, [])

  return (
    <div className="flex flex-col items-center py-10 px-4">
      <Label className="text-4xl font-bold mb-6">All Existing Users:</Label>

      <Card className="w-full max-w-2xl p-4 space-y-3 shadow-md rounded-xl">
        {users.length === 0 ? (
          <p className="text-gray-500 text-center">No users found.</p>
        ) : (
          users.map((user) => (
            <Card
              key={user._id}
              className="flex items-start justify-between gap-4 p-3 border rounded-md"
            >
              <div className="flex items-center gap-3">
                <img
                  src={user.profile}
                  alt={`${user.username}'s profile`}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <Link href={`/profile/${user._id}`}>
                    <Label className="font-semibold text-lg hover:underline cursor-pointer">
                      {user.username}
                    </Label>
                  </Link>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded ${
                  user.verified ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-600'
                }`}
              >
                {user.verified ? 'Verified' : 'Unverified'}
              </span>
            </Card>
          ))
        )}
      </Card>
    </div>
  )
}

export default Page
