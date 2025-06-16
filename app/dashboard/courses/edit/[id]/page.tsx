"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { uploadToCloudinary } from '@/utils/cloudinary'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { HeroImageUpload, ProgramImageUpload, FeatureImageUpload, StudentImageUpload } from '@/components/ui/image-upload'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import {
  getCourseById,
  updateCourse,
  addCourseProgram,
  updateCourseProgram,
  deleteCourseProgram,
  addCourseFeature,
  updateCourseFeature,
  deleteCourseFeature,
  addCourseTestimonial,
  updateCourseTestimonial,
  deleteCourseTestimonial,
  addCourseFAQ,
  updateCourseFAQ,
  deleteCourseFAQ,
  type Course
} from '../../apis'

export default function EditCoursePage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.id as string
  
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingPdf, setUploadingPdf] = useState(false)
  const pdfInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    description: '',
    heroImage: '',
    ctaTitle: '',
    ctaDescription: '',
    brochurePdfUrl: '',
    isActive: true,
    metaTitle: '',
    metaDescription: '',
    metaKeywords: ''
  })

  // Program form state
  const [programForm, setProgramForm] = useState({
    title: '',
    duration: '',
    description: '',
    imageUrl: '', // Required by backend
    detailsUrl: '', // Required by backend
    order: 1, // Required by backend
    isActive: true
  })
  const [editingProgramId, setEditingProgramId] = useState<string | null>(null)

  // Feature form state
  const [featureForm, setFeatureForm] = useState({
    title: '',
    description: '',
    imageUrl: '',
    order: 1
  })
  const [editingFeatureId, setEditingFeatureId] = useState<string | null>(null)

  // Testimonial form state
  const [testimonialForm, setTestimonialForm] = useState({
    studentName: '',
    studentImage: '',
    testimonialText: '',
    youtubeUrl: '',
    course: '',
    batch: '',
    order: 1,
    isActive: true
  })
  const [editingTestimonialId, setEditingTestimonialId] = useState<string | null>(null)

  // FAQ form state
  const [faqForm, setFaqForm] = useState({
    question: '',
    answer: '',
    order: 1,
    isActive: true
  })
  const [editingFaqId, setEditingFaqId] = useState<string | null>(null)

  useEffect(() => {
    if (courseId) {
      loadCourse()
    }
  }, [courseId])

  const loadCourse = async () => {
    try {
      setLoading(true)
      const courseData = await getCourseById(courseId)
      if (!courseData) {
        toast.error('Course not found')
        router.push('/dashboard/courses')
        return
      }
      
      setCourse(courseData)
      setFormData({
        slug: courseData.slug,
        title: courseData.title,
        description: courseData.description,
        heroImage: courseData.heroImage,
        ctaTitle: courseData.ctaTitle,
        ctaDescription: courseData.ctaDescription,
        brochurePdfUrl: courseData.brochurePdfUrl || '',
        isActive: courseData.isActive,
        metaTitle: courseData.metaTitle || '',
        metaDescription: courseData.metaDescription || '',
        metaKeywords: courseData.metaKeywords || ''
      })
    } catch (error) {
      console.error('Error loading course:', error)
      toast.error('Failed to load course')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Helper function to validate program data
  const validateProgramData = (programData: Record<string, unknown>) => {
    const errors: string[] = []

    if (!programData.title || typeof programData.title !== 'string' || !programData.title.trim()) {
      errors.push('Program title is required')
    }

    if (!programData.description || typeof programData.description !== 'string' || !programData.description.trim()) {
      errors.push('Program description is required')
    }

    if (!programData.imageUrl || typeof programData.imageUrl !== 'string' || !programData.imageUrl.trim()) {
      errors.push('Program image URL is required')
    }

    if (!programData.detailsUrl || typeof programData.detailsUrl !== 'string' || !programData.detailsUrl.trim()) {
      errors.push('Program details URL is required')
    }

    if (!programData.order || typeof programData.order !== 'number' || programData.order < 1) {
      errors.push('Program order must be a positive number')
    }

    return errors
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

    try {
      setSaving(true)

      const updateData = {
        slug: formData.slug.trim(),
        title: formData.title.trim(),
        description: formData.description.trim(),
        heroImage: formData.heroImage,
        ctaTitle: formData.ctaTitle.trim(),
        ctaDescription: formData.ctaDescription.trim(),
        brochurePdfUrl: formData.brochurePdfUrl,
        isActive: formData.isActive,
        metaTitle: formData.metaTitle,
        metaDescription: formData.metaDescription,
        metaKeywords: formData.metaKeywords
      }

      console.log('Course Update Data:', updateData)

      await updateCourse(courseId, updateData)
      toast.success('Course updated successfully!')
      await loadCourse()
    } catch (error: unknown) {
      console.error('Error updating course:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to update course')
    } finally {
      setSaving(false)
    }
  }

  // Program management functions
  const handleProgramSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const programData = {
      title: programForm.title.trim(),
      duration: programForm.duration.trim(),
      description: programForm.description.trim(),
      imageUrl: programForm.imageUrl.trim(),
      detailsUrl: programForm.detailsUrl.trim(),
      order: programForm.order || 1, // Ensure order is set
      isActive: programForm.isActive
    }

    // Validate program data
    const validationErrors = validateProgramData(programData)
    if (validationErrors.length > 0) {
      toast.error(validationErrors.join(', '))
      return
    }

    try {
      console.log('Program Form Data:', programData)

      if (editingProgramId) {
        await updateCourseProgram(courseId, editingProgramId, programData)
        toast.success('Program updated successfully!')
      } else {
        await addCourseProgram(courseId, programData)
        toast.success('Program added successfully!')
      }

      // Reset form
      setProgramForm({
        title: '',
        duration: '',
        description: '',
        imageUrl: '',
        detailsUrl: '',
        order: (course?.programs?.length || 0) + 1, // Ensure order is set
        isActive: true
      })
      setEditingProgramId(null)
      await loadCourse()
    } catch (error) {
      console.error('Error saving program:', error)
      toast.error('Failed to save program')
    }
  }

  const handleDeleteProgram = async (programId: string) => {
    if (!confirm('Are you sure you want to delete this program?')) return

    try {
      await deleteCourseProgram(courseId, programId)
      toast.success('Program deleted successfully!')
      await loadCourse()
    } catch (error) {
      console.error('Error deleting program:', error)
      toast.error('Failed to delete program')
    }
  }

  // Feature management functions
  const handleFeatureSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!featureForm.title.trim() || !featureForm.description.trim()) {
      toast.error('Feature title and description are required')
      return
    }

    try {
      const featureData = {
        title: featureForm.title.trim(),
        description: featureForm.description.trim(),
        imageUrl: featureForm.imageUrl,
        order: featureForm.order
      }

      console.log('Feature Form Data:', featureData)

      if (editingFeatureId) {
        await updateCourseFeature(courseId, editingFeatureId, featureData)
        toast.success('Feature updated successfully!')
      } else {
        await addCourseFeature(courseId, featureData)
        toast.success('Feature added successfully!')
      }

      // Reset form
      setFeatureForm({
        title: '',
        description: '',
        imageUrl: '',
        order: (course?.features?.length || 0) + 1
      })
      setEditingFeatureId(null)
      await loadCourse()
    } catch (error) {
      console.error('Error saving feature:', error)
      toast.error('Failed to save feature')
    }
  }

  const handleDeleteFeature = async (featureId: string) => {
    if (!confirm('Are you sure you want to delete this feature?')) return

    try {
      await deleteCourseFeature(courseId, featureId)
      toast.success('Feature deleted successfully!')
      await loadCourse()
    } catch (error) {
      console.error('Error deleting feature:', error)
      toast.error('Failed to delete feature')
    }
  }

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading course...</div>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h1>
          <Button asChild>
            <Link href="/dashboard/courses">Back to Courses</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Edit Course: {course.title}</h1>
          <p className="text-gray-600">/{course.slug}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/courses">
              Back to Courses
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard/courses/program-details">
              Manage Program Details
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <a href={`https://www.inframeschool.com/${course.slug}`} target="_blank" rel="noopener noreferrer">
              View Live
            </a>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="programs">Programs ({course.programs?.length || 0})</TabsTrigger>
          <TabsTrigger value="features">Features ({course.features?.length || 0})</TabsTrigger>
          <TabsTrigger value="testimonials">Testimonials ({course.testimonials?.length || 0})</TabsTrigger>
          <TabsTrigger value="faqs">FAQs ({course.faqs?.length || 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
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
                    URL: https://www.inframeschool.com/{formData.slug}
                  </p>
                </div>

                <div>
                  <Label htmlFor="description">Course Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Transform spaces and create beautiful environments..."
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
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="programs">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Add/Edit Program Form */}
            <Card>
              <CardHeader>
                <CardTitle>{editingProgramId ? 'Edit Program' : 'Add New Program'}</CardTitle>
                <CardDescription>Course programs like degrees, diplomas, etc. All fields marked with * are required by the backend.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProgramSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="programTitle">Program Title *</Label>
                    <Input
                      id="programTitle"
                      value={programForm.title}
                      onChange={(e) => setProgramForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Bachelor of Design in Interior Design"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="programDuration">Duration *</Label>
                    <Input
                      id="programDuration"
                      value={programForm.duration}
                      onChange={(e) => setProgramForm(prev => ({ ...prev, duration: e.target.value }))}
                      placeholder="4 Years Full-Time"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="programDescription">Description *</Label>
                    <Textarea
                      id="programDescription"
                      value={programForm.description}
                      onChange={(e) => setProgramForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Transform spaces and shape experiences..."
                      rows={3}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="programImage">Program Image *</Label>
                    <ProgramImageUpload
                      value={programForm.imageUrl}
                      onChange={(url) => setProgramForm(prev => ({ ...prev, imageUrl: url }))}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Program image is required by the backend
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="programDetailsUrl">Details URL *</Label>
                    <Input
                      id="programDetailsUrl"
                      value={programForm.detailsUrl}
                      onChange={(e) => setProgramForm(prev => ({ ...prev, detailsUrl: e.target.value }))}
                      placeholder="/interior-design/bdes-in-interior-design"
                      required
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      URL path for the detailed program page (e.g., /interior-design/bdes-in-interior-design)
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="programOrder">Display Order</Label>
                    <Input
                      id="programOrder"
                      type="number"
                      value={programForm.order}
                      onChange={(e) => setProgramForm(prev => ({ ...prev, order: parseInt(e.target.value) || 1 }))}
                      min="1"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="programActive"
                      checked={programForm.isActive}
                      onCheckedChange={(checked) => setProgramForm(prev => ({ ...prev, isActive: checked as boolean }))}
                    />
                    <Label htmlFor="programActive">Program is active</Label>
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1">
                      {editingProgramId ? 'Update Program' : 'Add Program'}
                    </Button>
                    {editingProgramId && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setEditingProgramId(null)
                          setProgramForm({
                            title: '',
                            duration: '',
                            description: '',
                            imageUrl: '',
                            detailsUrl: '',
                            order: (course?.programs?.length || 0) + 1, // Ensure order is properly set
                            isActive: true
                          })
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Programs List */}
            <Card>
              <CardHeader>
                <CardTitle>Current Programs ({course.programs?.length || 0})</CardTitle>
                <CardDescription>Manage existing course programs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {course.programs?.map((program) => (
                    <div key={program._id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h3 className="font-medium">{program.title}</h3>
                          <p className="text-sm text-gray-500">{program.duration}</p>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{program.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs text-gray-500">Order: {program.order}</span>
                            {program.isActive ? (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Active</span>
                            ) : (
                              <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">Inactive</span>
                            )}
                          </div>
                        </div>
                        {program.imageUrl && (
                          <img
                            src={program.imageUrl}
                            alt={program.title}
                            className="w-16 h-10 object-cover rounded ml-4"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/placeholder-image.svg';
                            }}
                          />
                        )}
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setProgramForm({
                              title: program.title,
                              duration: program.duration,
                              description: program.description,
                              imageUrl: program.imageUrl,
                              detailsUrl: program.detailsUrl,
                              order: program.order,
                              isActive: program.isActive
                            })
                            setEditingProgramId(program._id || null)
                          }}
                        >
                          Edit
                        </Button>
                        {program._id && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteProgram(program._id!)}
                          >
                            Delete
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  {(!course.programs || course.programs.length === 0) && (
                    <p className="text-center text-gray-500 py-8">
                      No programs added yet. Add your first program above.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="features">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Add/Edit Feature Form */}
            <Card>
              <CardHeader>
                <CardTitle>{editingFeatureId ? 'Edit Feature' : 'Add New Feature'}</CardTitle>
                <CardDescription>Why choose this course features</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleFeatureSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="featureTitle">Feature Title *</Label>
                    <Input
                      id="featureTitle"
                      value={featureForm.title}
                      onChange={(e) => setFeatureForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Industry-Relevant Curriculum"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="featureDescription">Description *</Label>
                    <Textarea
                      id="featureDescription"
                      value={featureForm.description}
                      onChange={(e) => setFeatureForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Our programs are designed in collaboration with industry experts..."
                      rows={4}
                      required
                    />
                  </div>

                  <FeatureImageUpload
                    value={featureForm.imageUrl}
                    onChange={(url) => setFeatureForm(prev => ({ ...prev, imageUrl: url }))}
                  />

                  <div>
                    <Label htmlFor="featureOrder">Display Order</Label>
                    <Input
                      id="featureOrder"
                      type="number"
                      value={featureForm.order}
                      onChange={(e) => setFeatureForm(prev => ({ ...prev, order: parseInt(e.target.value) || 1 }))}
                      min="1"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1">
                      {editingFeatureId ? 'Update Feature' : 'Add Feature'}
                    </Button>
                    {editingFeatureId && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setEditingFeatureId(null)
                          setFeatureForm({
                            title: '',
                            description: '',
                            imageUrl: '',
                            order: (course?.features?.length || 0) + 1
                          })
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Features List */}
            <Card>
              <CardHeader>
                <CardTitle>Current Features ({course.features?.length || 0})</CardTitle>
                <CardDescription>Manage existing course features</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {course.features?.map((feature) => (
                    <div key={feature._id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h3 className="font-medium">{feature.title}</h3>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-3">{feature.description}</p>
                          <span className="text-xs text-gray-500 mt-2 block">Order: {feature.order}</span>
                        </div>
                        {feature.imageUrl && (
                          <img
                            src={feature.imageUrl}
                            alt={feature.title}
                            className="w-16 h-10 object-cover rounded ml-4"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/placeholder-image.svg';
                            }}
                          />
                        )}
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setFeatureForm({
                              title: feature.title,
                              description: feature.description,
                              imageUrl: feature.imageUrl || '',
                              order: feature.order
                            })
                            setEditingFeatureId(feature._id || null)
                          }}
                        >
                          Edit
                        </Button>
                        {feature._id && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteFeature(feature._id!)}
                          >
                            Delete
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  {(!course.features || course.features.length === 0) && (
                    <p className="text-center text-gray-500 py-8">
                      No features added yet. Add your first feature above.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="testimonials">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Add/Edit Testimonial Form */}
            <Card>
              <CardHeader>
                <CardTitle>{editingTestimonialId ? 'Edit Testimonial' : 'Add New Testimonial'}</CardTitle>
                <CardDescription>Student testimonials with optional YouTube videos</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={async (e) => {
                  e.preventDefault()

                  if (!testimonialForm.studentName.trim() || !testimonialForm.testimonialText.trim()) {
                    toast.error('Student name and testimonial text are required')
                    return
                  }

                  try {
                    const testimonialData = {
                      studentName: testimonialForm.studentName.trim(),
                      studentImage: testimonialForm.studentImage,
                      testimonialText: testimonialForm.testimonialText.trim(),
                      youtubeUrl: testimonialForm.youtubeUrl,
                      course: testimonialForm.course,
                      batch: testimonialForm.batch,
                      order: testimonialForm.order,
                      isActive: testimonialForm.isActive
                    }

                    console.log('Testimonial Form Data:', testimonialData)

                    if (editingTestimonialId) {
                      await updateCourseTestimonial(courseId, editingTestimonialId, testimonialData)
                      toast.success('Testimonial updated successfully!')
                    } else {
                      await addCourseTestimonial(courseId, testimonialData)
                      toast.success('Testimonial added successfully!')
                    }

                    // Reset form
                    setTestimonialForm({
                      studentName: '',
                      studentImage: '',
                      testimonialText: '',
                      youtubeUrl: '',
                      course: '',
                      batch: '',
                      order: (course?.testimonials?.length || 0) + 1,
                      isActive: true
                    })
                    setEditingTestimonialId(null)
                    await loadCourse()
                  } catch (error) {
                    console.error('Error saving testimonial:', error)
                    toast.error('Failed to save testimonial')
                  }
                }} className="space-y-4">
                  <div>
                    <Label htmlFor="studentName">Student Name *</Label>
                    <Input
                      id="studentName"
                      value={testimonialForm.studentName}
                      onChange={(e) => setTestimonialForm(prev => ({ ...prev, studentName: e.target.value }))}
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <StudentImageUpload
                    value={testimonialForm.studentImage}
                    onChange={(url) => setTestimonialForm(prev => ({ ...prev, studentImage: url }))}
                  />

                  <div>
                    <Label htmlFor="testimonialText">Testimonial Text *</Label>
                    <Textarea
                      id="testimonialText"
                      value={testimonialForm.testimonialText}
                      onChange={(e) => setTestimonialForm(prev => ({ ...prev, testimonialText: e.target.value }))}
                      placeholder="This course changed my life..."
                      rows={4}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="youtubeUrl">YouTube Video URL (Optional)</Label>
                    <Input
                      id="youtubeUrl"
                      value={testimonialForm.youtubeUrl}
                      onChange={(e) => setTestimonialForm(prev => ({ ...prev, youtubeUrl: e.target.value }))}
                      placeholder="https://www.youtube.com/watch?v=..."
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Add a YouTube video testimonial link
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="course">Course/Program</Label>
                      <Input
                        id="course"
                        value={testimonialForm.course}
                        onChange={(e) => setTestimonialForm(prev => ({ ...prev, course: e.target.value }))}
                        placeholder="Interior Design"
                      />
                    </div>

                    <div>
                      <Label htmlFor="batch">Batch/Year</Label>
                      <Input
                        id="batch"
                        value={testimonialForm.batch}
                        onChange={(e) => setTestimonialForm(prev => ({ ...prev, batch: e.target.value }))}
                        placeholder="2023-2024"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="testimonialOrder">Display Order</Label>
                    <Input
                      id="testimonialOrder"
                      type="number"
                      value={testimonialForm.order}
                      onChange={(e) => setTestimonialForm(prev => ({ ...prev, order: parseInt(e.target.value) || 1 }))}
                      min="1"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="testimonialActive"
                      checked={testimonialForm.isActive}
                      onCheckedChange={(checked) => setTestimonialForm(prev => ({ ...prev, isActive: checked as boolean }))}
                    />
                    <Label htmlFor="testimonialActive">Testimonial is active</Label>
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1">
                      {editingTestimonialId ? 'Update Testimonial' : 'Add Testimonial'}
                    </Button>
                    {editingTestimonialId && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setEditingTestimonialId(null)
                          setTestimonialForm({
                            studentName: '',
                            studentImage: '',
                            testimonialText: '',
                            youtubeUrl: '',
                            course: '',
                            batch: '',
                            order: (course?.testimonials?.length || 0) + 1,
                            isActive: true
                          })
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Testimonials List */}
            <Card>
              <CardHeader>
                <CardTitle>Current Testimonials ({course.testimonials?.length || 0})</CardTitle>
                <CardDescription>Manage existing testimonials</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {course.testimonials?.map((testimonial) => (
                    <div key={testimonial._id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium">{testimonial.studentName}</h3>
                            {testimonial.youtubeUrl && (
                              <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">📹 Video</span>
                            )}
                            {testimonial.isActive ? (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Active</span>
                            ) : (
                              <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">Inactive</span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-3">{testimonial.testimonialText}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            {testimonial.course && <span>Course: {testimonial.course}</span>}
                            {testimonial.batch && <span>Batch: {testimonial.batch}</span>}
                            <span>Order: {testimonial.order}</span>
                          </div>
                        </div>
                        {testimonial.studentImage && (
                          <img
                            src={testimonial.studentImage}
                            alt={testimonial.studentName}
                            className="w-12 h-12 object-cover rounded-full ml-4"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/placeholder-image.svg';
                            }}
                          />
                        )}
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setTestimonialForm({
                              studentName: testimonial.studentName,
                              studentImage: testimonial.studentImage || '',
                              testimonialText: testimonial.testimonialText,
                              youtubeUrl: testimonial.youtubeUrl || '',
                              course: testimonial.course || '',
                              batch: testimonial.batch || '',
                              order: testimonial.order,
                              isActive: testimonial.isActive
                            })
                            setEditingTestimonialId(testimonial._id || null)
                          }}
                        >
                          Edit
                        </Button>
                        {testimonial.youtubeUrl && (
                          <Button
                            size="sm"
                            variant="outline"
                            asChild
                          >
                            <a href={testimonial.youtubeUrl} target="_blank" rel="noopener noreferrer">
                              View Video
                            </a>
                          </Button>
                        )}
                        {testimonial._id && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={async () => {
                              if (!confirm('Are you sure you want to delete this testimonial?')) return
                              try {
                                await deleteCourseTestimonial(courseId, testimonial._id!)
                                toast.success('Testimonial deleted successfully!')
                                await loadCourse()
                              } catch (error) {
                                console.error('Error deleting testimonial:', error)
                                toast.error('Failed to delete testimonial')
                              }
                            }}
                          >
                            Delete
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  {(!course.testimonials || course.testimonials.length === 0) && (
                    <p className="text-center text-gray-500 py-8">
                      No testimonials added yet. Add your first testimonial above.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="faqs">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Add/Edit FAQ Form */}
            <Card>
              <CardHeader>
                <CardTitle>{editingFaqId ? 'Edit FAQ' : 'Add New FAQ'}</CardTitle>
                <CardDescription>Frequently asked questions about the course</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={async (e) => {
                  e.preventDefault()

                  if (!faqForm.question.trim() || !faqForm.answer.trim()) {
                    toast.error('Question and answer are required')
                    return
                  }

                  try {
                    const faqData = {
                      question: faqForm.question.trim(),
                      answer: faqForm.answer.trim(),
                      order: faqForm.order,
                      isActive: faqForm.isActive
                    }

                    console.log('FAQ Form Data:', faqData)

                    if (editingFaqId) {
                      await updateCourseFAQ(courseId, editingFaqId, faqData)
                      toast.success('FAQ updated successfully!')
                    } else {
                      await addCourseFAQ(courseId, faqData)
                      toast.success('FAQ added successfully!')
                    }

                    // Reset form
                    setFaqForm({
                      question: '',
                      answer: '',
                      order: (course?.faqs?.length || 0) + 1,
                      isActive: true
                    })
                    setEditingFaqId(null)
                    await loadCourse()
                  } catch (error) {
                    console.error('Error saving FAQ:', error)
                    toast.error('Failed to save FAQ')
                  }
                }} className="space-y-4">
                  <div>
                    <Label htmlFor="faqQuestion">Question *</Label>
                    <Input
                      id="faqQuestion"
                      value={faqForm.question}
                      onChange={(e) => setFaqForm(prev => ({ ...prev, question: e.target.value }))}
                      placeholder="What are the admission requirements?"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="faqAnswer">Answer *</Label>
                    <Textarea
                      id="faqAnswer"
                      value={faqForm.answer}
                      onChange={(e) => setFaqForm(prev => ({ ...prev, answer: e.target.value }))}
                      placeholder="The admission requirements include..."
                      rows={4}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="faqOrder">Display Order</Label>
                    <Input
                      id="faqOrder"
                      type="number"
                      value={faqForm.order}
                      onChange={(e) => setFaqForm(prev => ({ ...prev, order: parseInt(e.target.value) || 1 }))}
                      min="1"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="faqActive"
                      checked={faqForm.isActive}
                      onCheckedChange={(checked) => setFaqForm(prev => ({ ...prev, isActive: checked as boolean }))}
                    />
                    <Label htmlFor="faqActive">FAQ is active</Label>
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1">
                      {editingFaqId ? 'Update FAQ' : 'Add FAQ'}
                    </Button>
                    {editingFaqId && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setEditingFaqId(null)
                          setFaqForm({
                            question: '',
                            answer: '',
                            order: (course?.faqs?.length || 0) + 1,
                            isActive: true
                          })
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* FAQs List */}
            <Card>
              <CardHeader>
                <CardTitle>Current FAQs ({course.faqs?.length || 0})</CardTitle>
                <CardDescription>Manage existing FAQs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {course.faqs?.map((faq) => (
                    <div key={faq._id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-sm">{faq.question}</h3>
                            {faq.isActive ? (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Active</span>
                            ) : (
                              <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">Inactive</span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-3">{faq.answer}</p>
                          <span className="text-xs text-gray-500 mt-2 block">Order: {faq.order}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setFaqForm({
                              question: faq.question,
                              answer: faq.answer,
                              order: faq.order,
                              isActive: faq.isActive
                            })
                            setEditingFaqId(faq._id || null)
                          }}
                        >
                          Edit
                        </Button>
                        {faq._id && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={async () => {
                              if (!confirm('Are you sure you want to delete this FAQ?')) return
                              try {
                                await deleteCourseFAQ(courseId, faq._id!)
                                toast.success('FAQ deleted successfully!')
                                await loadCourse()
                              } catch (error) {
                                console.error('Error deleting FAQ:', error)
                                toast.error('Failed to delete FAQ')
                              }
                            }}
                          >
                            Delete
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  {(!course.faqs || course.faqs.length === 0) && (
                    <p className="text-center text-gray-500 py-8">
                      No FAQs added yet. Add your first FAQ above.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
