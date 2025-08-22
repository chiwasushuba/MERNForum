'use client'

import React, { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import axios from 'axios'
import LeftSideBar from '@/components/LeftSideBar'
import RightSideBar from '@/components/RightSideBar'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import UserPreview from '@/components/UserPreview'
import PostPreview from '@/components/PostPreview'
import UserDetailsPostType from '@/types/userType'

interface UserInterface {
  _id: string
  profile: string
  username: string
  bio: string
  followers: number
  following: number
  verified: boolean
}

export interface PostInterface {
  _id: string
  title: string
  user: UserDetailsPostType
  profile: string
  content: string
  image: string
  likes: number
  dislikes: number
}

const SearchContent = () => {
  const searchParams = useSearchParams()
  const query = searchParams.get('query') || ''
  const [isLoading, setIsLoading] = useState(true)
  const [resultsUsers, setResultsUsers] = useState<UserInterface[]>([])
  const [resultsPosts, setResultsPosts] = useState<PostInterface[]>([])
  const [activeTab, setActiveTab] = useState('all')

  const cleanedQuery = query.startsWith('@') || query.startsWith('#') ? query.slice(1) : query

  useEffect(() => {
    if (!query){
      document.title = `Search: ${cleanedQuery} | Flux Talk`;
      return
    }  

    const fetchData = async () => {
      setIsLoading(true)
      try {
        if (query.startsWith('@')) {
          const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/search/users?query=${encodeURIComponent(cleanedQuery)}`)
          setResultsUsers(res.data.results)
          setActiveTab('users')
          document.title = `Search: ${cleanedQuery} | Flux Talk`;
        } else if (query.startsWith('#')) {
          const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/search/posts?query=${encodeURIComponent(cleanedQuery)}`)
          setResultsPosts(res.data.results)
          setActiveTab('posts')
          document.title = `Search: ${cleanedQuery} | Flux Talk`;
        } else {
          const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/search?query=${encodeURIComponent(cleanedQuery)}`)
          setResultsUsers(res.data.resultsUsers)
          setResultsPosts(res.data.resultsPosts)
          document.title = `Search: ${cleanedQuery} | Flux Talk`;
        }
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [query, cleanedQuery])

  const trimmedQuery = cleanedQuery.trim();

  if (!trimmedQuery) {
    return (
      <div className="flex justify-around">
        <LeftSideBar />
        <div className="bg-gray-100 w-full min-h-screen p-4 flex justify-center items-center">
          <div className="text-gray-500 text-center">
            Please enter a search term to see results.
          </div>
        </div>
        <RightSideBar />
      </div>
    );
  }

  return (
    <div className="flex justify-around">
      <LeftSideBar />
      <div className="bg-gray-100 w-full min-h-screen p-4">
        <div className="flex flex-col items-center gap-5 max-w-3xl mx-auto">
          <div>
            <Label className="text-xl font-bold">Results for: "{cleanedQuery}"</Label>
          </div>

          {isLoading ? (
            <div className="w-full flex justify-center py-10">
              <div className="animate-spin h-8 w-8 border-4 border-gray-300 rounded-full border-t-gray-600"></div>
            </div>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="posts">Posts</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="flex flex-col items-center">
                {resultsUsers.length === 0 && resultsPosts.length === 0 ? (
                  <div className="text-center py-10 text-gray-500">No results found</div>
                ) : (
                  <>
                    {resultsUsers.length > 0 && (
                      <div className="space-y-4">
                        <h2 className="text-lg font-semibold">Users</h2>
                        <div className="space-y-3">
                          {resultsUsers.map((user) => (
                            <UserPreview key={user._id} {...user} />
                          ))}
                        </div>
                      </div>
                    )}
                    {resultsPosts.length > 0 && (
                      <div className="space-y-4 mt-6">
                        <h2 className="text-lg font-semibold">Posts</h2>
                        <div className="space-y-4">
                          {resultsPosts.map((post) => (
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
                        </div>
                      </div>
                    )}
                  </>
                )}
              </TabsContent>

              <TabsContent value="users" className="flex flex-col items-center">
                {resultsUsers.length === 0 ? (
                  <div className="text-center py-10 text-gray-500">No users found</div>
                ) : (
                  <div className="space-y-3">
                    {resultsUsers.map((user) => (
                      <UserPreview key={user._id} {...user} />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="posts" className="flex flex-col items-center">
                {resultsPosts.length === 0 ? (
                  <div className="text-center py-10 text-gray-500">No posts found</div>
                ) : (
                  <div className="space-y-4">
                    {resultsPosts.map((post) => (
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
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
      <RightSideBar />
    </div>
  )
}

// Wrap in Suspense
export default function PageWrapper() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-gray-500">Loading search results...</div>}>
      <SearchContent />
    </Suspense>
  )
}
