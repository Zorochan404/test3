"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { HeroImageUpload, ImageUpload } from '@/components/ui/image-upload'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  createCourseProgram,
  generateSlug,
  getParentCourses,
  getCourseIdBySlug,
  type CourseProgram,
  type AdmissionStep,
  type CurriculumYear,
  type CurriculumSemester,
  type SoftwareTool,
  type CareerPath
} from '../apis'

export default function AddCourseProgramDetailsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [availableCourses, setAvailableCourses] = useState<{ _id?: string; slug: string; title: string }[]>([])
  const [loadingCourses, setLoadingCourses] = useState(true)

  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    parentCourseSlug: '',
    parentCourseTitle: '',
    heroImage: '',
    duration: '',
    description: '',
    shortDescription: '',
    courseOverview: '',
    admissionQuote: '',
    imageUrl: '', // Required by backend
    detailsUrl: '', // Required by backend
    order: 1, // Required by backend
    ctaTitle: 'Apply Now',
    ctaDescription: 'Start your journey with us',
    ctaButtonText: 'Apply Now',
    isActive: true,
    metaTitle: '',
    metaDescription: '',
    metaKeywords: ''
  })

  // Admission Steps
  const [admissionSteps, setAdmissionSteps] = useState<AdmissionStep[]>([
    { stepNumber: 1, icon: '📁', title: 'Upload your portfolio online', description: '', order: 1 },
    { stepNumber: 2, icon: '📝', title: 'Candidate has to attend the DAT conducted by Inframe on the specified dates', description: '', order: 2 },
    { stepNumber: 3, icon: '🎯', title: 'Shortlisted candidates from DAT have to attend an online interview for further interviewing', description: '', order: 3 },
    { stepNumber: 4, icon: '💰', title: 'Payment of the admission fees before the prescribed due date', description: '', order: 4 }
  ])

  // Career Paths
  const [careerPaths, setCareerPaths] = useState<CareerPath[]>([
    { title: 'Interior Designer', roles: ['Residential', 'Commercial', 'Hospitality'], description: '', order: 1 },
    { title: 'Design Consultant', roles: ['Freelance Designer', 'Design Firm Partner', 'Project Manager'], description: '', order: 2 },
    { title: 'Specialized Roles', roles: ['3D Visualization Expert', 'Sustainable Design Specialist', 'Lighting Designer'], description: '', order: 3 }
  ])

  // Curriculum
  const [curriculum, setCurriculum] = useState<CurriculumYear[]>([
    {
      year: '1st Year',
      semesters: [
        { semester: 'Semester 1', subjects: ['Contextual Art and Design', 'Material Studies', 'Creative Skills'], order: 1 },
        { semester: 'Semester 2', subjects: ['Object as History', 'Visual Expression', 'Design Concepts'], order: 2 }
      ],
      imageUrl: 'https://images.unsplash.com/photo-1617103996702-96ff29b1c467?w=800&q=80',
      description: 'Foundation year focusing on basic design principles and creative skills',
      order: 1
    }
  ])

  // Software Tools
  const [softwareTools, setSoftwareTools] = useState<SoftwareTool[]>([
    { name: 'AutoCAD', logoUrl: '/software logos/pngegg (17).png', description: 'Computer-aided design software', order: 1 },
    { name: 'SketchUp', logoUrl: '/software logos/pngegg (18).png', description: '3D modeling software', order: 2 },
    { name: '3dsMax', logoUrl: '/software logos/pngegg (19).png', description: '3D computer graphics program', order: 3 },
    { name: 'Revit', logoUrl: '/software logos/pngegg (21).png', description: 'Building information modeling software', order: 4 },
    { name: 'Photoshop', logoUrl: '/software logos/pngegg (24).png', description: 'Image editing software', order: 5 }
  ])

  useEffect(() => {
    loadParentCourses()
  }, [])

  const loadParentCourses = async () => {
    try {
      setLoadingCourses(true)
      const courses = await getParentCourses()
      setAvailableCourses(courses)
    } catch (error) {
      console.error('Error loading parent courses:', error)
      toast.error('Failed to load parent courses')
    } finally {
      setLoadingCourses(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))

    // Auto-generate slug when title changes
    if (field === 'title' && typeof value === 'string') {
      const autoSlug = generateSlug(value)
      setFormData(prev => ({ ...prev, slug: autoSlug }))
    }
  }

  const handleParentCourseChange = (courseSlug: string) => {
    const course = availableCourses.find(c => c.slug === courseSlug)
    if (course) {
      setFormData(prev => ({
        ...prev,
        parentCourseSlug: courseSlug,
        parentCourseTitle: course.title
      }))
    }
  }

  // Helper functions for managing arrays
  const addAdmissionStep = () => {
    const newStep: AdmissionStep = {
      stepNumber: admissionSteps.length + 1,
      icon: '',
      title: '',
      description: '',
      order: admissionSteps.length + 1
    }
    setAdmissionSteps([...admissionSteps, newStep])
  }

  const updateAdmissionStep = (index: number, field: keyof AdmissionStep, value: string | number) => {
    const updated = [...admissionSteps]
    updated[index] = { ...updated[index], [field]: value }
    setAdmissionSteps(updated)
  }

  const removeAdmissionStep = (index: number) => {
    setAdmissionSteps(admissionSteps.filter((_, i) => i !== index))
  }

  const addCareerPath = () => {
    const newPath: CareerPath = {
      title: '',
      roles: [''],
      description: '',
      order: careerPaths.length + 1
    }
    setCareerPaths([...careerPaths, newPath])
  }

  const updateCareerPath = (index: number, field: keyof CareerPath, value: string | string[] | number) => {
    const updated = [...careerPaths]
    updated[index] = { ...updated[index], [field]: value }
    setCareerPaths(updated)
  }

  const removeCareerPath = (index: number) => {
    setCareerPaths(careerPaths.filter((_, i) => i !== index))
  }

  const addCurriculumYear = () => {
    const newYear: CurriculumYear = {
      year: '',
      semesters: [{ semester: 'Semester 1', subjects: [''], order: 1 }],
      imageUrl: '',
      description: '',
      order: curriculum.length + 1
    }
    setCurriculum([...curriculum, newYear])
  }

  const updateCurriculumYear = (index: number, field: keyof CurriculumYear, value: string | number | CurriculumSemester[]) => {
    const updated = [...curriculum]
    updated[index] = { ...updated[index], [field]: value }
    setCurriculum(updated)
  }

  const removeCurriculumYear = (index: number) => {
    setCurriculum(curriculum.filter((_, i) => i !== index))
  }

  const addSoftwareTool = () => {
    const newTool: SoftwareTool = {
      name: '',
      logoUrl: '',
      description: '',
      order: softwareTools.length + 1
    }
    setSoftwareTools([...softwareTools, newTool])
  }

  const updateSoftwareTool = (index: number, field: keyof SoftwareTool, value: string | number) => {
    const updated = [...softwareTools]
    updated[index] = { ...updated[index], [field]: value }
    setSoftwareTools(updated)
  }

  const removeSoftwareTool = (index: number) => {
    setSoftwareTools(softwareTools.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      toast.error('Program title is required')
      return
    }

    if (!formData.parentCourseSlug) {
      toast.error('Parent course is required')
      return
    }

    if (!formData.imageUrl.trim()) {
      toast.error('Program image URL is required')
      return
    }

    if (!formData.detailsUrl.trim()) {
      toast.error('Program details URL is required')
      return
    }

    if (!formData.order || formData.order < 1) {
      toast.error('Program order must be a positive number')
      return
    }

    try {
      setLoading(true)

      const programData: Omit<CourseProgram, '_id' | 'createdAt' | 'updatedAt'> = {
        slug: formData.slug.trim(),
        title: formData.title.trim(),
        parentCourseSlug: formData.parentCourseSlug,
        parentCourseTitle: formData.parentCourseTitle,
        heroImage: formData.heroImage,
        duration: formData.duration.trim(),
        description: formData.description.trim(),
        shortDescription: formData.shortDescription.trim(),
        courseOverview: formData.courseOverview.trim(),
        imageUrl: formData.imageUrl.trim(), // Required by backend
        detailsUrl: formData.detailsUrl.trim(), // Required by backend
        order: formData.order, // Required by backend
        admissionSteps: admissionSteps,
        admissionQuote: formData.admissionQuote,
        galleryImages: [],
        programHighlights: [],
        careerPaths: careerPaths,
        curriculum: curriculum,
        softwareTools: softwareTools,
        industryPartners: [],
        testimonials: [],
        faqs: [],
        feeBenefits: [],
        eligibility: [],
        scheduleOptions: [],
        ctaTitle: formData.ctaTitle.trim(),
        ctaDescription: formData.ctaDescription.trim(),
        ctaButtonText: formData.ctaButtonText.trim(),
        isActive: formData.isActive,
        metaTitle: formData.metaTitle,
        metaDescription: formData.metaDescription,
        metaKeywords: formData.metaKeywords
      }

      console.log('Program Details Form Data:', programData)

      // Get the parent course ID from the backend
      const courseId = await getCourseIdBySlug(formData.parentCourseSlug)
      if (!courseId) {
        throw new Error('Parent course not found')
      }

      await createCourseProgram(courseId, programData)
      toast.success('Course program details created successfully!')
      router.push('/dashboard/courses/program-details')
    } catch (error: unknown) {
      console.error('Error creating program details:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to create program details')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Add Course Program Details</h1>
          <p className="text-gray-600">Create detailed program pages like /interior-design/bdes-in-interior-design</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/dashboard/courses/program-details">
            Back to Program Details
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="admission">Admission ({admissionSteps.length})</TabsTrigger>
          <TabsTrigger value="curriculum">Curriculum ({curriculum.length})</TabsTrigger>
          <TabsTrigger value="software">Software ({softwareTools.length})</TabsTrigger>
          <TabsTrigger value="careers">Careers ({careerPaths.length})</TabsTrigger>
        </TabsList>

        <form onSubmit={handleSubmit}>
          <TabsContent value="basic" className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Program title, parent course, and basic details. Fields marked with * are required by the backend.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="parentCourse">Parent Course *</Label>
                  {loadingCourses ? (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                      Loading courses...
                    </div>
                  ) : (
                    <Select value={formData.parentCourseSlug} onValueChange={handleParentCourseChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select parent course" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableCourses.map((course) => (
                          <SelectItem key={course.slug} value={course.slug}>
                            {course.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  <p className="text-sm text-gray-500 mt-1">
                    The main course this program belongs to
                  </p>
                </div>

            <div>
              <Label htmlFor="title">Program Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Bachelor of Design in Interior Design"
                required
              />
            </div>

            <div>
              <Label htmlFor="slug">URL Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => handleInputChange('slug', e.target.value)}
                placeholder="bdes-in-interior-design"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                URL: https://www.inframeschool.com/{formData.parentCourseSlug}/{formData.slug}
              </p>
            </div>

            <div>
              <Label htmlFor="duration">Duration *</Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                placeholder="4 Years Full-Time"
                required
              />
            </div>

            <div>
              <Label htmlFor="shortDescription">Short Description</Label>
              <Input
                id="shortDescription"
                value={formData.shortDescription}
                onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                placeholder="Comprehensive 4-year program in interior design"
              />
              <p className="text-sm text-gray-500 mt-1">
                Brief description for cards and previews
              </p>
            </div>

            <div>
              <Label htmlFor="description">Hero Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Transform spaces and shape experiences through our comprehensive design program..."
                rows={3}
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Main description shown in the hero section
              </p>
            </div>

            <HeroImageUpload
              value={formData.heroImage}
              onChange={(url) => handleInputChange('heroImage', url)}
            />

            <ImageUpload
              label="Program Image *"
              value={formData.imageUrl}
              onChange={(url) => handleInputChange('imageUrl', url)}
              placeholder="https://example.com/program-image.jpg or upload below"
              imageClassName="w-32 h-20 object-cover rounded border"
              description="Program image is required by the backend"
            />

            <div>
              <Label htmlFor="detailsUrl">Program Details URL *</Label>
              <Input
                id="detailsUrl"
                value={formData.detailsUrl}
                onChange={(e) => handleInputChange('detailsUrl', e.target.value)}
                placeholder="/interior-design/bdes-in-interior-design"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                URL path for the detailed program page (e.g., /interior-design/bdes-in-interior-design)
              </p>
            </div>

            <div>
              <Label htmlFor="order">Display Order *</Label>
              <Input
                id="order"
                type="number"
                value={formData.order}
                onChange={(e) => handleInputChange('order', parseInt(e.target.value) || 1)}
                placeholder="1"
                min="1"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Order in which this program appears in the list
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Course Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Course Overview</CardTitle>
            <CardDescription>Detailed course overview section</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="courseOverview">Course Overview *</Label>
              <Textarea
                id="courseOverview"
                value={formData.courseOverview}
                onChange={(e) => handleInputChange('courseOverview', e.target.value)}
                placeholder="The Bachelor of Design (B.Des) in Interior Design is a four-year full-time program designed to provide students with an in-depth understanding of interior spaces, aesthetics, and functionality..."
                rows={6}
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Detailed description of the course content and objectives
              </p>
            </div>

           
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
                placeholder="Step into the World of Interior Design"
              />
            </div>

            <div>
              <Label htmlFor="ctaDescription">CTA Description</Label>
              <Textarea
                id="ctaDescription"
                value={formData.ctaDescription}
                onChange={(e) => handleInputChange('ctaDescription', e.target.value)}
                placeholder="Apply now and start your journey towards a successful career..."
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="ctaButtonText">CTA Button Text</Label>
              <Input
                id="ctaButtonText"
                value={formData.ctaButtonText}
                onChange={(e) => handleInputChange('ctaButtonText', e.target.value)}
                placeholder="Apply Now"
              />
            </div>
          </CardContent>
        </Card>

        {/* SEO & Settings */}
        <Card>
          <CardHeader>
            <CardTitle>SEO & Settings</CardTitle>
            <CardDescription>Search engine optimization and program settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="metaTitle">Meta Title (Optional)</Label>
              <Input
                id="metaTitle"
                value={formData.metaTitle}
                onChange={(e) => handleInputChange('metaTitle', e.target.value)}
                placeholder="Bachelor of Design in Interior Design | Inframe School"
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
                placeholder="Transform spaces with our comprehensive 4-year Bachelor of Design program in Interior Design..."
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
                placeholder="interior design, bachelor degree, design course, jodhpur"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => handleInputChange('isActive', checked as boolean)}
              />
              <Label htmlFor="isActive">Program is active and visible</Label>
            </div>
          </CardContent>
        </Card>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" asChild>
                <Link href="/dashboard/courses/program-details">
                  Cancel
                </Link>
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Program Details'}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="admission" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Admission Process</CardTitle>
                <CardDescription>Step-by-step admission process</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {admissionSteps.map((step, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium">Step {step.stepNumber}</h4>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeAdmissionStep(index)}
                      >
                        Remove
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <Label>Step Number</Label>
                        <Input
                          type="number"
                          value={step.stepNumber}
                          onChange={(e) => updateAdmissionStep(index, 'stepNumber', parseInt(e.target.value) || 1)}
                          placeholder="1"
                          min="1"
                        />
                      </div>
                      <div>
                        <Label>Icon/Emoji</Label>
                        <Input
                          value={step.icon}
                          onChange={(e) => updateAdmissionStep(index, 'icon', e.target.value)}
                          placeholder="📁"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label>Step Title</Label>
                        <Input
                          value={step.title}
                          onChange={(e) => updateAdmissionStep(index, 'title', e.target.value)}
                          placeholder="Upload your portfolio online"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <Label>Display Order</Label>
                        <Input
                          type="number"
                          value={step.order}
                          onChange={(e) => updateAdmissionStep(index, 'order', parseInt(e.target.value) || 1)}
                          placeholder="1"
                          min="1"
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <Label>Description (Optional)</Label>
                      <Textarea
                        value={step.description}
                        onChange={(e) => updateAdmissionStep(index, 'description', e.target.value)}
                        placeholder="Additional details about this step..."
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addAdmissionStep}>
                  Add Admission Step
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="curriculum" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Curriculum</CardTitle>
                <CardDescription>Year-wise curriculum structure</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {curriculum.map((year, yearIndex) => (
                  <div key={yearIndex} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium">{year.year || `Year ${yearIndex + 1}`}</h4>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeCurriculumYear(yearIndex)}
                      >
                        Remove Year
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <Label>Year Name</Label>
                        <Input
                          value={year.year}
                          onChange={(e) => updateCurriculumYear(yearIndex, 'year', e.target.value)}
                          placeholder="1st Year"
                        />
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Input
                          value={year.description || ''}
                          onChange={(e) => updateCurriculumYear(yearIndex, 'description', e.target.value)}
                          placeholder="Foundation year focusing on..."
                        />
                      </div>
                      <div>
                        <Label>Display Order</Label>
                        <Input
                          type="number"
                          value={year.order}
                          onChange={(e) => updateCurriculumYear(yearIndex, 'order', parseInt(e.target.value) || 1)}
                          placeholder="1"
                          min="1"
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <ImageUpload
                        label="Year Image"
                        value={year.imageUrl || ''}
                        onChange={(url) => updateCurriculumYear(yearIndex, 'imageUrl', url)}
                        imageClassName="w-32 h-20 object-cover rounded border"
                      />
                    </div>
                    <div>
                      <Label>Semesters</Label>
                      {year.semesters.map((semester, semIndex) => (
                        <div key={semIndex} className="border rounded p-3 mt-2">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                            <Input
                              value={semester.semester}
                              onChange={(e) => {
                                const updated = [...curriculum]
                                updated[yearIndex].semesters[semIndex].semester = e.target.value
                                setCurriculum(updated)
                              }}
                              placeholder="Semester 1"
                            />
                            <Input
                              type="number"
                              value={semester.order}
                              onChange={(e) => {
                                const updated = [...curriculum]
                                updated[yearIndex].semesters[semIndex].order = parseInt(e.target.value) || 1
                                setCurriculum(updated)
                              }}
                              placeholder="Order"
                              min="1"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const updated = [...curriculum]
                                updated[yearIndex].semesters = updated[yearIndex].semesters.filter((_, i) => i !== semIndex)
                                setCurriculum(updated)
                              }}
                            >
                              Remove Semester
                            </Button>
                          </div>
                          <Label>Subjects</Label>
                          {semester.subjects.map((subject, subIndex) => (
                            <div key={subIndex} className="flex gap-2 mt-2">
                              <Input
                                value={subject}
                                onChange={(e) => {
                                  const updated = [...curriculum]
                                  updated[yearIndex].semesters[semIndex].subjects[subIndex] = e.target.value
                                  setCurriculum(updated)
                                }}
                                placeholder="Subject name"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const updated = [...curriculum]
                                  updated[yearIndex].semesters[semIndex].subjects = updated[yearIndex].semesters[semIndex].subjects.filter((_, i) => i !== subIndex)
                                  setCurriculum(updated)
                                }}
                              >
                                Remove
                              </Button>
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() => {
                              const updated = [...curriculum]
                              updated[yearIndex].semesters[semIndex].subjects.push('')
                              setCurriculum(updated)
                            }}
                          >
                            Add Subject
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => {
                          const updated = [...curriculum]
                          updated[yearIndex].semesters.push({
                            semester: `Semester ${updated[yearIndex].semesters.length + 1}`,
                            subjects: [''],
                            order: updated[yearIndex].semesters.length + 1
                          })
                          setCurriculum(updated)
                        }}
                      >
                        Add Semester
                      </Button>
                    </div>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addCurriculumYear}>
                  Add Year
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="software" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Software You Will Learn</CardTitle>
                <CardDescription>Software tools and technologies taught in the program</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {softwareTools.map((tool, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium">{tool.name || `Software ${index + 1}`}</h4>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeSoftwareTool(index)}
                      >
                        Remove
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label>Software Name</Label>
                        <Input
                          value={tool.name}
                          onChange={(e) => updateSoftwareTool(index, 'name', e.target.value)}
                          placeholder="AutoCAD"
                        />
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Input
                          value={tool.description || ''}
                          onChange={(e) => updateSoftwareTool(index, 'description', e.target.value)}
                          placeholder="Computer-aided design software"
                        />
                      </div>
                      <div>
                        <Label>Display Order</Label>
                        <Input
                          type="number"
                          value={tool.order}
                          onChange={(e) => updateSoftwareTool(index, 'order', parseInt(e.target.value) || 1)}
                          placeholder="1"
                          min="1"
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <ImageUpload
                        label="Software Logo"
                        value={tool.logoUrl}
                        onChange={(url) => updateSoftwareTool(index, 'logoUrl', url)}
                        imageClassName="w-16 h-16 object-contain rounded border"
                      />
                    </div>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addSoftwareTool}>
                  Add Software Tool
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="careers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Career Prospects</CardTitle>
                <CardDescription>Career paths and job opportunities after graduation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {careerPaths.map((career, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium">{career.title || `Career Path ${index + 1}`}</h4>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeCareerPath(index)}
                      >
                        Remove
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <Label>Career Title</Label>
                        <Input
                          value={career.title}
                          onChange={(e) => updateCareerPath(index, 'title', e.target.value)}
                          placeholder="Interior Designer"
                        />
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Input
                          value={career.description || ''}
                          onChange={(e) => updateCareerPath(index, 'description', e.target.value)}
                          placeholder="Career description..."
                        />
                      </div>
                      <div>
                        <Label>Display Order</Label>
                        <Input
                          type="number"
                          value={career.order}
                          onChange={(e) => updateCareerPath(index, 'order', parseInt(e.target.value) || 1)}
                          placeholder="1"
                          min="1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Job Roles</Label>
                      {career.roles.map((role, roleIndex) => (
                        <div key={roleIndex} className="flex gap-2 mt-2">
                          <Input
                            value={role}
                            onChange={(e) => {
                              const updated = [...careerPaths]
                              updated[index].roles[roleIndex] = e.target.value
                              setCareerPaths(updated)
                            }}
                            placeholder="Residential"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const updated = [...careerPaths]
                              updated[index].roles = updated[index].roles.filter((_, i) => i !== roleIndex)
                              setCareerPaths(updated)
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => {
                          const updated = [...careerPaths]
                          updated[index].roles.push('')
                          setCareerPaths(updated)
                        }}
                      >
                        Add Role
                      </Button>
                    </div>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addCareerPath}>
                  Add Career Path
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </form>
      </Tabs>
    </div>
  )
}
