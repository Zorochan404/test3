"use client"

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { getFreeCourseById, type FreeCourse } from '../../apis'

export default function ViewFreeCoursePage() {
  const router = useRouter()
  const params = useParams()
  const courseId = params.id as string
  
  const [loading, setLoading] = useState(true)
  const [course, setCourse] = useState<FreeCourse | null>(null)

  useEffect(() => {
    loadCourse()
  }, [courseId])

  const loadCourse = async () => {
    try {
      setLoading(true)
      const courseData = await getFreeCourseById(courseId)
      
      if (!courseData) {
        toast.error('Course not found')
        router.push('/dashboard/webdata/free-courses')
        return
      }

      setCourse(courseData)
    } catch (error) {
      console.error('Error loading course:', error)
      toast.error('Failed to load course')
      router.push('/dashboard/webdata/free-courses')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading course...</div>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Course not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">View Free Course</h1>
          <p className="text-gray-600">Course details and information</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            Back
          </Button>
          <Button asChild>
            <a href={`/dashboard/webdata/free-courses/edit/${course._id}`}>
              Edit Course
            </a>
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Course Header */}
        <Card>
          <div className="aspect-video relative">
            <img
              src={course.imageUrl}
              alt={course.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder-image.svg';
              }}
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <Badge variant="secondary">
                {course.details?.[0]?.level || 'Beginner'}
              </Badge>
              <Badge variant={course.isActive ? 'default' : 'destructive'}>
                {course.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </div>
          <CardHeader>
            <CardTitle className="text-2xl">{course.name}</CardTitle>
            <CardDescription className="text-lg">
              {course.shortDescription}
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Course Details */}
        <Card>
          <CardHeader>
            <CardTitle>Course Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">Duration</Label>
                <p className="text-lg">{course.details?.[0]?.duration || 0} weeks</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Learning Mode</Label>
                <p className="text-lg">{course.details?.[0]?.mode || 'Online'}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Course Level</Label>
                <p className="text-lg">{course.details?.[0]?.level || 'Beginner'}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Certificate</Label>
                <p className="text-lg">{course.details?.[0]?.certificate || 'No'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Why Learn This Course */}
        <Card>
          <CardHeader>
            <CardTitle>Why Learn This Course</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              {course.whyLearnThisCourse}
            </p>
          </CardContent>
        </Card>

        {/* What You Will Learn */}
        <Card>
          <CardHeader>
            <CardTitle>What You Will Learn</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {course.whatYouWillLearn.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Career Opportunities */}
        <Card>
          <CardHeader>
            <CardTitle>Career Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              {course.careerOpportunities}
            </p>
          </CardContent>
        </Card>

        {/* Course Benefits */}
        <Card>
          <CardHeader>
            <CardTitle>Course Benefits</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {course.courseBenefits.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* SEO Information */}
        <Card>
          <CardHeader>
            <CardTitle>SEO Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-500">Meta Title</Label>
              <p className="text-gray-700">{course.metaTitle || 'Not set'}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Meta Description</Label>
              <p className="text-gray-700">{course.metaDescription || 'Not set'}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Meta Keywords</Label>
              <p className="text-gray-700">{course.metaKeywords || 'Not set'}</p>
            </div>
          </CardContent>
        </Card>

        {/* Course Metadata */}
        <Card>
          <CardHeader>
            <CardTitle>Course Metadata</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="text-sm font-medium text-gray-500">Created At</Label>
                <p className="text-gray-700">
                  {new Date(course.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Last Updated</Label>
                <p className="text-gray-700">
                  {new Date(course.updatedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Course ID</Label>
                <p className="text-gray-700 font-mono text-xs">{course._id}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Status</Label>
                <Badge variant={course.isActive ? 'default' : 'destructive'}>
                  {course.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Helper component for labels
function Label({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`text-sm font-medium text-gray-500 ${className}`}>{children}</div>
} 