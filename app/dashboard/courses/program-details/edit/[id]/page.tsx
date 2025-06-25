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
  type ProgramHighlight,
  type FeeStructure,
  type EMIOption,
  type CouponCode
} from '../../apis'
import { Badge } from '@/components/ui/badge'

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

  const [highlightForm, setHighlightForm] = useState({
    icon: '',
    title: '',
    description: '',
    order: 1
  })
  const [editingHighlightId, setEditingHighlightId] = useState<string | null>(null)

  // Fee Structure Form States
  const [feeStructureForm, setFeeStructureForm] = useState({
    totalFee: 0,
    monthlyFee: 0,
    yearlyFee: 0,
    processingFee: 0,
    registrationFee: 0,
    discountPercentage: 0,
    paymentTerms: '',
    refundPolicy: '',
    isActive: true,
    order: 1
  })

  const [emiForm, setEmiForm] = useState({
    months: 12,
    monthlyAmount: 0,
    totalAmount: 0,
    processingFee: 0,
    interestRate: 0,
    isActive: true,
    order: 1
  })
  const [editingEmiId, setEditingEmiId] = useState<string | null>(null)

  const [couponForm, setCouponForm] = useState({
    code: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: 0,
    minimumAmount: 0,
    maximumDiscount: 0,
    validFrom: new Date().toISOString().split('T')[0],
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    usageLimit: 100,
    usedCount: 0,
    isActive: true,
    description: '',
    order: 1
  })
  const [editingCouponId, setEditingCouponId] = useState<string | null>(null)

  useEffect(() => {
    if (programId) {
      loadProgram()
    }
  }, [programId])

  const loadProgram = async () => {
    try {
      setLoading(true)
      console.log('Loading program with ID:', programId)
      const programData = await getCourseProgramById(programId)
      console.log('Program data received:', programData)
      
      if (!programData) {
        console.error('Program not found for ID:', programId)
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

      // Initialize fee structure form data
      if (programData.feeStructure) {
        setFeeStructureForm({
          totalFee: programData.feeStructure.totalFee || 0,
          monthlyFee: programData.feeStructure.monthlyFee || 0,
          yearlyFee: programData.feeStructure.yearlyFee || 0,
          processingFee: programData.feeStructure.processingFee || 0,
          registrationFee: programData.feeStructure.registrationFee || 0,
          discountPercentage: programData.feeStructure.discountPercentage || 0,
          paymentTerms: programData.feeStructure.paymentTerms || '',
          refundPolicy: programData.feeStructure.refundPolicy || '',
          isActive: programData.feeStructure.isActive,
          order: programData.feeStructure.order || 1
        })
      }
      console.log('Form data set successfully')
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

  // Admission Steps Functions
  const handleAddAdmissionStep = async () => {
    if (!admissionStepForm.title.trim() || !admissionStepForm.description.trim()) {
      toast.error('Title and description are required')
      return
    }

    try {
      const newStep: AdmissionStep = {
        stepNumber: admissionStepForm.stepNumber,
        icon: admissionStepForm.icon,
        title: admissionStepForm.title.trim(),
        description: admissionStepForm.description.trim(),
        order: admissionStepForm.order
      }

      const updatedSteps = [...(program?.admissionSteps || []), newStep]
      
      // Get the parent course ID
      const courseId = await getCourseIdBySlug(formData.parentCourseSlug)
      if (!courseId) {
        throw new Error('Parent course not found')
      }

      await updateCourseProgram(courseId, programId, {
        admissionSteps: updatedSteps
      })

      // Reset form
      setAdmissionStepForm({
        stepNumber: 1,
        icon: '',
        title: '',
        description: '',
        order: 1
      })

      toast.success('Admission step added successfully!')
      await loadProgram()
    } catch (error) {
      console.error('Error adding admission step:', error)
      toast.error('Failed to add admission step')
    }
  }

  const handleEditAdmissionStep = (index: number) => {
    const step = program?.admissionSteps?.[index]
    if (step) {
      setAdmissionStepForm({
        stepNumber: step.stepNumber,
        icon: step.icon,
        title: step.title,
        description: step.description,
        order: step.order
      })
      setEditingAdmissionStepId(index.toString())
    }
  }

  const handleUpdateAdmissionStep = async () => {
    if (!editingAdmissionStepId || !admissionStepForm.title.trim() || !admissionStepForm.description.trim()) {
      toast.error('Title and description are required')
      return
    }

    try {
      const index = parseInt(editingAdmissionStepId)
      const updatedSteps = [...(program?.admissionSteps || [])]
      
      updatedSteps[index] = {
        stepNumber: admissionStepForm.stepNumber,
        icon: admissionStepForm.icon,
        title: admissionStepForm.title.trim(),
        description: admissionStepForm.description.trim(),
        order: admissionStepForm.order
      }

      // Get the parent course ID
      const courseId = await getCourseIdBySlug(formData.parentCourseSlug)
      if (!courseId) {
        throw new Error('Parent course not found')
      }

      await updateCourseProgram(courseId, programId, {
        admissionSteps: updatedSteps
      })

      // Reset form and editing state
      setAdmissionStepForm({
        stepNumber: 1,
        icon: '',
        title: '',
        description: '',
        order: 1
      })
      setEditingAdmissionStepId(null)

      toast.success('Admission step updated successfully!')
      await loadProgram()
    } catch (error) {
      console.error('Error updating admission step:', error)
      toast.error('Failed to update admission step')
    }
  }

  const handleDeleteAdmissionStep = async (index: number) => {
    if (!confirm('Are you sure you want to delete this admission step?')) {
      return
    }

    try {
      const updatedSteps = [...(program?.admissionSteps || [])]
      updatedSteps.splice(index, 1)

      // Get the parent course ID
      const courseId = await getCourseIdBySlug(formData.parentCourseSlug)
      if (!courseId) {
        throw new Error('Parent course not found')
      }

      await updateCourseProgram(courseId, programId, {
        admissionSteps: updatedSteps
      })

      toast.success('Admission step deleted successfully!')
      await loadProgram()
    } catch (error) {
      console.error('Error deleting admission step:', error)
      toast.error('Failed to delete admission step')
    }
  }

  const handleCancelEdit = () => {
    setAdmissionStepForm({
      stepNumber: 1,
      icon: '',
      title: '',
      description: '',
      order: 1
    })
    setEditingAdmissionStepId(null)
  }

  // Program Highlights Functions
  const handleAddHighlight = async () => {
    if (!highlightForm.title.trim() || !highlightForm.description.trim()) {
      toast.error('Title and description are required')
      return
    }

    try {
      const newHighlight: ProgramHighlight = {
        icon: highlightForm.icon,
        title: highlightForm.title.trim(),
        description: highlightForm.description.trim(),
        order: highlightForm.order
      }

      const updatedHighlights = [...(program?.programHighlights || []), newHighlight]
      
      // Get the parent course ID
      const courseId = await getCourseIdBySlug(formData.parentCourseSlug)
      if (!courseId) {
        throw new Error('Parent course not found')
      }

      await updateCourseProgram(courseId, programId, {
        programHighlights: updatedHighlights
      })

      // Reset form
      setHighlightForm({
        icon: '',
        title: '',
        description: '',
        order: 1
      })

      toast.success('Program highlight added successfully!')
      await loadProgram()
    } catch (error) {
      console.error('Error adding program highlight:', error)
      toast.error('Failed to add program highlight')
    }
  }

  const handleEditHighlight = (index: number) => {
    const highlight = program?.programHighlights?.[index]
    if (highlight) {
      setHighlightForm({
        icon: highlight.icon,
        title: highlight.title,
        description: highlight.description,
        order: highlight.order
      })
      setEditingHighlightId(index.toString())
    }
  }

  const handleUpdateHighlight = async () => {
    if (!editingHighlightId || !highlightForm.title.trim() || !highlightForm.description.trim()) {
      toast.error('Title and description are required')
      return
    }

    try {
      const index = parseInt(editingHighlightId)
      const updatedHighlights = [...(program?.programHighlights || [])]
      
      updatedHighlights[index] = {
        icon: highlightForm.icon,
        title: highlightForm.title.trim(),
        description: highlightForm.description.trim(),
        order: highlightForm.order
      }

      // Get the parent course ID
      const courseId = await getCourseIdBySlug(formData.parentCourseSlug)
      if (!courseId) {
        throw new Error('Parent course not found')
      }

      await updateCourseProgram(courseId, programId, {
        programHighlights: updatedHighlights
      })

      // Reset form and editing state
      setHighlightForm({
        icon: '',
        title: '',
        description: '',
        order: 1
      })
      setEditingHighlightId(null)

      toast.success('Program highlight updated successfully!')
      await loadProgram()
    } catch (error) {
      console.error('Error updating program highlight:', error)
      toast.error('Failed to update program highlight')
    }
  }

  const handleDeleteHighlight = async (index: number) => {
    if (!confirm('Are you sure you want to delete this program highlight?')) {
      return
    }

    try {
      const updatedHighlights = [...(program?.programHighlights || [])]
      updatedHighlights.splice(index, 1)

      // Get the parent course ID
      const courseId = await getCourseIdBySlug(formData.parentCourseSlug)
      if (!courseId) {
        throw new Error('Parent course not found')
      }

      await updateCourseProgram(courseId, programId, {
        programHighlights: updatedHighlights
      })

      toast.success('Program highlight deleted successfully!')
      await loadProgram()
    } catch (error) {
      console.error('Error deleting program highlight:', error)
      toast.error('Failed to delete program highlight')
    }
  }

  const handleCancelHighlightEdit = () => {
    setHighlightForm({
      icon: '',
      title: '',
      description: '',
      order: 1
    })
    setEditingHighlightId(null)
  }

  // Curriculum Functions
  const handleAddCurriculumYear = async () => {
    if (!curriculumForm.year.trim() || !curriculumForm.description.trim()) {
      toast.error('Year and description are required')
      return
    }

    try {
      const newCurriculumYear: CurriculumYear = {
        year: curriculumForm.year.trim(),
        description: curriculumForm.description.trim(),
        imageUrl: curriculumForm.imageUrl,
        order: curriculumForm.order,
        semesters: curriculumForm.semesters.filter(sem => sem.semester.trim() && sem.subjects.length > 0)
      }

      const updatedCurriculum = [...(program?.curriculum || []), newCurriculumYear]
      
      // Get the parent course ID
      const courseId = await getCourseIdBySlug(formData.parentCourseSlug)
      if (!courseId) {
        throw new Error('Parent course not found')
      }

      await updateCourseProgram(courseId, programId, {
        curriculum: updatedCurriculum
      })

      // Reset form
      setCurriculumForm({
        year: '',
        description: '',
        imageUrl: '',
        order: 1,
        semesters: [{ semester: '', subjects: [''], order: 1 }]
      })

      toast.success('Curriculum year added successfully!')
      await loadProgram()
    } catch (error) {
      console.error('Error adding curriculum year:', error)
      toast.error('Failed to add curriculum year')
    }
  }

  const handleEditCurriculumYear = (index: number) => {
    const curriculumYear = program?.curriculum?.[index]
    if (curriculumYear) {
      setCurriculumForm({
        year: curriculumYear.year,
        description: curriculumYear.description || '',
        imageUrl: curriculumYear.imageUrl || '',
        order: curriculumYear.order,
        semesters: curriculumYear.semesters && curriculumYear.semesters.length > 0 
          ? curriculumYear.semesters 
          : [{ semester: '', subjects: [''], order: 1 }]
      })
      setEditingCurriculumId(index.toString())
    }
  }

  const handleUpdateCurriculumYear = async () => {
    if (!editingCurriculumId || !curriculumForm.year.trim() || !curriculumForm.description.trim()) {
      toast.error('Year and description are required')
      return
    }

    try {
      const index = parseInt(editingCurriculumId)
      const updatedCurriculum = [...(program?.curriculum || [])]
      
      updatedCurriculum[index] = {
        year: curriculumForm.year.trim(),
        description: curriculumForm.description.trim(),
        imageUrl: curriculumForm.imageUrl,
        order: curriculumForm.order,
        semesters: curriculumForm.semesters.filter(sem => sem.semester.trim() && sem.subjects.length > 0)
      }

      // Get the parent course ID
      const courseId = await getCourseIdBySlug(formData.parentCourseSlug)
      if (!courseId) {
        throw new Error('Parent course not found')
      }

      await updateCourseProgram(courseId, programId, {
        curriculum: updatedCurriculum
      })

      // Reset form and editing state
      setCurriculumForm({
        year: '',
        description: '',
        imageUrl: '',
        order: 1,
        semesters: [{ semester: '', subjects: [''], order: 1 }]
      })
      setEditingCurriculumId(null)

      toast.success('Curriculum year updated successfully!')
      await loadProgram()
    } catch (error) {
      console.error('Error updating curriculum year:', error)
      toast.error('Failed to update curriculum year')
    }
  }

  const handleDeleteCurriculumYear = async (index: number) => {
    if (!confirm('Are you sure you want to delete this curriculum year?')) {
      return
    }

    try {
      const updatedCurriculum = [...(program?.curriculum || [])]
      updatedCurriculum.splice(index, 1)

      // Get the parent course ID
      const courseId = await getCourseIdBySlug(formData.parentCourseSlug)
      if (!courseId) {
        throw new Error('Parent course not found')
      }

      await updateCourseProgram(courseId, programId, {
        curriculum: updatedCurriculum
      })

      toast.success('Curriculum year deleted successfully!')
      await loadProgram()
    } catch (error) {
      console.error('Error deleting curriculum year:', error)
      toast.error('Failed to delete curriculum year')
    }
  }

  const handleCancelCurriculumEdit = () => {
    setCurriculumForm({
      year: '',
      description: '',
      imageUrl: '',
      order: 1,
      semesters: [{ semester: '', subjects: [''], order: 1 }]
    })
    setEditingCurriculumId(null)
  }

  // Semester management functions
  const addSemester = () => {
    setCurriculumForm(prev => ({
      ...prev,
      semesters: [...prev.semesters, { semester: '', subjects: [''], order: prev.semesters.length + 1 }]
    }))
  }

  const removeSemester = (semesterIndex: number) => {
    setCurriculumForm(prev => ({
      ...prev,
      semesters: prev.semesters.filter((_, index) => index !== semesterIndex)
    }))
  }

  const updateSemester = (semesterIndex: number, field: string, value: string | number) => {
    setCurriculumForm(prev => ({
      ...prev,
      semesters: prev.semesters.map((sem, index) => 
        index === semesterIndex 
          ? { ...sem, [field]: value }
          : sem
      )
    }))
  }

  const addSubject = (semesterIndex: number) => {
    setCurriculumForm(prev => ({
      ...prev,
      semesters: prev.semesters.map((sem, index) => 
        index === semesterIndex 
          ? { ...sem, subjects: [...sem.subjects, ''] }
          : sem
      )
    }))
  }

  const removeSubject = (semesterIndex: number, subjectIndex: number) => {
    setCurriculumForm(prev => ({
      ...prev,
      semesters: prev.semesters.map((sem, index) => 
        index === semesterIndex 
          ? { ...sem, subjects: sem.subjects.filter((_, subIndex) => subIndex !== subjectIndex) }
          : sem
      )
    }))
  }

  const updateSubject = (semesterIndex: number, subjectIndex: number, value: string) => {
    setCurriculumForm(prev => ({
      ...prev,
      semesters: prev.semesters.map((sem, index) => 
        index === semesterIndex 
          ? { 
              ...sem, 
              subjects: sem.subjects.map((subject, subIndex) => 
                subIndex === subjectIndex ? value : subject
              )
            }
          : sem
      )
    }))
  }

  // Software Functions
  const handleAddSoftware = async () => {
    if (!softwareForm.name.trim() || !softwareForm.description.trim()) {
      toast.error('Name and description are required')
      return
    }

    try {
      const newSoftware: SoftwareTool = {
        name: softwareForm.name.trim(),
        description: softwareForm.description.trim(),
        logoUrl: softwareForm.logoUrl,
        order: softwareForm.order
      }

      const updatedSoftware = [...(program?.softwareTools || []), newSoftware]
      
      // Get the parent course ID
      const courseId = await getCourseIdBySlug(formData.parentCourseSlug)
      if (!courseId) {
        throw new Error('Parent course not found')
      }

      await updateCourseProgram(courseId, programId, {
        softwareTools: updatedSoftware
      })

      // Reset form
      setSoftwareForm({
        name: '',
        logoUrl: '',
        description: '',
        order: 1
      })

      toast.success('Software added successfully!')
      await loadProgram()
    } catch (error) {
      console.error('Error adding software:', error)
      toast.error('Failed to add software')
    }
  }

  const handleEditSoftware = (index: number) => {
    const software = program?.softwareTools?.[index]
    if (software) {
      setSoftwareForm({
        name: software.name,
        description: software.description || '',
        logoUrl: software.logoUrl || '',
        order: software.order
      })
      setEditingSoftwareId(index.toString())
    }
  }

  const handleUpdateSoftware = async () => {
    if (!editingSoftwareId || !softwareForm.name.trim() || !softwareForm.description.trim()) {
      toast.error('Name and description are required')
      return
    }

    try {
      const index = parseInt(editingSoftwareId)
      const updatedSoftware = [...(program?.softwareTools || [])]
      
      updatedSoftware[index] = {
        name: softwareForm.name.trim(),
        description: softwareForm.description.trim(),
        logoUrl: softwareForm.logoUrl,
        order: softwareForm.order
      }

      // Get the parent course ID
      const courseId = await getCourseIdBySlug(formData.parentCourseSlug)
      if (!courseId) {
        throw new Error('Parent course not found')
      }

      await updateCourseProgram(courseId, programId, {
        softwareTools: updatedSoftware
      })

      // Reset form and editing state
      setSoftwareForm({
        name: '',
        logoUrl: '',
        description: '',
        order: 1
      })
      setEditingSoftwareId(null)

      toast.success('Software updated successfully!')
      await loadProgram()
    } catch (error) {
      console.error('Error updating software:', error)
      toast.error('Failed to update software')
    }
  }

  const handleDeleteSoftware = async (index: number) => {
    if (!confirm('Are you sure you want to delete this software?')) {
      return
    }

    try {
      const updatedSoftware = [...(program?.softwareTools || [])]
      updatedSoftware.splice(index, 1)

      // Get the parent course ID
      const courseId = await getCourseIdBySlug(formData.parentCourseSlug)
      if (!courseId) {
        throw new Error('Parent course not found')
      }

      await updateCourseProgram(courseId, programId, {
        softwareTools: updatedSoftware
      })

      toast.success('Software deleted successfully!')
      await loadProgram()
    } catch (error) {
      console.error('Error deleting software:', error)
      toast.error('Failed to delete software')
    }
  }

  const handleCancelSoftwareEdit = () => {
    setSoftwareForm({
      name: '',
      logoUrl: '',
      description: '',
      order: 1
    })
    setEditingSoftwareId(null)
  }

  // Career Path Functions
  const handleAddCareerPath = async () => {
    if (!careerForm.title.trim() || careerForm.roles.length === 0 || !careerForm.roles[0].trim()) {
      toast.error('Title and at least one role are required')
      return
    }

    try {
      const newCareerPath: CareerPath = {
        title: careerForm.title.trim(),
        roles: careerForm.roles.filter(role => role.trim()),
        description: careerForm.description.trim(),
        order: careerForm.order
      }

      const updatedCareerPaths = [...(program?.careerPaths || []), newCareerPath]
      
      // Get the parent course ID
      const courseId = await getCourseIdBySlug(formData.parentCourseSlug)
      if (!courseId) {
        throw new Error('Parent course not found')
      }

      await updateCourseProgram(courseId, programId, {
        careerPaths: updatedCareerPaths
      })

      // Reset form
      setCareerForm({
        title: '',
        roles: [''],
        description: '',
        order: 1
      })

      toast.success('Career path added successfully!')
      await loadProgram()
    } catch (error) {
      console.error('Error adding career path:', error)
      toast.error('Failed to add career path')
    }
  }

  const handleEditCareerPath = (index: number) => {
    const careerPath = program?.careerPaths?.[index]
    if (careerPath) {
      setCareerForm({
        title: careerPath.title,
        roles: careerPath.roles.length > 0 ? careerPath.roles : [''],
        description: careerPath.description || '',
        order: careerPath.order
      })
      setEditingCareerId(index.toString())
    }
  }

  const handleUpdateCareerPath = async () => {
    if (!editingCareerId || !careerForm.title.trim() || careerForm.roles.length === 0 || !careerForm.roles[0].trim()) {
      toast.error('Title and at least one role are required')
      return
    }

    try {
      const index = parseInt(editingCareerId)
      const updatedCareerPaths = [...(program?.careerPaths || [])]
      
      updatedCareerPaths[index] = {
        title: careerForm.title.trim(),
        roles: careerForm.roles.filter(role => role.trim()),
        description: careerForm.description.trim(),
        order: careerForm.order
      }

      // Get the parent course ID
      const courseId = await getCourseIdBySlug(formData.parentCourseSlug)
      if (!courseId) {
        throw new Error('Parent course not found')
      }

      await updateCourseProgram(courseId, programId, {
        careerPaths: updatedCareerPaths
      })

      // Reset form and editing state
      setCareerForm({
        title: '',
        roles: [''],
        description: '',
        order: 1
      })
      setEditingCareerId(null)

      toast.success('Career path updated successfully!')
      await loadProgram()
    } catch (error) {
      console.error('Error updating career path:', error)
      toast.error('Failed to update career path')
    }
  }

  const handleDeleteCareerPath = async (index: number) => {
    if (!confirm('Are you sure you want to delete this career path?')) {
      return
    }

    try {
      const updatedCareerPaths = [...(program?.careerPaths || [])]
      updatedCareerPaths.splice(index, 1)

      // Get the parent course ID
      const courseId = await getCourseIdBySlug(formData.parentCourseSlug)
      if (!courseId) {
        throw new Error('Parent course not found')
      }

      await updateCourseProgram(courseId, programId, {
        careerPaths: updatedCareerPaths
      })

      toast.success('Career path deleted successfully!')
      await loadProgram()
    } catch (error) {
      console.error('Error deleting career path:', error)
      toast.error('Failed to delete career path')
    }
  }

  const handleCancelCareerEdit = () => {
    setCareerForm({
      title: '',
      roles: [''],
      description: '',
      order: 1
    })
    setEditingCareerId(null)
  }

  // Role management functions
  const addRole = () => {
    setCareerForm(prev => ({
      ...prev,
      roles: [...prev.roles, '']
    }))
  }

  const removeRole = (roleIndex: number) => {
    setCareerForm(prev => ({
      ...prev,
      roles: prev.roles.filter((_, index) => index !== roleIndex)
    }))
  }

  const updateRole = (roleIndex: number, value: string) => {
    setCareerForm(prev => ({
      ...prev,
      roles: prev.roles.map((role, index) => 
        index === roleIndex ? value : role
      )
    }))
  }

  // Fee Structure Functions
  const handleUpdateFeeStructure = async () => {
    try {
      const feeStructure: FeeStructure = {
        totalFee: feeStructureForm.totalFee,
        monthlyFee: feeStructureForm.monthlyFee,
        yearlyFee: feeStructureForm.yearlyFee,
        processingFee: feeStructureForm.processingFee,
        registrationFee: feeStructureForm.registrationFee,
        discountPercentage: feeStructureForm.discountPercentage,
        paymentTerms: feeStructureForm.paymentTerms,
        refundPolicy: feeStructureForm.refundPolicy,
        isActive: feeStructureForm.isActive,
        order: feeStructureForm.order,
        emiOptions: program?.feeStructure?.emiOptions || [],
        couponCodes: program?.feeStructure?.couponCodes || []
      }

      const courseId = await getCourseIdBySlug(formData.parentCourseSlug)
      if (!courseId) {
        throw new Error('Parent course not found')
      }

      await updateCourseProgram(courseId, programId, {
        feeStructure: feeStructure
      })

      toast.success('Fee structure updated successfully!')
      await loadProgram()
    } catch (error) {
      console.error('Error updating fee structure:', error)
      toast.error('Failed to update fee structure')
    }
  }

  const handleAddEMI = async () => {
    if (!emiForm.months || !emiForm.monthlyAmount || !emiForm.totalAmount) {
      toast.error('Months, monthly amount, and total amount are required')
      return
    }

    try {
      const newEMI: EMIOption = {
        months: emiForm.months,
        monthlyAmount: emiForm.monthlyAmount,
        totalAmount: emiForm.totalAmount,
        processingFee: emiForm.processingFee,
        interestRate: emiForm.interestRate,
        isActive: emiForm.isActive,
        order: emiForm.order
      }

      const currentFeeStructure = program?.feeStructure || {
        totalFee: 0,
        emiOptions: [],
        couponCodes: [],
        isActive: true,
        order: 1
      }

      const updatedEMIOptions = [...currentFeeStructure.emiOptions, newEMI]
      
      const courseId = await getCourseIdBySlug(formData.parentCourseSlug)
      if (!courseId) {
        throw new Error('Parent course not found')
      }

      await updateCourseProgram(courseId, programId, {
        feeStructure: {
          ...currentFeeStructure,
          emiOptions: updatedEMIOptions
        }
      })

      // Reset form
      setEmiForm({
        months: 12,
        monthlyAmount: 0,
        totalAmount: 0,
        processingFee: 0,
        interestRate: 0,
        isActive: true,
        order: 1
      })

      toast.success('EMI option added successfully!')
      await loadProgram()
    } catch (error) {
      console.error('Error adding EMI option:', error)
      toast.error('Failed to add EMI option')
    }
  }

  const handleEditEMI = (index: number) => {
    const emi = program?.feeStructure?.emiOptions?.[index]
    if (emi) {
      setEmiForm({
        months: emi.months,
        monthlyAmount: emi.monthlyAmount,
        totalAmount: emi.totalAmount,
        processingFee: emi.processingFee || 0,
        interestRate: emi.interestRate || 0,
        isActive: emi.isActive,
        order: emi.order
      })
      setEditingEmiId(emi._id || `temp-${index}`)
    }
  }

  const handleUpdateEMI = async () => {
    if (!editingEmiId) return

    try {
      const currentFeeStructure = program?.feeStructure || {
        totalFee: 0,
        emiOptions: [],
        couponCodes: [],
        isActive: true,
        order: 1
      }

      const updatedEMIOptions = currentFeeStructure.emiOptions.map((emi, index) => {
        if (emi._id === editingEmiId || `temp-${index}` === editingEmiId) {
          return {
            ...emi,
            months: emiForm.months,
            monthlyAmount: emiForm.monthlyAmount,
            totalAmount: emiForm.totalAmount,
            processingFee: emiForm.processingFee,
            interestRate: emiForm.interestRate,
            isActive: emiForm.isActive,
            order: emiForm.order
          }
        }
        return emi
      })

      const courseId = await getCourseIdBySlug(formData.parentCourseSlug)
      if (!courseId) {
        throw new Error('Parent course not found')
      }

      await updateCourseProgram(courseId, programId, {
        feeStructure: {
          ...currentFeeStructure,
          emiOptions: updatedEMIOptions
        }
      })

      // Reset form
      setEmiForm({
        months: 12,
        monthlyAmount: 0,
        totalAmount: 0,
        processingFee: 0,
        interestRate: 0,
        isActive: true,
        order: 1
      })
      setEditingEmiId(null)

      toast.success('EMI option updated successfully!')
      await loadProgram()
    } catch (error) {
      console.error('Error updating EMI option:', error)
      toast.error('Failed to update EMI option')
    }
  }

  const handleDeleteEMI = async (index: number) => {
    try {
      const currentFeeStructure = program?.feeStructure || {
        totalFee: 0,
        emiOptions: [],
        couponCodes: [],
        isActive: true,
        order: 1
      }

      const updatedEMIOptions = currentFeeStructure.emiOptions.filter((_, i) => i !== index)

      const courseId = await getCourseIdBySlug(formData.parentCourseSlug)
      if (!courseId) {
        throw new Error('Parent course not found')
      }

      await updateCourseProgram(courseId, programId, {
        feeStructure: {
          ...currentFeeStructure,
          emiOptions: updatedEMIOptions
        }
      })

      toast.success('EMI option deleted successfully!')
      await loadProgram()
    } catch (error) {
      console.error('Error deleting EMI option:', error)
      toast.error('Failed to delete EMI option')
    }
  }

  const handleCancelEMIEdit = () => {
    setEmiForm({
      months: 12,
      monthlyAmount: 0,
      totalAmount: 0,
      processingFee: 0,
      interestRate: 0,
      isActive: true,
      order: 1
    })
    setEditingEmiId(null)
  }

  const handleAddCoupon = async () => {
    if (!couponForm.code.trim() || !couponForm.discountValue) {
      toast.error('Coupon code and discount value are required')
      return
    }

    try {
      const newCoupon: CouponCode = {
        code: couponForm.code.trim().toUpperCase(),
        discountType: couponForm.discountType,
        discountValue: couponForm.discountValue,
        minimumAmount: couponForm.minimumAmount,
        maximumDiscount: couponForm.maximumDiscount,
        validFrom: new Date(couponForm.validFrom).toISOString(),
        validUntil: new Date(couponForm.validUntil).toISOString(),
        usageLimit: couponForm.usageLimit,
        usedCount: couponForm.usedCount,
        isActive: couponForm.isActive,
        description: couponForm.description,
        order: couponForm.order
      }

      const currentFeeStructure = program?.feeStructure || {
        totalFee: 0,
        emiOptions: [],
        couponCodes: [],
        isActive: true,
        order: 1
      }

      const updatedCouponCodes = [...currentFeeStructure.couponCodes, newCoupon]
      
      const courseId = await getCourseIdBySlug(formData.parentCourseSlug)
      if (!courseId) {
        throw new Error('Parent course not found')
      }

      await updateCourseProgram(courseId, programId, {
        feeStructure: {
          ...currentFeeStructure,
          couponCodes: updatedCouponCodes
        }
      })

      // Reset form
      setCouponForm({
        code: '',
        discountType: 'percentage',
        discountValue: 0,
        minimumAmount: 0,
        maximumDiscount: 0,
        validFrom: new Date().toISOString().split('T')[0],
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        usageLimit: 100,
        usedCount: 0,
        isActive: true,
        description: '',
        order: 1
      })

      toast.success('Coupon code added successfully!')
      await loadProgram()
    } catch (error) {
      console.error('Error adding coupon code:', error)
      toast.error('Failed to add coupon code')
    }
  }

  const handleEditCoupon = (index: number) => {
    const coupon = program?.feeStructure?.couponCodes?.[index]
    if (coupon) {
      setCouponForm({
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minimumAmount: coupon.minimumAmount || 0,
        maximumDiscount: coupon.maximumDiscount || 0,
        validFrom: new Date(coupon.validFrom).toISOString().split('T')[0],
        validUntil: new Date(coupon.validUntil).toISOString().split('T')[0],
        usageLimit: coupon.usageLimit || 100,
        usedCount: coupon.usedCount,
        isActive: coupon.isActive,
        description: coupon.description || '',
        order: coupon.order
      })
      setEditingCouponId(coupon._id || `temp-${index}`)
    }
  }

  const handleUpdateCoupon = async () => {
    if (!editingCouponId) return

    try {
      const currentFeeStructure = program?.feeStructure || {
        totalFee: 0,
        emiOptions: [],
        couponCodes: [],
        isActive: true,
        order: 1
      }

      const updatedCouponCodes = currentFeeStructure.couponCodes.map((coupon, index) => {
        if (coupon._id === editingCouponId || `temp-${index}` === editingCouponId) {
          return {
            ...coupon,
            code: couponForm.code.trim().toUpperCase(),
            discountType: couponForm.discountType,
            discountValue: couponForm.discountValue,
            minimumAmount: couponForm.minimumAmount,
            maximumDiscount: couponForm.maximumDiscount,
            validFrom: new Date(couponForm.validFrom).toISOString(),
            validUntil: new Date(couponForm.validUntil).toISOString(),
            usageLimit: couponForm.usageLimit,
            usedCount: couponForm.usedCount,
            isActive: couponForm.isActive,
            description: couponForm.description,
            order: couponForm.order
          }
        }
        return coupon
      })

      const courseId = await getCourseIdBySlug(formData.parentCourseSlug)
      if (!courseId) {
        throw new Error('Parent course not found')
      }

      await updateCourseProgram(courseId, programId, {
        feeStructure: {
          ...currentFeeStructure,
          couponCodes: updatedCouponCodes
        }
      })

      // Reset form
      setCouponForm({
        code: '',
        discountType: 'percentage',
        discountValue: 0,
        minimumAmount: 0,
        maximumDiscount: 0,
        validFrom: new Date().toISOString().split('T')[0],
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        usageLimit: 100,
        usedCount: 0,
        isActive: true,
        description: '',
        order: 1
      })
      setEditingCouponId(null)

      toast.success('Coupon code updated successfully!')
      await loadProgram()
    } catch (error) {
      console.error('Error updating coupon code:', error)
      toast.error('Failed to update coupon code')
    }
  }

  const handleDeleteCoupon = async (index: number) => {
    try {
      const currentFeeStructure = program?.feeStructure || {
        totalFee: 0,
        emiOptions: [],
        couponCodes: [],
        isActive: true,
        order: 1
      }

      const updatedCouponCodes = currentFeeStructure.couponCodes.filter((_, i) => i !== index)

      const courseId = await getCourseIdBySlug(formData.parentCourseSlug)
      if (!courseId) {
        throw new Error('Parent course not found')
      }

      await updateCourseProgram(courseId, programId, {
        feeStructure: {
          ...currentFeeStructure,
          couponCodes: updatedCouponCodes
        }
      })

      toast.success('Coupon code deleted successfully!')
      await loadProgram()
    } catch (error) {
      console.error('Error deleting coupon code:', error)
      toast.error('Failed to delete coupon code')
    }
  }

  const handleCancelCouponEdit = () => {
    setCouponForm({
      code: '',
      discountType: 'percentage',
      discountValue: 0,
      minimumAmount: 0,
      maximumDiscount: 0,
      validFrom: new Date().toISOString().split('T')[0],
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      usageLimit: 100,
      usedCount: 0,
      isActive: true,
      description: '',
      order: 1
    })
    setEditingCouponId(null)
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-lg">Loading program details...</div>
            <div className="text-sm text-gray-500 mt-2">Fetching data for program ID: {programId}</div>
          </div>
        </div>
      </div>
    )
  }

  if (!program) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Program not found</h3>
          <p className="text-gray-500 mb-4">The program you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link href="/dashboard/courses/program-details">
              Back to Program Details
            </Link>
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
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="admission">Admission ({program.admissionSteps?.length || 0})</TabsTrigger>
          <TabsTrigger value="highlights">Highlights ({program.programHighlights?.length || 0})</TabsTrigger>
          <TabsTrigger value="curriculum">Curriculum ({program.curriculum?.length || 0})</TabsTrigger>
          <TabsTrigger value="software">Software ({program.softwareTools?.length || 0})</TabsTrigger>
          <TabsTrigger value="careers">Careers ({program.careerPaths?.length || 0})</TabsTrigger>
          <TabsTrigger value="fees">Fee Structure</TabsTrigger>
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

        {/* Admission Steps Tab */}
        <TabsContent value="admission">
          <Card>
            <CardHeader>
              <CardTitle>Admission Process Steps</CardTitle>
              <CardDescription>Manage the step-by-step admission process</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Add New Admission Step */}
              <div className="border rounded-lg p-4 space-y-4">
                <h4 className="font-medium">
                  {editingAdmissionStepId ? 'Edit Admission Step' : 'Add New Admission Step'}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="stepIcon">Icon (Emoji)</Label>
                    <Input
                      id="stepIcon"
                      value={admissionStepForm.icon}
                      onChange={(e) => setAdmissionStepForm(prev => ({ ...prev, icon: e.target.value }))}
                      placeholder="🎓"
                    />
          </div>
                  <div>
                    <Label htmlFor="stepNumber">Step Number</Label>
                    <Input
                      id="stepNumber"
                      type="number"
                      value={admissionStepForm.stepNumber}
                      onChange={(e) => setAdmissionStepForm(prev => ({ ...prev, stepNumber: parseInt(e.target.value) }))}
                      min="1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="stepTitle">Title</Label>
                    <Input
                      id="stepTitle"
                      value={admissionStepForm.title}
                      onChange={(e) => setAdmissionStepForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Submit Application"
                    />
                  </div>
                  <div>
                    <Label htmlFor="stepOrder">Display Order</Label>
                    <Input
                      id="stepOrder"
                      type="number"
                      value={admissionStepForm.order}
                      onChange={(e) => setAdmissionStepForm(prev => ({ ...prev, order: parseInt(e.target.value) }))}
                      min="1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="stepDescription">Description</Label>
                  <Textarea
                    id="stepDescription"
                    value={admissionStepForm.description}
                    onChange={(e) => setAdmissionStepForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Complete the online application form with all required documents..."
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    type="button" 
                    onClick={editingAdmissionStepId ? handleUpdateAdmissionStep : handleAddAdmissionStep}
                  >
                    {editingAdmissionStepId ? 'Update Admission Step' : 'Add Admission Step'}
                  </Button>
                  {editingAdmissionStepId && (
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>

              {/* Existing Admission Steps */}
              <div className="space-y-4">
                <h4 className="font-medium">Existing Admission Steps</h4>
                {program.admissionSteps && program.admissionSteps.length > 0 ? (
                  <div className="space-y-3">
                    {program.admissionSteps.map((step, index) => (
                      <div key={index} className="border rounded-lg p-4 flex justify-between items-start">
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{step.icon}</span>
                          <div>
                            <h5 className="font-medium">{step.title}</h5>
                            <p className="text-sm text-gray-600">{step.description}</p>
                            <p className="text-xs text-gray-500">Step {step.stepNumber} • Order {step.order}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEditAdmissionStep(index)}>Edit</Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteAdmissionStep(index)}>Delete</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No admission steps added yet.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Program Highlights Tab */}
        <TabsContent value="highlights">
          <Card>
            <CardHeader>
              <CardTitle>Program Highlights</CardTitle>
              <CardDescription>Key features and benefits of the program</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Add New Highlight */}
              <div className="border rounded-lg p-4 space-y-4">
                <h4 className="font-medium">
                  {editingHighlightId ? 'Edit Program Highlight' : 'Add New Program Highlight'}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="highlightIcon">Icon (Emoji)</Label>
                    <Input
                      id="highlightIcon"
                      value={highlightForm.icon}
                      onChange={(e) => setHighlightForm(prev => ({ ...prev, icon: e.target.value }))}
                      placeholder="⭐"
                    />
          </div>
                  <div>
                    <Label htmlFor="highlightOrder">Display Order</Label>
                    <Input
                      id="highlightOrder"
                      type="number"
                      value={highlightForm.order}
                      onChange={(e) => setHighlightForm(prev => ({ ...prev, order: parseInt(e.target.value) }))}
                      min="1"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="highlightTitle">Title</Label>
                    <Input
                      id="highlightTitle"
                      value={highlightForm.title}
                      onChange={(e) => setHighlightForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Industry-Relevant Curriculum"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="highlightDescription">Description</Label>
                  <Textarea
                    id="highlightDescription"
                    value={highlightForm.description}
                    onChange={(e) => setHighlightForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Our curriculum is designed in collaboration with industry experts..."
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    type="button" 
                    onClick={editingHighlightId ? handleUpdateHighlight : handleAddHighlight}
                  >
                    {editingHighlightId ? 'Update Program Highlight' : 'Add Program Highlight'}
                  </Button>
                  {editingHighlightId && (
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={handleCancelHighlightEdit}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>

              {/* Existing Highlights */}
              <div className="space-y-4">
                <h4 className="font-medium">Existing Program Highlights</h4>
                {program.programHighlights && program.programHighlights.length > 0 ? (
                  <div className="space-y-3">
                    {program.programHighlights.map((highlight, index) => (
                      <div key={index} className="border rounded-lg p-4 flex justify-between items-start">
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{highlight.icon}</span>
                          <div>
                            <h5 className="font-medium">{highlight.title}</h5>
                            <p className="text-sm text-gray-600">{highlight.description}</p>
                            <p className="text-xs text-gray-500">Order {highlight.order}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEditHighlight(index)}>Edit</Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteHighlight(index)}>Delete</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No program highlights added yet.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Curriculum Tab */}
        <TabsContent value="curriculum">
          <Card>
            <CardHeader>
              <CardTitle>Curriculum Structure</CardTitle>
              <CardDescription>Year-wise curriculum with semesters and subjects</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Add New Curriculum Year */}
              <div className="border rounded-lg p-4 space-y-4">
                <h4 className="font-medium">
                  {editingCurriculumId ? 'Edit Curriculum Year' : 'Add New Curriculum Year'}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="curriculumYear">Year</Label>
                    <Input
                      id="curriculumYear"
                      value={curriculumForm.year}
                      onChange={(e) => setCurriculumForm(prev => ({ ...prev, year: e.target.value }))}
                      placeholder="1st Year"
                    />
          </div>
                  <div>
                    <Label htmlFor="curriculumOrder">Display Order</Label>
                    <Input
                      id="curriculumOrder"
                      type="number"
                      value={curriculumForm.order}
                      onChange={(e) => setCurriculumForm(prev => ({ ...prev, order: parseInt(e.target.value) }))}
                      min="1"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="curriculumDescription">Description</Label>
                    <Textarea
                      id="curriculumDescription"
                      value={curriculumForm.description}
                      onChange={(e) => setCurriculumForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Foundation year focusing on basic design principles..."
                      rows={3}
                    />
                  </div>
                </div>

                {/* Semester Management */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h5 className="font-medium">Semesters</h5>
                    <Button 
                      type="button" 
                      size="sm" 
                      variant="outline"
                      onClick={addSemester}
                    >
                      Add Semester
                    </Button>
                  </div>
                  
                  {curriculumForm.semesters.map((semester, semesterIndex) => (
                    <div key={semesterIndex} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <h6 className="font-medium">Semester {semesterIndex + 1}</h6>
                        <Button 
                          type="button" 
                          size="sm" 
                          variant="destructive"
                          onClick={() => removeSemester(semesterIndex)}
                        >
                          Remove Semester
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`semester-${semesterIndex}`}>Semester Name</Label>
                          <Input
                            id={`semester-${semesterIndex}`}
                            value={semester.semester}
                            onChange={(e) => updateSemester(semesterIndex, 'semester', e.target.value)}
                            placeholder="Semester 1"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`semester-order-${semesterIndex}`}>Order</Label>
                          <Input
                            id={`semester-order-${semesterIndex}`}
                            type="number"
                            value={semester.order}
                            onChange={(e) => updateSemester(semesterIndex, 'order', parseInt(e.target.value))}
                            min="1"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label>Subjects</Label>
                          <Button 
                            type="button" 
                            size="sm" 
                            variant="outline"
                            onClick={() => addSubject(semesterIndex)}
                          >
                            Add Subject
                          </Button>
                        </div>
                        
                        {semester.subjects.map((subject, subjectIndex) => (
                          <div key={subjectIndex} className="flex gap-2">
                            <Input
                              value={subject}
                              onChange={(e) => updateSubject(semesterIndex, subjectIndex, e.target.value)}
                              placeholder="Subject name"
                              className="flex-1"
                            />
                            <Button 
                              type="button" 
                              size="sm" 
                              variant="destructive"
                              onClick={() => removeSubject(semesterIndex, subjectIndex)}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button 
                    type="button" 
                    onClick={editingCurriculumId ? handleUpdateCurriculumYear : handleAddCurriculumYear}
                  >
                    {editingCurriculumId ? 'Update Curriculum Year' : 'Add Curriculum Year'}
                  </Button>
                  {editingCurriculumId && (
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={handleCancelCurriculumEdit}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>

              {/* Existing Curriculum */}
              <div className="space-y-4">
                <h4 className="font-medium">Existing Curriculum</h4>
                {program.curriculum && program.curriculum.length > 0 ? (
                  <div className="space-y-4">
                    {program.curriculum.map((curriculumYear, yearIndex) => (
                      <div key={yearIndex} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h5 className="font-medium">{curriculumYear.year}</h5>
                            <div className="text-sm text-gray-600">
                              {curriculumYear.description}
                            </div>
                            {curriculumYear.semesters && curriculumYear.semesters.length > 0 && (
                              <div className="mt-2">
                                <div className="text-sm font-medium text-gray-700 mb-1">Semesters:</div>
                                {curriculumYear.semesters.map((semester, semesterIndex) => (
                                  <div key={semesterIndex} className="ml-4 mb-2">
                                    <div className="text-sm font-medium text-gray-600">
                                      {semester.semester} (Order: {semester.order})
                                    </div>
                                    {semester.subjects && semester.subjects.length > 0 && (
                                      <div className="ml-4 text-xs text-gray-500">
                                        {semester.subjects.map((subject, subjectIndex) => (
                                          <div key={subjectIndex}>• {subject}</div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleEditCurriculumYear(yearIndex)}>Edit</Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteCurriculumYear(yearIndex)}>Delete</Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No curriculum added yet.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Software Tools Tab */}
        <TabsContent value="software">
          <Card>
            <CardHeader>
              <CardTitle>Software & Tools</CardTitle>
              <CardDescription>Software applications and tools taught in the program</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Add New Software */}
              <div className="border rounded-lg p-4 space-y-4">
                <h4 className="font-medium">
                  {editingSoftwareId ? 'Edit Software Tool' : 'Add New Software Tool'}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="softwareName">Software Name</Label>
                    <Input
                      id="softwareName"
                      value={softwareForm.name}
                      onChange={(e) => setSoftwareForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="AutoCAD"
                    />
          </div>
                  <div>
                    <Label htmlFor="softwareOrder">Display Order</Label>
                    <Input
                      id="softwareOrder"
                      type="number"
                      value={softwareForm.order}
                      onChange={(e) => setSoftwareForm(prev => ({ ...prev, order: parseInt(e.target.value) }))}
                      min="1"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <ImageUpload
                      label="Logo URL"
                      value={softwareForm.logoUrl}
                      onChange={(url) => setSoftwareForm(prev => ({ ...prev, logoUrl: url }))}
                      placeholder="https://example.com/autocad-logo.png or upload below"
                      description="Upload software logo or enter URL"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="softwareDescription">Description</Label>
                  <Textarea
                    id="softwareDescription"
                    value={softwareForm.description}
                    onChange={(e) => setSoftwareForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Industry-standard CAD software for 2D and 3D design..."
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    type="button" 
                    onClick={editingSoftwareId ? handleUpdateSoftware : handleAddSoftware}
                  >
                    {editingSoftwareId ? 'Update Software Tool' : 'Add Software Tool'}
                  </Button>
                  {editingSoftwareId && (
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={handleCancelSoftwareEdit}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>

              {/* Existing Software */}
              <div className="space-y-4">
                <h4 className="font-medium">Existing Software Tools</h4>
                {program.softwareTools && program.softwareTools.length > 0 ? (
                  <div className="space-y-3">
                    {program.softwareTools.map((software, index) => (
                      <div key={index} className="border rounded-lg p-4 flex justify-between items-start">
                        <div className="flex items-start gap-3">
                          {software.logoUrl && (
                            <img src={software.logoUrl} alt={software.name} className="w-8 h-8 object-contain" />
                          )}
                          <div>
                            <h5 className="font-medium">{software.name}</h5>
                            <p className="text-sm text-gray-600">{software.description}</p>
                            <p className="text-xs text-gray-500">Order {software.order}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEditSoftware(index)}>Edit</Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteSoftware(index)}>Delete</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No software tools added yet.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Career Paths Tab */}
        <TabsContent value="careers">
          <Card>
            <CardHeader>
              <CardTitle>Career Paths</CardTitle>
              <CardDescription>Potential career opportunities after completing the program</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Add New Career Path */}
              <div className="border rounded-lg p-4 space-y-4">
                <h4 className="font-medium">
                  {editingCareerId ? 'Edit Career Path' : 'Add New Career Path'}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="careerTitle">Career Title</Label>
                    <Input
                      id="careerTitle"
                      value={careerForm.title}
                      onChange={(e) => setCareerForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Interior Designer"
                    />
          </div>
                  <div>
                    <Label htmlFor="careerOrder">Display Order</Label>
                    <Input
                      id="careerOrder"
                      type="number"
                      value={careerForm.order}
                      onChange={(e) => setCareerForm(prev => ({ ...prev, order: parseInt(e.target.value) }))}
                      min="1"
                    />
                  </div>
                </div>
                
                {/* Roles Management */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label>Roles</Label>
                    <Button 
                      type="button" 
                      size="sm" 
                      variant="outline"
                      onClick={addRole}
                    >
                      Add Role
                    </Button>
          </div>
                  
                  {careerForm.roles.map((role, roleIndex) => (
                    <div key={roleIndex} className="flex gap-2">
                      <Input
                        value={role}
                        onChange={(e) => updateRole(roleIndex, e.target.value)}
                        placeholder="e.g., Residential Designer"
                        className="flex-1"
                      />
                      <Button 
                        type="button" 
                        size="sm" 
                        variant="destructive"
                        onClick={() => removeRole(roleIndex)}
                        disabled={careerForm.roles.length === 1}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>

                <div>
                  <Label htmlFor="careerDescription">Description</Label>
                  <Textarea
                    id="careerDescription"
                    value={careerForm.description}
                    onChange={(e) => setCareerForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Design and create functional, safe, and beautiful spaces..."
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    type="button" 
                    onClick={editingCareerId ? handleUpdateCareerPath : handleAddCareerPath}
                  >
                    {editingCareerId ? 'Update Career Path' : 'Add Career Path'}
                  </Button>
                  {editingCareerId && (
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={handleCancelCareerEdit}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>

              {/* Existing Career Paths */}
              <div className="space-y-4">
                <h4 className="font-medium">Existing Career Paths</h4>
                {program.careerPaths && program.careerPaths.length > 0 ? (
                  <div className="space-y-3">
                    {program.careerPaths.map((career, index) => (
                      <div key={index} className="border rounded-lg p-4 flex justify-between items-start">
                        <div>
                          <h5 className="font-medium">{career.title}</h5>
                          <p className="text-sm text-gray-600">{career.description}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {career.roles.map((role, roleIndex) => (
                              <Badge key={roleIndex} variant="secondary" className="text-xs">
                                {role}
                              </Badge>
                            ))}
                          </div>
                          <p className="text-xs text-gray-500 mt-2">Order {career.order}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEditCareerPath(index)}>Edit</Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteCareerPath(index)}>Delete</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No career paths added yet.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Fee Structure Tab */}
        <TabsContent value="fees">
          <div className="space-y-6">
            {/* Basic Fee Structure */}
            <Card>
              <CardHeader>
                <CardTitle>Fee Structure</CardTitle>
                <CardDescription>Basic fee information and payment terms</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="totalFee">Total Fee (₹)</Label>
                    <Input
                      id="totalFee"
                      type="number"
                      value={feeStructureForm.totalFee}
                      onChange={(e) => setFeeStructureForm(prev => ({ ...prev, totalFee: parseFloat(e.target.value) || 0 }))}
                      placeholder="500000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="monthlyFee">Monthly Fee (₹)</Label>
                    <Input
                      id="monthlyFee"
                      type="number"
                      value={feeStructureForm.monthlyFee}
                      onChange={(e) => setFeeStructureForm(prev => ({ ...prev, monthlyFee: parseFloat(e.target.value) || 0 }))}
                      placeholder="15000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="yearlyFee">Yearly Fee (₹)</Label>
                    <Input
                      id="yearlyFee"
                      type="number"
                      value={feeStructureForm.yearlyFee}
                      onChange={(e) => setFeeStructureForm(prev => ({ ...prev, yearlyFee: parseFloat(e.target.value) || 0 }))}
                      placeholder="125000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="processingFee">Processing Fee (₹)</Label>
                    <Input
                      id="processingFee"
                      type="number"
                      value={feeStructureForm.processingFee}
                      onChange={(e) => setFeeStructureForm(prev => ({ ...prev, processingFee: parseFloat(e.target.value) || 0 }))}
                      placeholder="5000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="registrationFee">Registration Fee (₹)</Label>
                    <Input
                      id="registrationFee"
                      type="number"
                      value={feeStructureForm.registrationFee}
                      onChange={(e) => setFeeStructureForm(prev => ({ ...prev, registrationFee: parseFloat(e.target.value) || 0 }))}
                      placeholder="10000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="discountPercentage">Discount Percentage (%)</Label>
                    <Input
                      id="discountPercentage"
                      type="number"
                      value={feeStructureForm.discountPercentage}
                      onChange={(e) => setFeeStructureForm(prev => ({ ...prev, discountPercentage: parseFloat(e.target.value) || 0 }))}
                      placeholder="10"
                      min="0"
                      max="100"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="paymentTerms">Payment Terms</Label>
                  <Textarea
                    id="paymentTerms"
                    value={feeStructureForm.paymentTerms}
                    onChange={(e) => setFeeStructureForm(prev => ({ ...prev, paymentTerms: e.target.value }))}
                    placeholder="50% upfront, 50% in 3 months"
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="refundPolicy">Refund Policy</Label>
                  <Textarea
                    id="refundPolicy"
                    value={feeStructureForm.refundPolicy}
                    onChange={(e) => setFeeStructureForm(prev => ({ ...prev, refundPolicy: e.target.value }))}
                    placeholder="Full refund within 30 days of enrollment"
                    rows={3}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="feeStructureActive"
                    checked={feeStructureForm.isActive}
                    onCheckedChange={(checked) => setFeeStructureForm(prev => ({ ...prev, isActive: checked as boolean }))}
                  />
                  <Label htmlFor="feeStructureActive">Active</Label>
                </div>

                <Button onClick={handleUpdateFeeStructure}>
                  Update Fee Structure
                </Button>
              </CardContent>
            </Card>

            {/* EMI Options */}
            <Card>
              <CardHeader>
                <CardTitle>EMI Options</CardTitle>
                <CardDescription>Flexible payment plans for students</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Add New EMI */}
                <div className="border rounded-lg p-4 space-y-4">
                  <h4 className="font-medium">
                    {editingEmiId ? 'Edit EMI Option' : 'Add New EMI Option'}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="emiMonths">Months</Label>
                      <Input
                        id="emiMonths"
                        type="number"
                        value={emiForm.months}
                        onChange={(e) => setEmiForm(prev => ({ ...prev, months: parseInt(e.target.value) || 0 }))}
                        placeholder="12"
                        min="1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="emiMonthlyAmount">Monthly Amount (₹)</Label>
                      <Input
                        id="emiMonthlyAmount"
                        type="number"
                        value={emiForm.monthlyAmount}
                        onChange={(e) => setEmiForm(prev => ({ ...prev, monthlyAmount: parseFloat(e.target.value) || 0 }))}
                        placeholder="15000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="emiTotalAmount">Total Amount (₹)</Label>
                      <Input
                        id="emiTotalAmount"
                        type="number"
                        value={emiForm.totalAmount}
                        onChange={(e) => setEmiForm(prev => ({ ...prev, totalAmount: parseFloat(e.target.value) || 0 }))}
                        placeholder="180000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="emiProcessingFee">Processing Fee (₹)</Label>
                      <Input
                        id="emiProcessingFee"
                        type="number"
                        value={emiForm.processingFee}
                        onChange={(e) => setEmiForm(prev => ({ ...prev, processingFee: parseFloat(e.target.value) || 0 }))}
                        placeholder="2000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="emiInterestRate">Interest Rate (%)</Label>
                      <Input
                        id="emiInterestRate"
                        type="number"
                        value={emiForm.interestRate}
                        onChange={(e) => setEmiForm(prev => ({ ...prev, interestRate: parseFloat(e.target.value) || 0 }))}
                        placeholder="12"
                        step="0.1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="emiOrder">Display Order</Label>
                      <Input
                        id="emiOrder"
                        type="number"
                        value={emiForm.order}
                        onChange={(e) => setEmiForm(prev => ({ ...prev, order: parseInt(e.target.value) || 1 }))}
                        min="1"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="emiActive"
                      checked={emiForm.isActive}
                      onCheckedChange={(checked) => setEmiForm(prev => ({ ...prev, isActive: checked as boolean }))}
                    />
                    <Label htmlFor="emiActive">Active</Label>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      type="button" 
                      onClick={editingEmiId ? handleUpdateEMI : handleAddEMI}
                    >
                      {editingEmiId ? 'Update EMI Option' : 'Add EMI Option'}
                    </Button>
                    {editingEmiId && (
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={handleCancelEMIEdit}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>

                {/* Existing EMI Options */}
                <div className="space-y-4">
                  <h4 className="font-medium">Existing EMI Options</h4>
                  {program.feeStructure?.emiOptions && program.feeStructure.emiOptions.length > 0 ? (
                    <div className="space-y-3">
                      {program.feeStructure.emiOptions.map((emi, index) => (
                        <div key={index} className="border rounded-lg p-4 flex justify-between items-center">
                          <div>
                            <h5 className="font-medium">{emi.months} Months EMI</h5>
                            <p className="text-sm text-gray-600">
                              ₹{emi.monthlyAmount.toLocaleString()}/month | Total: ₹{emi.totalAmount.toLocaleString()}
                            </p>
                            {emi.processingFee && emi.processingFee > 0 && (
                              <p className="text-xs text-gray-500">Processing Fee: ₹{emi.processingFee.toLocaleString()}</p>
                            )}
                            {emi.interestRate && emi.interestRate > 0 && (
                              <p className="text-xs text-gray-500">Interest Rate: {emi.interestRate}%</p>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant={emi.isActive ? "default" : "secondary"}>
                                {emi.isActive ? "Active" : "Inactive"}
                              </Badge>
                              <span className="text-xs text-gray-500">Order {emi.order}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleEditEMI(index)}>Edit</Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteEMI(index)}>Delete</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">No EMI options added yet.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Coupon Codes */}
            <Card>
              <CardHeader>
                <CardTitle>Coupon Codes</CardTitle>
                <CardDescription>Discount codes for promotional campaigns</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Add New Coupon */}
                <div className="border rounded-lg p-4 space-y-4">
                  <h4 className="font-medium">
                    {editingCouponId ? 'Edit Coupon Code' : 'Add New Coupon Code'}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="couponCode">Coupon Code</Label>
                      <Input
                        id="couponCode"
                        value={couponForm.code}
                        onChange={(e) => setCouponForm(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                        placeholder="SAVE20"
                      />
                    </div>
                    <div>
                      <Label htmlFor="couponDiscountType">Discount Type</Label>
                      <Select value={couponForm.discountType} onValueChange={(value: 'percentage' | 'fixed') => setCouponForm(prev => ({ ...prev, discountType: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percentage">Percentage (%)</SelectItem>
                          <SelectItem value="fixed">Fixed Amount (₹)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="couponDiscountValue">
                        Discount Value {couponForm.discountType === 'percentage' ? '(%)' : '(₹)'}
                      </Label>
                      <Input
                        id="couponDiscountValue"
                        type="number"
                        value={couponForm.discountValue}
                        onChange={(e) => setCouponForm(prev => ({ ...prev, discountValue: parseFloat(e.target.value) || 0 }))}
                        placeholder={couponForm.discountType === 'percentage' ? "20" : "5000"}
                      />
                    </div>
                    <div>
                      <Label htmlFor="couponMinimumAmount">Minimum Amount (₹)</Label>
                      <Input
                        id="couponMinimumAmount"
                        type="number"
                        value={couponForm.minimumAmount}
                        onChange={(e) => setCouponForm(prev => ({ ...prev, minimumAmount: parseFloat(e.target.value) || 0 }))}
                        placeholder="10000"
                      />
                    </div>
                    {couponForm.discountType === 'percentage' && (
                      <div>
                        <Label htmlFor="couponMaxDiscount">Maximum Discount (₹)</Label>
                        <Input
                          id="couponMaxDiscount"
                          type="number"
                          value={couponForm.maximumDiscount}
                          onChange={(e) => setCouponForm(prev => ({ ...prev, maximumDiscount: parseFloat(e.target.value) || 0 }))}
                          placeholder="10000"
                        />
                      </div>
                    )}
                    <div>
                      <Label htmlFor="couponUsageLimit">Usage Limit</Label>
                      <Input
                        id="couponUsageLimit"
                        type="number"
                        value={couponForm.usageLimit}
                        onChange={(e) => setCouponForm(prev => ({ ...prev, usageLimit: parseInt(e.target.value) || 0 }))}
                        placeholder="100"
                        min="1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="couponValidFrom">Valid From</Label>
                      <Input
                        id="couponValidFrom"
                        type="date"
                        value={couponForm.validFrom}
                        onChange={(e) => setCouponForm(prev => ({ ...prev, validFrom: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="couponValidUntil">Valid Until</Label>
                      <Input
                        id="couponValidUntil"
                        type="date"
                        value={couponForm.validUntil}
                        onChange={(e) => setCouponForm(prev => ({ ...prev, validUntil: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="couponOrder">Display Order</Label>
                      <Input
                        id="couponOrder"
                        type="number"
                        value={couponForm.order}
                        onChange={(e) => setCouponForm(prev => ({ ...prev, order: parseInt(e.target.value) || 1 }))}
                        min="1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="couponDescription">Description</Label>
                    <Textarea
                      id="couponDescription"
                      value={couponForm.description}
                      onChange={(e) => setCouponForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Back to school discount for new students"
                      rows={2}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="couponActive"
                      checked={couponForm.isActive}
                      onCheckedChange={(checked) => setCouponForm(prev => ({ ...prev, isActive: checked as boolean }))}
                    />
                    <Label htmlFor="couponActive">Active</Label>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      type="button" 
                      onClick={editingCouponId ? handleUpdateCoupon : handleAddCoupon}
                    >
                      {editingCouponId ? 'Update Coupon Code' : 'Add Coupon Code'}
                    </Button>
                    {editingCouponId && (
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={handleCancelCouponEdit}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>

                {/* Existing Coupon Codes */}
                <div className="space-y-4">
                  <h4 className="font-medium">Existing Coupon Codes</h4>
                  {program.feeStructure?.couponCodes && program.feeStructure.couponCodes.length > 0 ? (
                    <div className="space-y-3">
                      {program.feeStructure.couponCodes.map((coupon, index) => (
                        <div key={index} className="border rounded-lg p-4 flex justify-between items-start">
                          <div>
                            <h5 className="font-medium">{coupon.code}</h5>
                            <p className="text-sm text-gray-600">
                              {coupon.discountType === 'percentage' 
                                ? `${coupon.discountValue}% off` 
                                : `₹${coupon.discountValue.toLocaleString()} off`
                              }
                            </p>
                            {coupon.minimumAmount && coupon.minimumAmount > 0 && (
                              <p className="text-xs text-gray-500">Min. Amount: ₹{coupon.minimumAmount.toLocaleString()}</p>
                            )}
                            {coupon.discountType === 'percentage' && coupon.maximumDiscount && coupon.maximumDiscount > 0 && (
                              <p className="text-xs text-gray-500">Max. Discount: ₹{coupon.maximumDiscount.toLocaleString()}</p>
                            )}
                            <p className="text-xs text-gray-500">
                              Valid: {new Date(coupon.validFrom).toLocaleDateString()} - {new Date(coupon.validUntil).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-gray-500">
                              Used: {coupon.usedCount}/{coupon.usageLimit || '∞'}
                            </p>
                            {coupon.description && (
                              <p className="text-xs text-gray-600 mt-1">{coupon.description}</p>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant={coupon.isActive ? "default" : "secondary"}>
                                {coupon.isActive ? "Active" : "Inactive"}
                              </Badge>
                              <span className="text-xs text-gray-500">Order {coupon.order}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleEditCoupon(index)}>Edit</Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteCoupon(index)}>Delete</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">No coupon codes added yet.</p>
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
