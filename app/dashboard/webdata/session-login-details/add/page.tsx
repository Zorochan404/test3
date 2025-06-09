"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { addSessionLogin } from '../apis'
import { useRouter } from 'next/navigation'

type SessionLoginForm = {
  name: string;
  phoneNumber: string;
  email: string;
  city: string;
  course: string;
}

export default function AddPage() {
  const router = useRouter()
  const [sessionLogin, setSessionLogin] = useState<SessionLoginForm>({
    name: '',
    phoneNumber: '',
    email: '',
    city: '',
    course: '',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!sessionLogin.name.trim() || !sessionLogin.phoneNumber.trim() || !sessionLogin.email.trim() || !sessionLogin.city.trim() || !sessionLogin.course.trim()) {
      toast.error('All fields are required')
      return
    }

    setLoading(true)
    try {
      await addSessionLogin(sessionLogin)
      toast.success('Session login added successfully')
      router.push('/dashboard/webdata/session-login-details')
    } catch (error) {
      console.error('Error adding session login:', error)
      toast.error('Failed to add session login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Add Session Login Details</h1>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            value={sessionLogin.name}
            onChange={(e) => setSessionLogin(prev => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number *</Label>
          <Input
            id="phoneNumber"
            value={sessionLogin.phoneNumber}
            onChange={(e) => setSessionLogin(prev => ({ ...prev, phoneNumber: e.target.value }))}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={sessionLogin.email}
            onChange={(e) => setSessionLogin(prev => ({ ...prev, email: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">City *</Label>
          <Input
            id="city"
            value={sessionLogin.city}
            onChange={(e) => setSessionLogin(prev => ({ ...prev, city: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="course">Course *</Label>
          <Input
            id="course"
            value={sessionLogin.course}
            onChange={(e) => setSessionLogin(prev => ({ ...prev, course: e.target.value }))}
            required
          />
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Session Login'}
        </Button>
      </form>
    </div>
  )
}
