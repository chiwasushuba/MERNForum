import React, {useEffect, useState} from 'react'
import axios from 'axios'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useSearchParams } from 'next/navigation'

const page = () => {
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");
  const [user, setUser] = useState<any>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // const 


  }

  return (
    <div>
      <Card>
        <CardHeader>

        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>


          </form>
        </CardContent>
        <CardFooter>
          <Button>
            Verify
          </Button>
        </CardFooter>
      </Card>


    </div>
  )
}

export default page