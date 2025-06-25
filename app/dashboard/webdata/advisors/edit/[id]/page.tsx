"use client"

import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { uploadToCloudinary } from '@/utils/cloudinary'
import { AdvisorInput, deleteadvisorById, getadvisorById, updateadvisorById } from '../../apis'

type advisor = {
  _id: string;
  name: string;
  image?: string;
  role: string;
  description: string;
}

export default function EditPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [advisor, setAdvisor] = useState<advisor | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchAdvisor = async () => {
      try {
        const data = await getadvisorById(id)
        setAdvisor(data as advisor | null)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching advisor:', error)
        setError('Failed to fetch advisor details')
        setLoading(false)
      }
    }
    fetchAdvisor()
  }, [id])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploading(true)
      const imageUrl = await uploadToCloudinary(file)
      setAdvisor(prev => prev ? { ...prev, image: imageUrl } : null)
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
      setUploading(false)
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!advisor) {
      toast.error('Advisor not loaded')
      return
    }
    setSubmitting(true)
    try {
      const formData: AdvisorInput = {
        name: advisor.name,
        src: advisor.image,
        role: advisor.role,
        description: advisor.description
      }
      await updateadvisorById(id, formData)
      alert("Advisor details updated successfully")
    } catch (error) {
      console.error('Error updating company:', error)
      toast.error("Failed to update company details")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this company?')) {
      return
    }

    setDeleting(true)
    try {
      await deleteadvisorById(id)
      toast.success('Advisor deleted successfully')
      router.push('/dashboard/webdata/advisors')
    } catch (error) {
      console.error('Error deleting advisor:', error)
      toast.error('Failed to delete advisor')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>
  }

  if (!advisor) {
    return <div className="p-6">Advisor not found</div>
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Advisor</h1>
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={deleting}
        >
          {deleting ? 'Deleting...' : 'Delete Advisor'}
        </Button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
        <div className="space-y-2">
          <Label htmlFor="name">Advisor Name</Label>
          <Input
            id="name"
            defaultValue={advisor.name}
            onChange={(e) => setAdvisor({ ...advisor, name: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="role">Advisor Role</Label>
          <Input
            id="role"
            defaultValue={advisor.role}
            onChange={(e) => setAdvisor({ ...advisor, role: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Advisor Description</Label>
          <Input
            id="description"
            defaultValue={advisor.description}
            onChange={(e) => setAdvisor({ ...advisor, description: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Advisor Image</Label>
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
          {advisor.image && (
            <div className="mt-4">
              <img
                src={advisor.image}
                alt="Advisor image"
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
