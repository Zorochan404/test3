"use client"

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { getCareerPostById, getApplicantsForCareerPost, type CareerPost } from '../../apis'

export default function ViewCareerPage() {
  const router = useRouter()
  const params = useParams()
  const careerId = params.id as string
  
  const [loading, setLoading] = useState(true)
  const [career, setCareer] = useState<CareerPost | null>(null)

  useEffect(() => {
    loadCareer()
  }, [careerId])

  const loadCareer = async () => {
    try {
      setLoading(true)
      const careerData = await getCareerPostById(careerId)
      
      if (!careerData) {
        toast.error('Career post not found')
        router.push('/dashboard/webdata/careers')
        return
      }

      // Check if applicants are included, if not fetch them separately
      if (!careerData.applicants || careerData.applicants.length === 0) {
        try {
          const applicants = await getApplicantsForCareerPost(careerId)
          careerData.applicants = applicants
        } catch (error) {
          console.error('Error fetching applicants:', error)
          careerData.applicants = []
        }
      }

      setCareer(careerData)
    } catch (error) {
      console.error('Error loading career post:', error)
      toast.error('Failed to load career post')
      router.push('/dashboard/webdata/careers')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading career post...</div>
        </div>
      </div>
    )
  }

  if (!career) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Career post not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">View Career Post</h1>
          <p className="text-gray-600">Job posting details and information</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            Back
          </Button>
          <Button variant="outline" asChild>
            <a href={`/dashboard/webdata/careers/applicants/${career._id}`}>
              📄 View Applicants ({career.applicants?.length || 0})
            </a>
          </Button>
          <Button asChild>
            <a href={`/dashboard/webdata/careers/edit/${career._id}`}>
              Edit Career Post
            </a>
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Job Header */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <CardTitle className="text-2xl">{career.title}</CardTitle>
                <CardDescription className="text-lg mt-2">
                  📍 {career.place}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Badge variant="secondary">
                  {career.partTime ? 'Part Time' : 'Full Time'}
                </Badge>
                <Badge variant={career.isActive ? 'default' : 'destructive'}>
                  {career.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Job Description */}
        <Card>
          <CardHeader>
            <CardTitle>Job Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {career.description}
            </p>
          </CardContent>
        </Card>

        {/* Job Requirements */}
        <Card>
          <CardHeader>
            <CardTitle>Job Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {career.requirements.map((requirement, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">{requirement}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Job Details */}
        <Card>
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">Job Type</Label>
                <p className="text-lg">{career.partTime ? 'Part Time' : 'Full Time'}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Status</Label>
                <Badge variant={career.isActive ? 'default' : 'destructive'}>
                  {career.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Location</Label>
                <p className="text-lg">{career.place}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Requirements Count</Label>
                <p className="text-lg">{career.requirements.length} requirements</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Applicants Summary */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Applicants Summary</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <a href={`/dashboard/webdata/careers/applicants/${career._id}`}>
                  View All Applicants
                </a>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {career.applicants && career.applicants.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-sm">
                  <span className="font-medium text-gray-500">Total Applicants:</span>
                  <Badge variant="secondary">{career.applicants.length}</Badge>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'].map(status => {
                    const count = career.applicants?.filter(app => app.status === status).length || 0
                    return (
                      <div key={status} className="text-center">
                        <div className="text-lg font-semibold">{count}</div>
                        <div className="text-xs text-gray-500 capitalize">{status}</div>
                      </div>
                    )
                  })}
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-700 mb-2">Recent Applicants</h4>
                  <div className="space-y-2">
                    {career.applicants
                      .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime())
                      .slice(0, 3)
                      .map(applicant => (
                        <div key={applicant._id} className="flex justify-between items-center text-sm">
                          <div>
                            <span className="font-medium">{applicant.name}</span>
                            <span className="text-gray-500 ml-2">• {applicant.email}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {applicant.status}
                          </Badge>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500">No applicants yet</p>
                <p className="text-sm text-gray-400">Applicants will appear here once they apply</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Career Post Metadata */}
        <Card>
          <CardHeader>
            <CardTitle>Post Metadata</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="text-sm font-medium text-gray-500">Created At</Label>
                <p className="text-gray-700">
                  {new Date(career.createdAt).toLocaleDateString('en-US', {
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
                  {new Date(career.updatedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Career Post ID</Label>
                <p className="text-gray-700 font-mono text-xs">{career._id}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Version</Label>
                <p className="text-gray-700">{career.__v}</p>
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