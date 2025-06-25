"use client"

import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { getSessionLoginById, updateSessionLoginById, deleteSessionLoginById } from '../../apis'

type SessionLogin = {
  _id: string;
  name: string;
  phoneNumber: string;
  email: string;
  city: string;
  course: string;
}

export default function EditPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  
  const [sessionLogin, setSessionLogin] = useState<SessionLogin>({
    _id: '',
    name: '',
    phoneNumber: '',
    email: '',
    city: '',
    course: '',
  })
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  useEffect(() => {
    const fetchSessionLogin = async () => {
      try {
        const data = await getSessionLoginById(id)
        setSessionLogin(data as SessionLogin)
      } catch (error) {
        console.error('Error fetching session login:', error)
        toast.error('Failed to fetch session login details')
      } finally {
        setInitialLoading(false)
      }
    }
    
    if (id) {
      fetchSessionLogin()
    }
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!sessionLogin.name.trim() || !sessionLogin.phoneNumber.trim() || !sessionLogin.email.trim() || !sessionLogin.city.trim() || !sessionLogin.course.trim()) {
      toast.error('All fields are required')
      return
    }

    setLoading(true)
    try {
      await updateSessionLoginById(id, {
        name: sessionLogin.name,
        phoneNumber: sessionLogin.phoneNumber,
        email: sessionLogin.email,
        city: sessionLogin.city,
        course: sessionLogin.course,
      })
      toast.success('Session login updated successfully')
      router.push('/dashboard/webdata/session-login-details')
    } catch (error) {
      console.error('Error updating session login:', error)
      toast.error('Failed to update session login')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this session login record?')) {
      return
    }

    setDeleting(true)
    try {
      await deleteSessionLoginById(id)
      toast.success('Session login deleted successfully')
      router.push('/dashboard/webdata/session-login-details')
    } catch (error) {
      console.error('Error deleting session login:', error)
      toast.error('Failed to delete session login')
    } finally {
      setDeleting(false)
    }
  }

  if (initialLoading) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Session Login Details</h1>
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={deleting}
        >
          {deleting ? 'Deleting...' : 'Delete Record'}
        </Button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            value={sessionLogin.name}
            onChange={(e) => setSessionLogin({ ...sessionLogin, name: e.target.value })}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number *</Label>
          <Input
            id="phoneNumber"
            value={sessionLogin.phoneNumber}
            onChange={(e) => setSessionLogin({ ...sessionLogin, phoneNumber: e.target.value })}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={sessionLogin.email}
            onChange={(e) => setSessionLogin({ ...sessionLogin, email: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">City *</Label>
          <Input
            id="city"
            value={sessionLogin.city}
            onChange={(e) => setSessionLogin({ ...sessionLogin, city: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="course">Course *</Label>
          <Input
            id="course"
            value={sessionLogin.course}
            onChange={(e) => setSessionLogin({ ...sessionLogin, course: e.target.value })}
            required
          />
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update Session Login'}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.push('/dashboard/webdata/session-login-details')}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
