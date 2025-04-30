'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import axios from 'axios'

const Page = () => {
  const searchParams = useSearchParams()
  const query = searchParams.get('query') || ''
  const [results, setResults] = useState([])
  const userId = searchParams.get("query");



  useEffect(() => {
    if (!query) return

    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/search?query=${encodeURIComponent(query)}`)
        setResults(res.data.results)
      } catch (err) {
        console.error(err)
      }
    }

    fetchData()
  }, [query])

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Search results for: <span className="text-blue-600">"{query}"</span></h1>

      {/* Example static rendering if you're not fetching data yet */}
      {results.length === 0 ? (
        <p>No results found or waiting for input...</p>
      ) : (
        <ul className="space-y-2">
          {results.map((item: any, index: number) => (
            <li key={index} className="p-2 bg-gray-100 rounded">{item}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Page
 