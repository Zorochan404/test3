"use client"

// import { useParams } from 'next/navigation'
import React, {  useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ImageUpload } from '@/components/ui/image-upload'
import { toast } from 'sonner'
import { createMembership, type MembershipInput } from '../apis'
import { ErrorDisplay } from '@/components/error-display'

type Membership = {
  name: string;
  src?: string;
  feedback: string;
}

export default function AddMembershipPage() {
  const [membership, setMembership] = useState<MembershipInput>({
    name: '',
    src: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<any>(null)



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null) // Clear any previous errors
    
    try {
      const formData: MembershipInput = {
        name: membership.name,
        src: membership.src,
      }
      await createMembership(formData)
      toast.success("Membership details added successfully")
      
      // Reset form
      setMembership({
        name: '',
        src: ''
      })
    } catch (error) {
      console.error('Error adding membership:', error)
      setError(error)
    } finally {
      setSubmitting(false)
    }
  }

  // if (error) {
  //   return <div className="p-6 text-red-500">{error}</div>
  // }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Add Membership</h1>
      
      {/* Display API errors */}
      <ErrorDisplay error={error} onClose={() => setError(null)} />
      
      <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={membership.name}
            onChange={(e) => setMembership(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter membership name"
            required
          />
        </div>
        
        <div className="space-y-2">
          <ImageUpload
            label="Membership Logo"
            value={membership.src || ''}
            onChange={(url) => setMembership(prev => ({ ...prev, src: url }))}
            placeholder="https://example.com/logo.png or upload below"
            description="Recommended: 200x100 pixels, PNG/JPG format with transparent background. This logo will be displayed for the membership partner."
            imageClassName="w-32 h-16 object-contain rounded border bg-white"
            required
          />
        </div>
        
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </div>
  )
}
