"use client"

import DynamicTable from '@/components/dynamic-table'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { getSessionLogins } from './apis'

type SessionLogin = {
  _id: string;
  name: string;
  phoneNumber: string;
  email: string;
  city: string;
  course: string;
}

export default function Page() {
  const [sessionLogins, setSessionLogins] = useState<SessionLogin[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSessionLogins = async () => {
      try {
        const data = await getSessionLogins()
        setSessionLogins(data as SessionLogin[])
      } catch (error) {
        console.error('Error fetching session logins:', error)
        setError('Failed to fetch session logins')
      }
    }
    fetchSessionLogins()
  }, [])

  const mappedSessionLogins = sessionLogins.map((sessionLogin) => ({
    id: sessionLogin._id,
    name: sessionLogin.name,
    phoneNumber: sessionLogin.phoneNumber,
    email: sessionLogin.email,
    city: sessionLogin.city,
    course: sessionLogin.course
  }))

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>
  }

  return (
    <div>
      <div className='flex justify-between items-center mx-6'>
        <div className='text-2xl font-bold capitalize'>
          Session Login Details
        </div>
        <Link href={'/dashboard/webdata/session-login-details/add'}>
          <Button>Add Session Login</Button>
        </Link>
      </div>
      <DynamicTable
        data={mappedSessionLogins}
        headers={[
            { key: 'name', label: 'Name' },
            { key: 'phoneNumber', label: 'Phone Number' },
            { key: 'email', label: 'Email' },
            { key: 'city', label: 'City' },
            { key: 'course', label: 'Course' },
            { key: 'actions', label: '', className: 'w-[50px]' }
          ]}
        url="/dashboard/webdata/session-login-details/edit"
      />
    </div>
  )
}
