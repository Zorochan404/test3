"use client"

// import { useParams } from 'next/navigation'
import React, {  useState, useRef } from 'react'
// import { addCompany, getCompanyById, updateCompanyById } from '@/constants/apis'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { uploadToCloudinary } from '@/utils/cloudinary'
import { createMembership, type MembershipInput } from '../apis'
import { ErrorDisplay } from '@/components/error-display'

type Membership = {
  name: string;
  src?: string;
  feedback: string;
}

export default function EditPage() {
  // const params = useParams()
  // const id = params.id as string
  const [membership, setMembership] = useState<MembershipInput>({
    name: '',
    src: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setSubmitting(true)
      const imageUrl = await uploadToCloudinary(file)
      setMembership(prev => ({ ...prev, src: imageUrl }))
      toast.success('Image uploaded successfully')
    } catch (error) {
      console.error('Error uploading image:', error)
      if (error instanceof Error) {
        if (error.message.includes('File must be an image')) {
          toast.error('Please select an image file')
        } else if (error.message.includes('File size must be less than 5MB')) {
          toast.error('Image size must be less than 5MB')
        } else if (error.message.includes('Missing Cloudinary configuration')) {
          toast.error('Server configuration error. Please contact support.')
        } else {
          toast.error('Failed to upload image. Please try again.')
        }
      } else {
        toast.error('An unexpected error occurred. Please try again.')
      }
    } finally {
      setSubmitting(false)
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

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
          <Label htmlFor="src">Logo URL</Label>
          <Input
            id="src"
            value={membership.src}
            onChange={(e) => setMembership(prev => ({ ...prev, src: e.target.value }))}
            placeholder="Enter logo URL"
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
