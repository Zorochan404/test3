"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import Link from 'next/link'
import { getCoursePrograms, deleteCourseProgram, type CourseProgram } from './apis'

export default function CourseProgramDetailsPage() {
  const [programs, setPrograms] = useState<CourseProgram[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadPrograms()
  }, [])

  const loadPrograms = async () => {
    try {
      setLoading(true)
      const data = await getCoursePrograms()
      
      // Mock data for demonstration - replace with actual API call
      const mockPrograms: CourseProgram[] = [
        {
          _id: '1',
          slug: 'bdes-in-interior-design',
          title: 'Bachelor of Design in Interior Design',
          parentCourseSlug: 'interior-design',
          parentCourseTitle: 'Interior Design',
          heroImage: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=1600&q=80',
          duration: '4 Years Full-Time',
          description: 'Transform spaces and shape experiences through our comprehensive design program. Learn from industry experts and build a successful career in interior design.',
          shortDescription: 'Comprehensive 4-year program in interior design',
          courseOverview: 'The Bachelor of Design (B.Des) in Interior Design is a four-year full-time program designed to provide students with an in-depth understanding of interior spaces, aesthetics, and functionality.',
          imageUrl: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=800&q=80',
          detailsUrl: '/interior-design/bdes-in-interior-design',
          order: 1,
          admissionSteps: [],
          galleryImages: [],
          programHighlights: [],
          careerPaths: [],
          curriculum: [],
          softwareTools: [],
          industryPartners: [],
          testimonials: [],
          faqs: [],
          feeBenefits: [],
          eligibility: [],
          scheduleOptions: [],
          ctaTitle: 'Step into the World of Interior Design',
          ctaDescription: 'Apply now and start your journey',
          ctaButtonText: 'Apply Now',
          isActive: true
        },
        {
          _id: '2',
          slug: 'bvoc-in-interior-design',
          title: 'B.VOC in Interior Design',
          parentCourseSlug: 'interior-design',
          parentCourseTitle: 'Interior Design',
          heroImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1600&q=80',
          duration: '3 Years Full-Time',
          description: 'Combine practical skills with theoretical knowledge in our vocational program.',
          shortDescription: 'Practical 3-year vocational program',
          courseOverview: 'The B.VOC in Interior Design is a three-year vocational program focusing on practical skills and industry readiness.',
          imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80',
          detailsUrl: '/interior-design/bvoc-in-interior-design',
          order: 2,
          admissionSteps: [],
          galleryImages: [],
          programHighlights: [],
          careerPaths: [],
          curriculum: [],
          softwareTools: [],
          industryPartners: [],
          testimonials: [],
          faqs: [],
          feeBenefits: [],
          eligibility: [],
          scheduleOptions: [],
          ctaTitle: 'Start Your Vocational Journey',
          ctaDescription: 'Join our practical program',
          ctaButtonText: 'Apply Now',
          isActive: true
        }
      ]
      
      setPrograms(mockPrograms)
    } catch (error) {
      console.error('Error loading programs:', error)
      toast.error('Failed to load course program details')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return
    }

    try {
      // For now, we'll use a placeholder courseId since we don't have the actual courseId
      // In a real implementation, you'd need to get the courseId from the program data
      const program = programs.find(p => p._id === id)
      if (!program) {
        throw new Error('Program not found')
      }

      // Use the parent course slug as courseId for now
      await deleteCourseProgram(program.parentCourseSlug, id)
      toast.success('Course program details deleted successfully!')
      await loadPrograms()
    } catch (error) {
      console.error('Error deleting program:', error)
      toast.error('Failed to delete course program details')
    }
  }

  const filteredPrograms = programs.filter(program =>
    program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    program.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
    program.parentCourseTitle.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading course program details...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className='flex justify-between items-center mb-6'>
        <div>
          <h1 className='text-3xl font-bold'>Course Program Details Management</h1>
          <p className='text-gray-600 mt-2'>
            Manage detailed program pages like <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">/interior-design/bdes-in-interior-design</span>
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/courses/programs">
              Back to Programs
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/courses/program-details/add">
              Add Program Details
            </Link>
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="Search program details by title, slug, or course..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>
        </CardContent>
      </Card>

      {/* Program Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPrograms.map((program) => (
          <Card key={program._id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="relative">
              <div className="absolute top-2 right-2">
                <Badge variant={program.isActive ? 'default' : 'secondary'}>
                  {program.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <div className="aspect-video w-full mb-4 rounded-lg overflow-hidden bg-gray-100">
                {program.heroImage ? (
                  <img
                    src={program.heroImage}
                    alt={program.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-image.svg';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>
              <CardTitle className="text-lg">{program.title}</CardTitle>
              <CardDescription className="text-sm">
                <span className="text-blue-600">{program.parentCourseTitle}</span> • {program.duration}
              </CardDescription>
              <CardDescription className="text-xs text-gray-500 font-mono">
                /{program.parentCourseSlug}/{program.slug}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                {program.shortDescription || program.description}
              </p>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Curriculum:</span>
                  <span className="font-medium text-xs">{program.curriculum?.length || 0} years</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Software:</span>
                  <span className="font-medium text-xs">{program.softwareTools?.length || 0} tools</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Career Paths:</span>
                  <span className="font-medium text-xs">{program.careerPaths?.length || 0} paths</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">FAQs:</span>
                  <span className="font-medium text-xs">{program.faqs?.length || 0} questions</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="outline" asChild className="flex-1">
                  <Link href={`/dashboard/courses/program-details/edit/${program._id}`}>
                    Edit Details
                  </Link>
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  asChild
                >
                  <a 
                    href={`https://www.inframeschool.com/${program.parentCourseSlug}/${program.slug}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    View Live
                  </a>
                </Button>
                {program._id && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(program._id!, program.title)}
                  >
                    Delete
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPrograms.length === 0 && !loading && (
        <Card>
          <CardContent className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No program details found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm ? 'No program details match your search criteria.' : 'Get started by creating your first program details page.'}
            </p>
            <Button asChild>
              <Link href="/dashboard/courses/program-details/add">
                Add Program Details
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Program Details Overview */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Program Details Overview</CardTitle>
          <CardDescription>Understanding the detailed program page system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Page Structure</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Hero section with program overview</li>
                <li>• Admission process with steps</li>
                <li>• Program highlights and benefits</li>
                <li>• Detailed curriculum by year/semester</li>
                <li>• Software and tools taught</li>
                <li>• Career prospects and job roles</li>
                <li>• Industry partners and placements</li>
                <li>• Student testimonials</li>
                <li>• Frequently asked questions</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3">Content Management</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Complete page content editing</li>
                <li>• Image uploads for all sections</li>
                <li>• Dynamic curriculum management</li>
                <li>• Software tools with logos</li>
                <li>• Industry partner logos</li>
                <li>• SEO optimization fields</li>
                <li>• Live preview functionality</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
