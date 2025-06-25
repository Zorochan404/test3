"use client"

import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState, useRef } from 'react'
// import { getCompanyById, updateCompanyById, deleteCompanyById } from '@/constants/apis'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { uploadToCloudinary } from '@/utils/cloudinary'
import { deleteTestimonialById, getTestimonialById, TestimonialData, updateTestimonialById } from '../../apis'

type Testimonial = {
  _id: string;
  name: string;
  imageUrl?: string;
  feedback: string;
}

export default function EditPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [testimonial, setTestimonial] = useState<Testimonial | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchTestimonial = async () => {
      try {
        const data = await getTestimonialById(id)
        setTestimonial(data as Testimonial | null)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching testimonial:', error)
        setError('Failed to fetch testimonial details')
        setLoading(false)
      }
    }
    fetchTestimonial()
  }, [id])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploading(true)
      const imageUrl = await uploadToCloudinary(file)
      setTestimonial(prev => prev ? { ...prev, imageUrl: imageUrl } : null)
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
    setSubmitting(true)
    try {
      const formData : TestimonialData = {
        name: testimonial?.name ?? "",
        imageUrl: testimonial?.imageUrl,
        feedback: testimonial?.feedback ?? ""
      };
      await updateTestimonialById(id, formData)
      alert("Testimonial details updated successfully")
    } catch (error) {
      console.error('Error updating testimonial:', error)
      toast.error("Failed to update testimonial details")
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
      await deleteTestimonialById(id)
      toast.success('Testimonial deleted successfully')
      router.push('/dashboard/webdata/testimonials')
    } catch (error) {
      console.error('Error deleting testimonial:', error)
      toast.error('Failed to delete testimonial')
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

  if (!testimonial) {
    return <div className="p-6">Testimonial not found</div>
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Testimonial</h1>
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={deleting}
        >
          {deleting ? 'Deleting...' : 'Delete Company'}
        </Button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            defaultValue={testimonial.name}
            onChange={(e) => setTestimonial({ ...testimonial, name: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="feedback">Feedback</Label>
          <Input
            id="feedback"
            defaultValue={testimonial.feedback}
            onChange={(e) => setTestimonial({ ...testimonial, feedback: e.target.value })}
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
          {testimonial.imageUrl && (
            <div className="mt-4">
              <img
                src={testimonial.imageUrl}
                alt="Testimonial image"
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
