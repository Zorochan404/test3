"use client"

import DynamicTable from '@/components/dynamic-table'
// import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { getadvisors } from './apis'

type advisor = {
  _id: string;
  name: string;
  image?: string;
  role: string;
  description: string;  
}

export default function Page() {
//   const params = useParams()
  const [advisors, setadvisors] = useState<advisor[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchadvisors = async () => {
      try {
        const data = await getadvisors()

        setadvisors(data as advisor[])
      
      } catch (error) {
        console.error('Error fetching companies:', error)
        setError('Failed to fetch companies')
      }
    }
    fetchadvisors()
  }, [])

  const mappedadvisors = advisors.map((advisor) => ({
    id: advisor._id,
    name: advisor.name,
    image: { 
      type: advisor.image ? 'image' as const : 'text' as const, 
      value: advisor.image || 'No image available' 
    },
    role: advisor.role,
    description: advisor.description
  }))

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>
  }

  return (
    <div>
      <div className='flex justify-between items-center mx-6'>
        <div className='text-2xl font-bold capitalize'>
          advisors
        </div>
        <Link href={'/dashboard/webdata/advisors/add'}><Button>Add advisors</Button></Link>
      </div>
      <DynamicTable 
        data={mappedadvisors}
        headers={[
            { key: 'name', label: 'Name' },
            { key: 'image', label: 'Image' },
            { key: 'role', label: 'Role' },
            { key: 'actions', label: '', className: 'w-[50px]' }
          ]}
        url= "/dashboard/webdata/advisors/edit"
      />
    </div>
  )
}
