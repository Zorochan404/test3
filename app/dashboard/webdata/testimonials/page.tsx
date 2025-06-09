"use client"

import DynamicTable from '@/components/dynamic-table'
// import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

// import { getCompanies } from '@/constants/apis'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { getTestimonials } from './apis'

type testimonial = {
  _id: string;
  name: string;
  imageUrl?: string;
  feedback: string;
}

export default function Page() {
  // const params = useParams()
  const [testimonials, setTestimonials] = useState<testimonial[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const data = await getTestimonials()

          setTestimonials(data)
      
      } catch (error) {
        console.error('Error fetching companies:', error)
        setError('Failed to fetch companies')
      }
    }
    fetchTestimonials()
  }, [])

  const mappedTestimonials = testimonials.map((testimonial) => ({
    id: testimonial._id,
    name: testimonial.name,
    image: { 
      type: testimonial.imageUrl ? 'image' as const : 'text' as const, 
      value: testimonial.imageUrl || 'No image available' 
    },
    feedback: testimonial.feedback
  }))

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>
  }

  return (
    <div>
      <div className='flex justify-between items-center mx-6'>
        <div className='text-2xl font-bold capitalize'>
          Testimonials
        </div>
        <Link href={'/dashboard/webdata/testimonials/add'}><Button>Add Testimonials</Button></Link>
      </div>
      <DynamicTable 
        data={mappedTestimonials}
        headers={[
            { key: 'name', label: 'Name' },
            { key: 'image', label: 'Image' },
            { key: 'feedback', label: 'Feedback' },
            { key: 'actions', label: '', className: 'w-[50px]' }
          ]}
        url= "/dashboard/webdata/testimonials/edit"
      />
    </div>
  )
}
