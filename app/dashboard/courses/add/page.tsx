"use client"

import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { uploadToCloudinary } from '@/utils/cloudinary'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { HeroImageUpload } from '@/components/ui/image-upload'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createCourse, generateSlug, type Course } from '../apis'

export default function AddCoursePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploadingPdf, setUploadingPdf] = useState(false)
  const pdfInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    description: '',
    heroImage: '',
    ctaTitle: 'Ready to Start Your Journey?',
    ctaDescription: 'Take the first step towards a successful career. Apply now or contact us for more information.',
    brochurePdfUrl: '',
    isActive: true,
    metaTitle: '',
    metaDescription: '',
    metaKeywords: ''
  })

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value }
      
      // Auto-generate slug when title changes
      if (field === 'title' && typeof value === 'string') {
        updated.slug = generateSlug(value)
      }
      
      return updated
    })
  }



  const handlePdfUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
      toast.error('Please select a PDF file')
      return
    }

    try {
      setUploadingPdf(true)
      const pdfUrl = await uploadToCloudinary(file)
      handleInputChange('brochurePdfUrl', pdfUrl)
      toast.success('PDF uploaded successfully!')
    } catch (error) {
      console.error('Error uploading PDF:', error)
      toast.error('Failed to upload PDF. Please try again.')
    } finally {
      setUploadingPdf(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      toast.error('Course title is required')
      return
    }

    if (!formData.slug.trim()) {
      toast.error('Course slug is required')
      return
    }

    if (!formData.description.trim()) {
      toast.error('Course description is required')
      return
    }

    try {
      setLoading(true)

      const courseData: Omit<Course, '_id' | 'createdAt' | 'updatedAt'> = {
        slug: formData.slug.trim(),
        title: formData.title.trim(),
        description: formData.description.trim(),
        heroImage: formData.heroImage,
        programs: [], // Empty array - programs will be added via separate management
        features: [], // Empty array - features will be added via separate management
        testimonials: [], // Empty array - testimonials will be added via separate management
        faqs: [], // Empty array - FAQs will be added via separate management
        curriculum: [], // Empty array - curriculum will be added via separate management
        software: [], // Empty array - software will be added via separate management
        careerProspects: [], // Empty array - career prospects will be added via separate management
        ctaTitle: formData.ctaTitle.trim(),
        ctaDescription: formData.ctaDescription.trim(),
        brochurePdfUrl: formData.brochurePdfUrl,
        isActive: formData.isActive,
        metaTitle: formData.metaTitle,
        metaDescription: formData.metaDescription,
        metaKeywords: formData.metaKeywords
      }

      console.log('Course Form Data:', courseData)

      const newCourse = await createCourse(courseData)
      toast.success('Course created successfully!')
      
      // Redirect to edit page to add programs and features
      router.push(`/dashboard/courses/edit/${newCourse._id}`)
    } catch (error: unknown) {
      console.error('Error creating course:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to create course')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Add New Course</h1>
          <p className="text-gray-600">Create a new dynamic course page</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/courses">
              Back to Courses
            </Link>
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Course title, slug, and description</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Course Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Interior Design"
                required
              />
            </div>

            <div>
              <Label htmlFor="slug">URL Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => handleInputChange('slug', e.target.value)}
                placeholder="interior-design"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                URL will be: https://www.inframeschool.com/{formData.slug}
              </p>
            </div>

            <div>
              <Label htmlFor="description">Course Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Transform spaces and create beautiful environments with our comprehensive interior design programs..."
                rows={4}
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.description.length} characters
              </p>
            </div>

            <HeroImageUpload
              value={formData.heroImage}
              onChange={(url) => handleInputChange('heroImage', url)}
            />
          </CardContent>
        </Card>

        {/* Call-to-Action Section */}
        <Card>
          <CardHeader>
            <CardTitle>Call-to-Action Section</CardTitle>
            <CardDescription>The bottom section encouraging applications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="ctaTitle">CTA Title</Label>
              <Input
                id="ctaTitle"
                value={formData.ctaTitle}
                onChange={(e) => handleInputChange('ctaTitle', e.target.value)}
                placeholder="Ready to Start Your Journey?"
              />
            </div>

            <div>
              <Label htmlFor="ctaDescription">CTA Description</Label>
              <Textarea
                id="ctaDescription"
                value={formData.ctaDescription}
                onChange={(e) => handleInputChange('ctaDescription', e.target.value)}
                placeholder="Take the first step towards a successful career..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="brochurePdf">Course Brochure PDF (Optional)</Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    id="brochurePdf"
                    value={formData.brochurePdfUrl}
                    onChange={(e) => handleInputChange('brochurePdfUrl', e.target.value)}
                    placeholder="https://example.com/brochure.pdf or upload below"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => pdfInputRef.current?.click()}
                    disabled={uploadingPdf}
                  >
                    {uploadingPdf ? 'Uploading...' : 'Upload PDF'}
                  </Button>
                </div>
                <Input
                  ref={pdfInputRef}
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handlePdfUpload}
                  className="hidden"
                />
                {uploadingPdf && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                    Uploading PDF to Cloudinary...
                  </div>
                )}
                {formData.brochurePdfUrl && (
                  <div className="mt-2">
                    <a
                      href={formData.brochurePdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-2"
                    >
                      📄 View uploaded PDF
                    </a>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SEO & Settings */}
        <Card>
          <CardHeader>
            <CardTitle>SEO & Settings</CardTitle>
            <CardDescription>Search engine optimization and course settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="metaTitle">Meta Title (Optional)</Label>
              <Input
                id="metaTitle"
                value={formData.metaTitle}
                onChange={(e) => handleInputChange('metaTitle', e.target.value)}
                placeholder="Interior Design Course in Jodhpur | Inframe School"
                maxLength={60}
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.metaTitle.length}/60 characters
              </p>
            </div>

            <div>
              <Label htmlFor="metaDescription">Meta Description (Optional)</Label>
              <Textarea
                id="metaDescription"
                value={formData.metaDescription}
                onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                placeholder="Transform spaces with our comprehensive interior design programs..."
                rows={3}
                maxLength={160}
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.metaDescription.length}/160 characters
              </p>
            </div>

            <div>
              <Label htmlFor="metaKeywords">Meta Keywords (Optional)</Label>
              <Input
                id="metaKeywords"
                value={formData.metaKeywords}
                onChange={(e) => handleInputChange('metaKeywords', e.target.value)}
                placeholder="interior design, course, jodhpur, design school"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => handleInputChange('isActive', checked as boolean)}
              />
              <Label htmlFor="isActive">Course is active and visible</Label>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href="/dashboard/courses">
              Cancel
            </Link>
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Course'}
          </Button>
        </div>
      </form>

      {/* Next Steps Info */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
          <CardDescription>After creating the course</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• After creation, you&apos;ll be redirected to the edit page</li>
            <li>• Add course programs (degrees, diplomas, etc.)</li>
            <li>• Add course features (why choose this course)</li>
            <li>• Test the live page to ensure everything looks correct</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
