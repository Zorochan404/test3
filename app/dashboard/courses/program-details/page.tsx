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
      console.log('Fetching course programs from API...')
      const data = await getCoursePrograms()
      console.log('API Response data:', data)
      console.log('Number of programs found:', data.length)
      
      if (data && Array.isArray(data)) {
        setPrograms(data)
        if (data.length === 0) {
          toast.info('No course program details found. Create your first program details page.')
        } else {
          toast.success(`Loaded ${data.length} course program details`)
          console.log('Programs loaded:', data.map(p => ({ id: p._id, title: p.title, course: p.parentCourseTitle })))
        }
      } else {
        console.warn('API returned unexpected data format:', data)
        setPrograms([])
        toast.warning('No program details available - API returned unexpected format')
      }
    } catch (error) {
      console.error('Error loading programs:', error)
      toast.error(`Failed to load course program details: ${error instanceof Error ? error.message : 'Unknown error'}`)
      setPrograms([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return
    }

    try {
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
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-lg">Loading course program details...</div>
            <div className="text-sm text-gray-500 mt-2">Fetching data from API</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6">
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6'>
        <div className="flex-1 min-w-0">
          <h1 className='text-2xl sm:text-3xl font-bold break-words'>Course Program Details Management</h1>
          <p className='text-gray-600 mt-2 text-sm sm:text-base'>
            Manage detailed program pages like <span className="font-mono text-xs sm:text-sm bg-gray-100 px-2 py-1 rounded">/interior-design/bdes-in-interior-design</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Button variant="outline" asChild size="sm" className="flex-1 sm:flex-none">
            <Link href="/dashboard/courses/programs">
              Back to Programs
            </Link>
          </Button>
          <Button 
            variant="outline" 
            onClick={loadPrograms}
            disabled={loading}
            size="sm"
            className="flex-1 sm:flex-none"
          >
            {loading ? 'Loading...' : 'Refresh'}
          </Button>
          <Button asChild size="sm" className="flex-1 sm:flex-none">
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
              className="max-w-md w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Program Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {filteredPrograms.map((program) => (
          <Card key={program._id} className="hover:shadow-lg transition-shadow flex flex-col h-full overflow-hidden">
            <CardHeader className="relative flex-shrink-0">
              <div className="absolute top-2 right-2 z-10">
                <Badge variant={program.isActive ? 'default' : 'secondary'} className="text-xs">
                  {program.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <div className="aspect-video w-full mb-4 rounded-lg overflow-hidden bg-gray-100">
                {program.heroImage || program.imageUrl ? (
                  <img
                    src={program.heroImage || program.imageUrl}
                    alt={program.title || 'Program Image'}
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
              <CardTitle className="text-base sm:text-lg break-words line-clamp-2">{program.title || 'Untitled Program'}</CardTitle>
              <CardDescription className="text-xs sm:text-sm break-words">
                <span className="text-blue-600">{program.parentCourseTitle || 'Unknown Course'}</span> • {program.duration || 'Duration not set'}
              </CardDescription>
              <CardDescription className="text-xs text-gray-500 font-mono break-all">
                /{program.parentCourseSlug || 'unknown'}/{program.slug || 'unknown'}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col min-h-0 overflow-hidden">
              <p className="text-xs sm:text-sm text-gray-600 mb-4 line-clamp-3 flex-shrink-0">
                {program.shortDescription || program.description || 'No description available'}
              </p>
              
              <div className="space-y-1 sm:space-y-2 mb-4 flex-shrink-0">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-500">Curriculum:</span>
                  <span className="font-medium text-xs">{program.curriculum?.length || 0} years</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-500">Software:</span>
                  <span className="font-medium text-xs">{program.softwareTools?.length || 0} tools</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-500">Career Paths:</span>
                  <span className="font-medium text-xs">{program.careerPaths?.length || 0} paths</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-500">FAQs:</span>
                  <span className="font-medium text-xs">{program.faqs?.length || 0} questions</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 mt-auto w-full overflow-hidden">
                <Button size="sm" variant="outline" asChild className="flex-1 min-w-0 text-xs overflow-hidden">
                  <Link href={`/dashboard/courses/program-details/edit/${program._id}`} className="truncate">
                    Edit Details
                  </Link>
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  asChild
                  className="flex-1 min-w-0 text-xs overflow-hidden"
                >
                  <a 
                    href={`https://www.inframeschool.com/${program.parentCourseSlug || 'unknown'}/${program.slug || 'unknown'}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="truncate"
                  >
                    View Live
                  </a>
                </Button>
                {program._id && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(program._id!, program.title || 'Untitled Program')}
                    className="flex-1 sm:flex-none min-w-0 text-xs overflow-hidden"
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
