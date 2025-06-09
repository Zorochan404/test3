"use client"

import DynamicTable from '@/components/dynamic-table'
// import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import { getMemberships } from './apis'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

type membership = {
  _id: string;
  name: string;
  src?: string;
} 

export default function Page() {
  // const params = useParams()
  const [memberships, setMemberships] = useState<membership[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMemberships = async () => {
      try {
        const data = await getMemberships()

          setMemberships(data)
      
      } catch (error) {
        console.error('Error fetching memberships:', error)
        setError('Failed to fetch memberships')
      }
    }
    fetchMemberships()
  }, [])

  const mappedMemberships = memberships.map((membership) => ({
    id: membership._id,
    name: membership.name,
    image: { 
      type: membership.src ? 'image' as const : 'text' as const, 
      value: membership.src || 'No image available' 
    },

  }))

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>
  }

  return (
    <div>
      <div className='flex justify-between items-center mx-6'>
        <div className='text-2xl font-bold capitalize'>
          Membership
        </div>
        <Link href={'/dashboard/webdata/membership/add'}><Button>Add Membership</Button></Link>
      </div>
      <DynamicTable 
        data={mappedMemberships}
        headers={[
            { key: 'name', label: 'Name' },
            { key: 'image', label: 'Image' },
            { key: 'actions', label: '', className: 'w-[50px]' }
          ]}
        url= "/dashboard/webdata/membership/edit"
      />
    </div>
  )
}
