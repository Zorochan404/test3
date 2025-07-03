"use client"

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { ImageUpload } from '@/components/ui/image-upload'
import { toast } from 'sonner'
import { getFreeCourseById, updateFreeCourse, type FreeCourseData, type CourseDetails } from '../../apis'

export default function EditFreeCoursePage() {
  const router = useRouter()
  const params = useParams()
  const courseId = params.id as string
  
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [formData, setFormData] = useState<FreeCourseData>({
    name: '',
    shortDescription: '',
    details: [{
      duration: 8,
      mode: 'Online',
      certificate: 'Yes',
      level: 'Beginner'
    }],
    whyLearnThisCourse: '',
    whatYouWillLearn: [''],
    careerOpportunities: '',
    courseBenefits: [''],
    imageUrl: '',
    isActive: true,
    metaTitle: '',
    metaDescription: '',
    metaKeywords: ''
  })

  useEffect(() => {
    loadCourse()
  }, [courseId])

  const loadCourse = async () => {
    try {
      setInitialLoading(true)
      const course = await getFreeCourseById(courseId)
      
      if (!course) {
        toast.error('Course not found')
        router.push('/dashboard/webdata/free-courses')
        return
      }

      setFormData({
        name: course.name,
        shortDescription: course.shortDescription,
        details: course.details.length > 0 ? course.details : [{
          duration: 8,
          mode: 'Online',
          certificate: 'Yes',
          level: 'Beginner'
        }],
        whyLearnThisCourse: course.whyLearnThisCourse,
        whatYouWillLearn: course.whatYouWillLearn.length > 0 ? course.whatYouWillLearn : [''],
        careerOpportunities: course.careerOpportunities,
        courseBenefits: course.courseBenefits.length > 0 ? course.courseBenefits : [''],
        imageUrl: course.imageUrl,
        isActive: course.isActive,
        metaTitle: course.metaTitle,
        metaDescription: course.metaDescription,
        metaKeywords: course.metaKeywords
      })
    } catch (error) {
      console.error('Error loading course:', error)
      toast.error('Failed to load course')
      router.push('/dashboard/webdata/free-courses')
    } finally {
      setInitialLoading(false)
    }
  }

  const handleInputChange = (field: keyof FreeCourseData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleDetailsChange = (index: number, field: keyof CourseDetails, value: any) => {
    setFormData(prev => ({
      ...prev,
      details: prev.details.map((detail, i) => 
        i === index ? { ...detail, [field]: value } : detail
      )
    }))
  }

  const handleArrayChange = (field: 'whatYouWillLearn' | 'courseBenefits', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }))
  }

  const addArrayItem = (field: 'whatYouWillLearn' | 'courseBenefits') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }))
  }

  const removeArrayItem = (field: 'whatYouWillLearn' | 'courseBenefits', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      
      // Filter out empty items from arrays
      const cleanedData = {
        ...formData,
        whatYouWillLearn: formData.whatYouWillLearn.filter(item => item.trim() !== ''),
        courseBenefits: formData.courseBenefits.filter(item => item.trim() !== '')
      }
      
      await updateFreeCourse(courseId, cleanedData)
      toast.success('Course updated successfully!')
      router.push('/dashboard/webdata/free-courses')
    } catch (error: unknown) {
      console.error('Error updating course:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to update course')
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading course...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit Free Course</h1>
        <p className="text-gray-600">Update course information</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Essential course details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Course Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter course name"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="shortDescription">Short Description *</Label>
              <Textarea
                id="shortDescription"
                value={formData.shortDescription}
                onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                placeholder="Brief description of the course"
                rows={3}
                required
              />
            </div>
            
            <div>
              <ImageUpload
                label="Course Image"
                value={formData.imageUrl}
                onChange={(url) => handleInputChange('imageUrl', url)}
                placeholder="https://example.com/course-image.jpg or upload below"
                description="Recommended: 800x600 pixels, JPG/PNG format. This image will be displayed on the course card."
                imageClassName="w-full max-w-md h-48 object-cover rounded border"
              />
            </div>
          </CardContent>
        </Card>

        {/* Course Details */}
        <Card>
          <CardHeader>
            <CardTitle>Course Details</CardTitle>
            <CardDescription>Duration, mode, and level information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="duration">Duration (weeks) *</Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  value={formData.details[0].duration}
                  onChange={(e) => handleDetailsChange(0, 'duration', parseInt(e.target.value))}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="mode">Learning Mode *</Label>
                <Select value={formData.details[0].mode} onValueChange={(value) => handleDetailsChange(0, 'mode', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Online">Online</SelectItem>
                    <SelectItem value="Offline">Offline</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="level">Course Level *</Label>
                <Select value={formData.details[0].level} onValueChange={(value) => handleDetailsChange(0, 'level', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="certificate">Certificate *</Label>
                <Select value={formData.details[0].certificate} onValueChange={(value) => handleDetailsChange(0, 'certificate', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Course Content */}
        <Card>
          <CardHeader>
            <CardTitle>Course Content</CardTitle>
            <CardDescription>What students will learn and why</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="whyLearnThisCourse">Why Learn This Course *</Label>
              <Textarea
                id="whyLearnThisCourse"
                value={formData.whyLearnThisCourse}
                onChange={(e) => handleInputChange('whyLearnThisCourse', e.target.value)}
                placeholder="Explain why students should learn this course"
                rows={4}
                required
              />
            </div>
            
            <div>
              <Label>What You Will Learn *</Label>
              {formData.whatYouWillLearn.map((item, index) => (
                <div key={index} className="flex gap-2 mt-2">
                  <Input
                    value={item}
                    onChange={(e) => handleArrayChange('whatYouWillLearn', index, e.target.value)}
                    placeholder={`Learning objective ${index + 1}`}
                    required={index === 0}
                  />
                  {formData.whatYouWillLearn.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayItem('whatYouWillLearn', index)}
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
                onClick={() => addArrayItem('whatYouWillLearn')}
                className="mt-2"
              >
                Add Learning Objective
              </Button>
            </div>
            
            <div>
              <Label htmlFor="careerOpportunities">Career Opportunities *</Label>
              <Textarea
                id="careerOpportunities"
                value={formData.careerOpportunities}
                onChange={(e) => handleInputChange('careerOpportunities', e.target.value)}
                placeholder="e.g., Frontend Developer, Web Designer, UI/UX Developer"
                rows={2}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Course Benefits */}
        <Card>
          <CardHeader>
            <CardTitle>Course Benefits</CardTitle>
            <CardDescription>Benefits students will receive</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Course Benefits *</Label>
              {formData.courseBenefits.map((item, index) => (
                <div key={index} className="flex gap-2 mt-2">
                  <Input
                    value={item}
                    onChange={(e) => handleArrayChange('courseBenefits', index, e.target.value)}
                    placeholder={`Benefit ${index + 1}`}
                    required={index === 0}
                  />
                  {formData.courseBenefits.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayItem('courseBenefits', index)}
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
                onClick={() => addArrayItem('courseBenefits')}
                className="mt-2"
              >
                Add Benefit
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* SEO Information */}
        <Card>
          <CardHeader>
            <CardTitle>SEO Information</CardTitle>
            <CardDescription>Meta tags for search engine optimization</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="metaTitle">Meta Title</Label>
              <Input
                id="metaTitle"
                value={formData.metaTitle}
                onChange={(e) => handleInputChange('metaTitle', e.target.value)}
                placeholder="SEO title for the course"
              />
            </div>
            
            <div>
              <Label htmlFor="metaDescription">Meta Description</Label>
              <Textarea
                id="metaDescription"
                value={formData.metaDescription}
                onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                placeholder="SEO description for the course"
                rows={2}
              />
            </div>
            
            <div>
              <Label htmlFor="metaKeywords">Meta Keywords</Label>
              <Input
                id="metaKeywords"
                value={formData.metaKeywords}
                onChange={(e) => handleInputChange('metaKeywords', e.target.value)}
                placeholder="SEO keywords (comma separated)"
              />
            </div>
          </CardContent>
        </Card>

        {/* Course Status */}
        <Card>
          <CardHeader>
            <CardTitle>Course Status</CardTitle>
            <CardDescription>Set the course availability</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => handleInputChange('isActive', checked)}
              />
              <Label htmlFor="isActive">Active (Course is available to students)</Label>
            </div>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update Course'}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
} 