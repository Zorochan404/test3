"use client"

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { getCareerPostById, updateCareerPost, type CareerPostData } from '../../apis'

export default function EditCareerPage() {
  const router = useRouter()
  const params = useParams()
  const careerId = params.id as string
  
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [formData, setFormData] = useState<CareerPostData>({
    title: '',
    place: '',
    description: '',
    requirements: [''],
    partTime: false,
    isActive: true
  })

  useEffect(() => {
    loadCareer()
  }, [careerId])

  const loadCareer = async () => {
    try {
      setInitialLoading(true)
      const career = await getCareerPostById(careerId)
      
      if (!career) {
        toast.error('Career post not found')
        router.push('/dashboard/webdata/careers')
        return
      }

      setFormData({
        title: career.title,
        place: career.place,
        description: career.description,
        requirements: career.requirements.length > 0 ? career.requirements : [''],
        partTime: career.partTime,
        isActive: career.isActive
      })
    } catch (error) {
      console.error('Error loading career post:', error)
      toast.error('Failed to load career post')
      router.push('/dashboard/webdata/careers')
    } finally {
      setInitialLoading(false)
    }
  }

  const handleInputChange = (field: keyof CareerPostData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleRequirementChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.map((req, i) => i === index ? value : req)
    }))
  }

  const addRequirement = () => {
    setFormData(prev => ({
      ...prev,
      requirements: [...prev.requirements, '']
    }))
  }

  const removeRequirement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      
      // Filter out empty requirements
      const cleanedData = {
        ...formData,
        requirements: formData.requirements.filter(req => req.trim() !== '')
      }
      
      await updateCareerPost(careerId, cleanedData)
      toast.success('Career post updated successfully!')
      router.push('/dashboard/webdata/careers')
    } catch (error: unknown) {
      console.error('Error updating career post:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to update career post')
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading career post...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit Career Post</h1>
        <p className="text-gray-600">Update job posting information</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
            <CardDescription>Essential information about the position</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g., Software Developer, Marketing Manager"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="place">Location *</Label>
              <Input
                id="place"
                value={formData.place}
                onChange={(e) => handleInputChange('place', e.target.value)}
                placeholder="e.g., New York, NY or Remote"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="description">Job Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe the role, responsibilities, and what the company is looking for..."
                rows={6}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Requirements */}
        <Card>
          <CardHeader>
            <CardTitle>Job Requirements</CardTitle>
            <CardDescription>List the skills, experience, and qualifications needed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Requirements *</Label>
              {formData.requirements.map((requirement, index) => (
                <div key={index} className="flex gap-2 mt-2">
                  <Input
                    value={requirement}
                    onChange={(e) => handleRequirementChange(index, e.target.value)}
                    placeholder={`Requirement ${index + 1}`}
                    required={index === 0}
                  />
                  {formData.requirements.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeRequirement(index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addRequirement}
                className="mt-2"
              >
                Add Requirement
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Job Type and Status */}
        <Card>
          <CardHeader>
            <CardTitle>Job Settings</CardTitle>
            <CardDescription>Configure job type and availability</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="partTime"
                checked={formData.partTime}
                onCheckedChange={(checked) => handleInputChange('partTime', checked)}
              />
              <Label htmlFor="partTime">Part-time position</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => handleInputChange('isActive', checked)}
              />
              <Label htmlFor="isActive">Active (Job posting is live and accepting applications)</Label>
            </div>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update Career Post'}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
} 