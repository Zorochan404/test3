"use client"

// import { useParams } from 'next/navigation'
import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { uploadToCloudinary } from '@/utils/cloudinary'
import { addadvisor } from '../apis'

type Membership = {
  name: string;
  src?: string;
  role: string;
  description: string;
}

export default function EditPage() {
//   const params = useParams()
//   const id = params.id as string
  const [advisor, setAdvisor] = useState<Membership>({
    name: '',
    role: '',
    src: '',
    description: '',
  })
//   const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploading(true)
      const imageUrl = await uploadToCloudinary(file)
      setAdvisor(prev => ({ ...prev, src: imageUrl }))
      toast.success('Image uploaded successfully')
      console.log('Image URL:', imageUrl)
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
      setUploading(false)
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const formData = {
        name: advisor.name,
        role: advisor.role,
        image: advisor.src,
        description: advisor.description
      }
      await addadvisor(formData)
      alert("Advisor details added successfully")
    } catch (error) {
      console.error('Error updating company:', error)
      toast.error("Failed to update company details")
    } finally {
      setSubmitting(false)
    }
  }

//   if (error) {
//     return <div className="p-6 text-red-500">{error}</div>
//   }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Add Advisor</h1>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={advisor.name}
            onChange={(e) => setAdvisor(prev => ({ ...prev, name: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Input
            id="role"
            value={advisor.role}
            onChange={(e) => setAdvisor(prev => ({ ...prev, role: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={advisor.description}
            onChange={(e) => setAdvisor(prev => ({ ...prev, description: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label>Image</Label>
          <div className="flex items-center space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : 'Upload Image'}
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
          </div>
          <p className="text-sm text-muted-foreground">Supported formats: JPG, PNG, GIF. Max size: 5MB</p>
          {advisor.src && (
            <div className="mt-4">
              <img
                src={advisor.src}
                alt="Company logo"
                className="h-20 w-20 object-contain rounded"
              />
            </div>
          )}
        </div>
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </div>
  )
}
