"use client"

import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ImageUpload } from '@/components/ui/image-upload'
import { toast } from 'sonner'
import { deleteMembershipById, getMembershipById, MembershipInput, updateMembershipById } from '../../apis'

type Membership = {
  _id: string;
  name: string;
  src?: string;
}

export default function EditPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [membership, setMembership] = useState<Membership | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const fetchMembership = async () => {
      try {
        const data = await getMembershipById(id)
        setMembership(data as Membership | null)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching membership:', error)
        setError('Failed to fetch membership details')
        setLoading(false)
      }
    }
    fetchMembership()
  }, [id])



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const formData: MembershipInput = {
        name: membership?.name ?? "",
        src: membership?.src,
       
      }
      await updateMembershipById(id, formData)
      alert("Membership details updated successfully")
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
      await deleteMembershipById(id)
      toast.success('Membership deleted successfully')
      router.push('/dashboard/webdata/membership')
    } catch (error) {
      console.error('Error deleting membership:', error)
      toast.error('Failed to delete membership')
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

  if (!membership) {
    return <div className="p-6">Membership not found</div>
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Membership</h1>
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
          <Label htmlFor="name">Company Name</Label>
          <Input
            id="name"
            defaultValue={membership.name}
            onChange={(e) => setMembership({ ...membership, name: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <ImageUpload
            label="Membership Logo"
            value={membership.src || ''}
            onChange={(url) => setMembership(prev => prev ? { ...prev, src: url } : null)}
            placeholder="https://example.com/logo.png or upload below"
            description="Recommended: 200x100 pixels, PNG/JPG format with transparent background. This logo will be displayed for the membership partner."
            imageClassName="w-32 h-16 object-contain rounded border bg-white"
              />
        </div>
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </div>
  )
}
