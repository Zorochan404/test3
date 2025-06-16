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
import { useParams, useRouter } from 'next/navigation'
import {
  getCourseProgramById,
  updateCourseProgram,
  getCourseIdBySlug,
  type CourseProgram,
  type AdmissionStep,
  type CurriculumYear,
  type SoftwareTool,
  type CareerPath,
  type IndustryPartner,
  type ProgramHighlight,
  type CourseGalleryImage
} from '../../apis'

// Mock course data - replace with actual API call
const availableCourses = [
  { slug: 'interior-design', title: 'Interior Design' },
  { slug: 'fashion-design', title: 'Fashion Design' },
  { slug: 'graphic-design', title: 'Graphic Design' },
  { slug: 'uiux-design', title: 'UI/UX Design' }
]

export default function EditCourseProgramDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const programId = params.id as string
  
  const [program, setProgram] = useState<CourseProgram | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

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
    ctaTitle: '',
    ctaDescription: '',
    ctaButtonText: '',
    isActive: true,
    metaTitle: '',
    metaDescription: '',
    metaKeywords: ''
  })

  // Form states for different sections
  const [admissionStepForm, setAdmissionStepForm] = useState({
    stepNumber: 1,
    icon: '',
    title: '',
    description: '',
    order: 1
  })
  const [editingAdmissionStepId, setEditingAdmissionStepId] = useState<string | null>(null)

  const [curriculumForm, setCurriculumForm] = useState({
    year: '',
    description: '',
    imageUrl: '',
    order: 1,
    semesters: [{ semester: '', subjects: [''], order: 1 }]
  })
  const [editingCurriculumId, setEditingCurriculumId] = useState<string | null>(null)

  const [softwareForm, setSoftwareForm] = useState({
    name: '',
    logoUrl: '',
    description: '',
    order: 1
  })
  const [editingSoftwareId, setEditingSoftwareId] = useState<string | null>(null)

  const [careerForm, setCareerForm] = useState({
    title: '',
    roles: [''],
    description: '',
    order: 1
  })
  const [editingCareerId, setEditingCareerId] = useState<string | null>(null)

  const [partnerForm, setPartnerForm] = useState({
    name: '',
    logoUrl: '',
    description: '',
    order: 1
  })
  const [editingPartnerId, setEditingPartnerId] = useState<string | null>(null)

  const [highlightForm, setHighlightForm] = useState({
    icon: '',
    title: '',
    description: '',
    order: 1
  })
  const [editingHighlightId, setEditingHighlightId] = useState<string | null>(null)

  const [galleryForm, setGalleryForm] = useState({
    imageUrl: '',
    caption: '',
    order: 1
  })
  const [editingGalleryId, setEditingGalleryId] = useState<string | null>(null)

  useEffect(() => {
    if (programId) {
      loadProgram()
    }
  }, [programId])

  const loadProgram = async () => {
    try {
      setLoading(true)
      const programData = await getCourseProgramById(programId)
      if (!programData) {
        toast.error('Program details not found')
        router.push('/dashboard/courses/program-details')
        return
      }
      
      setProgram(programData)
      setFormData({
        slug: programData.slug,
        title: programData.title,
        parentCourseSlug: programData.parentCourseSlug,
        parentCourseTitle: programData.parentCourseTitle,
        heroImage: programData.heroImage,
        duration: programData.duration,
        description: programData.description,
        shortDescription: programData.shortDescription || '',
        courseOverview: programData.courseOverview,
        admissionQuote: programData.admissionQuote || '',
        ctaTitle: programData.ctaTitle,
        ctaDescription: programData.ctaDescription,
        ctaButtonText: programData.ctaButtonText,
        isActive: programData.isActive,
        metaTitle: programData.metaTitle || '',
        metaDescription: programData.metaDescription || '',
        metaKeywords: programData.metaKeywords || ''
      })
    } catch (error) {
      console.error('Error loading program:', error)
      toast.error('Failed to load program details')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      toast.error('Program title is required')
      return
    }

    try {
      setSaving(true)

      const updateData = {
        slug: formData.slug.trim(),
        title: formData.title.trim(),
        parentCourseSlug: formData.parentCourseSlug,
        parentCourseTitle: formData.parentCourseTitle,
        heroImage: formData.heroImage,
        duration: formData.duration.trim(),
        description: formData.description.trim(),
        shortDescription: formData.shortDescription.trim(),
        courseOverview: formData.courseOverview.trim(),
        admissionQuote: formData.admissionQuote,
        ctaTitle: formData.ctaTitle.trim(),
        ctaDescription: formData.ctaDescription.trim(),
        ctaButtonText: formData.ctaButtonText.trim(),
        isActive: formData.isActive,
        metaTitle: formData.metaTitle,
        metaDescription: formData.metaDescription,
        metaKeywords: formData.metaKeywords
      }

      console.log('Program Details Update Data:', updateData)

      // Get the parent course ID from the backend
      const courseId = await getCourseIdBySlug(formData.parentCourseSlug)
      if (!courseId) {
        throw new Error('Parent course not found')
      }

      await updateCourseProgram(courseId, programId, updateData)
      toast.success('Program details updated successfully!')
      await loadProgram()
    } catch (error: unknown) {
      console.error('Error updating program details:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to update program details')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading program details...</div>
        </div>
      </div>
    )
  }

  if (!program) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Program Details Not Found</h1>
          <Button asChild>
            <Link href="/dashboard/courses/program-details">Back to Program Details</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Edit Program Details: {program.title}</h1>
          <p className="text-gray-600 font-mono text-sm">/{program.parentCourseSlug}/{program.slug}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/courses/program-details">
              Back to Program Details
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <a href={`https://www.inframeschool.com/${program.parentCourseSlug}/${program.slug}`} target="_blank" rel="noopener noreferrer">
              View Live
            </a>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="admission">Admission ({program.admissionSteps?.length || 0})</TabsTrigger>
          <TabsTrigger value="highlights">Highlights ({program.programHighlights?.length || 0})</TabsTrigger>
          <TabsTrigger value="curriculum">Curriculum ({program.curriculum?.length || 0})</TabsTrigger>
          <TabsTrigger value="software">Software ({program.softwareTools?.length || 0})</TabsTrigger>
          <TabsTrigger value="careers">Careers ({program.careerPaths?.length || 0})</TabsTrigger>
          <TabsTrigger value="partners">Partners ({program.industryPartners?.length || 0})</TabsTrigger>
          <TabsTrigger value="gallery">Gallery ({program.galleryImages?.length || 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Program title, parent course, and basic details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="parentCourse">Parent Course *</Label>
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
                </div>

                <div>
                  <Label htmlFor="description">Hero Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Transform spaces and shape experiences..."
                    rows={3}
                    required
                  />
                </div>

                <HeroImageUpload
                  value={formData.heroImage}
                  onChange={(url) => handleInputChange('heroImage', url)}
                />

                <div>
                  <Label htmlFor="courseOverview">Course Overview *</Label>
                  <Textarea
                    id="courseOverview"
                    value={formData.courseOverview}
                    onChange={(e) => handleInputChange('courseOverview', e.target.value)}
                    placeholder="The Bachelor of Design (B.Des) in Interior Design is a four-year full-time program..."
                    rows={6}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="admissionQuote">Admission Quote (Optional)</Label>
                  <Input
                    id="admissionQuote"
                    value={formData.admissionQuote}
                    onChange={(e) => handleInputChange('admissionQuote', e.target.value)}
                    placeholder="Join us on an exhilarating journey of creativity..."
                  />
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
                    placeholder="Apply now and start your journey..."
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
                    placeholder="Transform spaces with our comprehensive 4-year Bachelor of Design program..."
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
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </TabsContent>

        {/* Other tabs will be added in the next part */}
        <TabsContent value="admission">
          <div className="text-center py-8">
            <p className="text-gray-500">Admission steps management coming soon...</p>
          </div>
        </TabsContent>

        <TabsContent value="highlights">
          <div className="text-center py-8">
            <p className="text-gray-500">Program highlights management coming soon...</p>
          </div>
        </TabsContent>

        <TabsContent value="curriculum">
          <div className="text-center py-8">
            <p className="text-gray-500">Curriculum management coming soon...</p>
          </div>
        </TabsContent>

        <TabsContent value="software">
          <div className="text-center py-8">
            <p className="text-gray-500">Software tools management coming soon...</p>
          </div>
        </TabsContent>

        <TabsContent value="careers">
          <div className="text-center py-8">
            <p className="text-gray-500">Career paths management coming soon...</p>
          </div>
        </TabsContent>

        <TabsContent value="partners">
          <div className="text-center py-8">
            <p className="text-gray-500">Industry partners management coming soon...</p>
          </div>
        </TabsContent>

        <TabsContent value="gallery">
          <div className="text-center py-8">
            <p className="text-gray-500">Gallery management coming soon...</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
