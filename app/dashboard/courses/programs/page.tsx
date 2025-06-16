"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import Link from 'next/link'

// For now, we'll use a simple interface. This should be moved to a separate API file later
interface CourseProgram {
  _id?: string;
  slug: string; // e.g., "bdes-in-interior-design"
  title: string; // e.g., "Bachelor of Design in Interior Design"
  courseSlug: string; // Parent course slug e.g., "interior-design"
  courseName: string; // Parent course name e.g., "Interior Design"
  duration: string;
  description: string;
  heroImage: string;
  curriculum: any[];
  software: any[];
  careerProspects: any[];
  admissionProcess: any[];
  eligibility: string;
  fees: string;
  isActive: boolean;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
}

export default function CourseProgramsPage() {
  const [programs, setPrograms] = useState<CourseProgram[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadPrograms()
  }, [])

  const loadPrograms = async () => {
    try {
      setLoading(true)
      // This would be replaced with actual API call
      // const data = await getCoursePrograms()
      
      // Mock data for now
      const mockPrograms: CourseProgram[] = [
        {
          _id: '1',
          slug: 'bdes-in-interior-design',
          title: 'Bachelor of Design in Interior Design',
          courseSlug: 'interior-design',
          courseName: 'Interior Design',
          duration: '4 Years Full-Time',
          description: 'Transform spaces and shape experiences through our comprehensive design program.',
          heroImage: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80',
          curriculum: [],
          software: [],
          careerProspects: [],
          admissionProcess: [],
          eligibility: '10+2 from any stream',
          fees: '₹2,50,000 per year',
          isActive: true
        },
        {
          _id: '2',
          slug: 'bvoc-in-interior-design',
          title: 'B.VOC in Interior Design',
          courseSlug: 'interior-design',
          courseName: 'Interior Design',
          duration: '3 Years Full-Time',
          description: 'Combine practical skills with theoretical knowledge in our vocational program.',
          heroImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6',
          curriculum: [],
          software: [],
          careerProspects: [],
          admissionProcess: [],
          eligibility: '10+2 from any stream',
          fees: '₹2,00,000 per year',
          isActive: true
        }
      ]
      
      setPrograms(mockPrograms)
    } catch (error) {
      console.error('Error loading programs:', error)
      toast.error('Failed to load course programs')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return
    }

    try {
      // await deleteCourseProgram(id)
      toast.success('Course program deleted successfully!')
      await loadPrograms()
    } catch (error) {
      console.error('Error deleting program:', error)
      toast.error('Failed to delete course program')
    }
  }

  const filteredPrograms = programs.filter(program =>
    program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    program.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
    program.courseName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading course programs...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className='flex justify-between items-center mb-6'>
        <div>
          <h1 className='text-3xl font-bold'>Course Programs Management</h1>
          <p className='text-gray-600 mt-2'>Manage individual course program pages like BDES Interior Design, B.VOC Fashion Design, etc.</p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/dashboard/courses/program-details">
              Manage Program Details
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/courses/programs/add">
              Add New Program
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
              placeholder="Search programs by title, slug, or course..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>
        </CardContent>
      </Card>

      {/* Programs Grid */}
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
                <span className="text-blue-600">{program.courseName}</span> • {program.duration}
              </CardDescription>
              <CardDescription className="text-xs text-gray-500">
                /{program.courseSlug}/{program.slug}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                {program.description}
              </p>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Eligibility:</span>
                  <span className="font-medium text-xs">{program.eligibility}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Fees:</span>
                  <span className="font-medium text-xs">{program.fees}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="outline" asChild className="flex-1">
                  <Link href={`/dashboard/courses/programs/edit/${program._id}`}>
                    Edit
                  </Link>
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  asChild
                >
                  <a 
                    href={`https://www.inframeschool.com/${program.courseSlug}/${program.slug}`} 
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">No course programs found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm ? 'No programs match your search criteria.' : 'Get started by creating your first course program.'}
            </p>
            <Button asChild>
              <Link href="/dashboard/courses/programs/add">
                Add New Program
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Course Programs Overview */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Course Programs Overview</CardTitle>
          <CardDescription>Understanding the course program system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">How It Works</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Each program has its own detailed page</li>
                <li>• URL structure: /course-slug/program-slug</li>
                <li>• Example: /interior-design/bdes-in-interior-design</li>
                <li>• Programs belong to parent courses</li>
                <li>• Detailed curriculum, software, and career info</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3">Program Page Structure</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Hero section with program details</li>
                <li>• Curriculum breakdown by year/semester</li>
                <li>• Software and tools taught</li>
                <li>• Career prospects and job roles</li>
                <li>• Admission process and eligibility</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
