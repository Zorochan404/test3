"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { toast } from 'sonner'
import {
  getFreeCourses,
  deleteFreeCourse,
  updateFreeCourseStatus,
  type FreeCourse
} from './apis'


export default function FreeCoursesPage() {
  const [courses, setCourses] = useState<FreeCourse[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')

  useEffect(() => {
    loadCourses()
  }, [])

  const loadCourses = async () => {
    try {
      setLoading(true)
      console.log('Fetching free courses...') // Debug log
      const coursesData = await getFreeCourses()
      console.log('Loaded free courses:', coursesData)
      console.log('Number of courses:', coursesData.length) // Debug log
      setCourses(coursesData)
    } catch (error) {
      console.error('Error loading free courses:', error)
      toast.error('Failed to load free courses. Please check if the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!id) {
      toast.error('Invalid course ID')
      return
    }

    if (!confirm('Are you sure you want to delete this course?')) return

    try {
      console.log('Deleting course with ID:', id)
      await deleteFreeCourse(id)
      toast.success('Course deleted successfully')
      loadCourses()
    } catch (error: unknown) {
      console.error('Error deleting course:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to delete course')
    }
  }

  const handleStatusUpdate = async (id: string, isActive: boolean) => {
    if (!id) {
      toast.error('Invalid course ID')
      return
    }

    try {
      await updateFreeCourseStatus(id, isActive)
      const statusMessage = isActive ? 'activated' : 'deactivated'
      toast.success(`Course ${statusMessage} successfully`)
      loadCourses()
    } catch (error: unknown) {
      console.error('Error updating course status:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to update course status')
    }
  }

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.shortDescription.toLowerCase().includes(searchTerm.toLowerCase())
    
    const courseLevel = course.details?.[0]?.level || 'Beginner'
    const matchesLevel = selectedLevel === 'all' || courseLevel.toLowerCase() === selectedLevel.toLowerCase()
    
    const matchesStatus = selectedStatus === 'all' || 
                         (selectedStatus === 'active' && course.isActive) ||
                         (selectedStatus === 'inactive' && !course.isActive)
    
    return matchesSearch && matchesLevel && matchesStatus
  })

  const levels = ['all', ...Array.from(new Set(courses.map(course => course.details?.[0]?.level || 'Beginner')))]
  const statuses = ['all', 'active', 'inactive']

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading free courses...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Free Courses Management</h1>
          <p className="text-gray-600">Manage free courses and learning materials</p>
        </div>
        <div className="flex gap-2">
         
          <Button variant="outline" asChild>
            <a href="https://www.inframeschool.com/free-courses" target="_blank" rel="noopener noreferrer">
              View Live
            </a>
          </Button>
          <Button asChild>
            <Link href="/dashboard/webdata/free-courses/add">
              Add New Course
            </Link>
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="w-full sm:w-48">
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
            >
              {levels.map(level => (
                <option key={level} value={level}>
                  {level === 'all' ? 'All Levels' : level}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full sm:w-48">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
            >
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <Card key={course._id} className="overflow-hidden group hover:shadow-lg transition-shadow">
            <div className="aspect-video relative">
              <img
                src={course.imageUrl}
                alt={course.name}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder-image.svg';
                }}
              />
              <div className="absolute top-2 left-2 flex gap-2">
                <Badge variant="secondary">
                  {course.details?.[0]?.level || 'Beginner'}
                </Badge>
                <Badge
                  variant={course.isActive ? 'default' : 'destructive'}
                >
                  {course.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>
            
            <CardHeader className="pb-3">
              <CardTitle className="text-lg line-clamp-2">{course.name}</CardTitle>
              <CardDescription className="line-clamp-2">
                {course.shortDescription}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>Duration: {course.details?.[0]?.duration || 0} weeks</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>Mode: {course.details?.[0]?.mode || 'Online'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>Certificate: {course.details?.[0]?.certificate || 'No'}</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild className="flex-1">
                  <Link href={`/dashboard/webdata/free-courses/view/${course._id}`}>
                    View
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild className="flex-1">
                  <Link href={`/dashboard/webdata/free-courses/edit/${course._id}`}>
                    Edit
                  </Link>
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => handleDelete(course._id)}
                  className="flex-1"
                >
                  Delete
                </Button>
              </div>
              
              <div className="mt-3">
                <Button
                  variant={course.isActive ? "destructive" : "default"}
                  size="sm"
                  onClick={() => handleStatusUpdate(course._id, !course.isActive)}
                  className="w-full"
                >
                  {course.isActive ? 'Deactivate' : 'Activate'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCourses.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No courses found</p>
          <p className="text-gray-400">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  )
} 