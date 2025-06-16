"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import Link from 'next/link'
import { getCourses, deleteCourse, type Course } from './apis'

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadCourses()
  }, [])

  const loadCourses = async () => {
    try {
      setLoading(true)
      const data = await getCourses()
      setCourses(data)
    } catch (error) {
      console.error('Error loading courses:', error)
      toast.error('Failed to load courses')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return
    }

    try {
      await deleteCourse(id)
      toast.success('Course deleted successfully!')
      await loadCourses()
    } catch (error) {
      console.error('Error deleting course:', error)
      toast.error('Failed to delete course')
    }
  }

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.slug.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading courses...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className='flex justify-between items-center mb-6'>
        <div>
          <h1 className='text-3xl font-bold'>Course Management</h1>
          <p className='text-gray-600 mt-2'>Manage dynamic course pages like Interior Design, Fashion Design, etc.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/courses/program-details">
              Manage Program Details
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/courses/add">
              Add New Course
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
              placeholder="Search courses by title or slug..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>
        </CardContent>
      </Card>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <Card key={course._id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="relative">
              <div className="absolute top-2 right-2">
                <Badge variant={course.isActive ? 'default' : 'secondary'}>
                  {course.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <div className="aspect-video w-full mb-4 rounded-lg overflow-hidden bg-gray-100">
                {course.heroImage ? (
                  <img
                    src={course.heroImage}
                    alt={course.title}
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
              <CardTitle className="text-xl">{course.title}</CardTitle>
              <CardDescription className="text-sm text-gray-500">
                /{course.slug}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                {course.description}
              </p>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Programs:</span>
                  <span className="font-medium">{course.programs?.length || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Features:</span>
                  <span className="font-medium">{course.features?.length || 0}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="outline" asChild className="flex-1">
                  <Link href={`/dashboard/courses/edit/${course._id}`}>
                    Edit
                  </Link>
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  asChild
                >
                  <a 
                    href={`https://www.inframeschool.com/${course.slug}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    View Live
                  </a>
                </Button>
                {course._id && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(course._id!, course.title)}
                  >
                    Delete
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCourses.length === 0 && !loading && (
        <Card>
          <CardContent className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm ? 'No courses match your search criteria.' : 'Get started by creating your first course.'}
            </p>
            <Button asChild>
              <Link href="/dashboard/courses/add">
                Add New Course
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Course Management Overview */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Course Management Overview</CardTitle>
          <CardDescription>Understanding the dynamic course system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">How It Works</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Each course has a unique slug (e.g., &quot;interior-design&quot;)</li>
                <li>• The slug determines the URL: /interior-design</li>
                <li>• Content is dynamically loaded based on the slug</li>
                <li>• All courses share the same template structure</li>
                <li>• Easy to add new courses without code changes</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3">Course Structure</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Hero section with title and description</li>
                <li>• Programs list (degrees, diplomas, etc.)</li>
                <li>• Why choose features section</li>
                <li>• Call-to-action section</li>
                <li>• SEO metadata for search optimization</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
