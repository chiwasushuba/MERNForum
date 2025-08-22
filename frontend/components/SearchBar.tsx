'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Search } from 'lucide-react'

const SearchBar = () => {
  const [search, setSearch] = useState('')
  const router = useRouter()

  const searchEngine = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim()) {
      router.push(`/search?query=${encodeURIComponent(search)}`)
    }
  }

  return (
    <form onSubmit={searchEngine}>
      <div className='flex items-center mt-3 gap-2'>
        <Input
          className='w-auto border-black'
          placeholder='Search'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button
          className='bg-gray-700'
          type='submit'
        >
          <Search size={24} strokeWidth={2} />
        </Button>
      </div>
    </form>
  )
}

export default SearchBar
