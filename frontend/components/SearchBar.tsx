'use client'

import React, { useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Search } from 'lucide-react'

const SearchBar = () => {
  const [search, setSearch] = useState('')

  const searchEnginer = () => {
    console.log("Bomarbino Crocodillo")
  }

  return (
    <div className='flex align-center mt-3 gap-2'>
      <Input className='w-auto'
      placeholder='Search'
      value={search}
      onChange={(e) => {setSearch(e.target.value)}}
      />
      <Button 
      className='bg-gray-700'>
        <Search size={48} strokeWidth={3} />
      </Button>

    </div>
  )
}

export default SearchBar