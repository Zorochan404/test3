"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import {
  getAllApplicants,
  getAllCareerPostsWithApplicants,
  getApplicantsByStatus,
  type Applicant,
  type CareerPostWithApplicants
} from '../apis'

export default function AllApplicantsPage() {
  const router = useRouter()
  
  const [loading, setLoading] = useState(true)
  const [applicants, setApplicants] = useState<Applicant[]>([])
  const [careerPostsWithApplicants, setCareerPostsWithApplicants] = useState<CareerPostWithApplicants[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')

  useEffect(() => {
    loadApplicants()
  }, [selectedStatus])

  const loadApplicants = async () => {
    try {
      setLoading(true)
      let applicantsData: Applicant[]
      let careerPostsData: CareerPostWithApplicants[] = []
      
      if (selectedStatus === 'all') {
        // Get both applicants and career posts with applicants
        const [applicantsResult, careerPostsResult] = await Promise.all([
          getAllApplicants(),
          getAllCareerPostsWithApplicants()
        ])
        applicantsData = applicantsResult
        careerPostsData = careerPostsResult
      } else {
        applicantsData = await getApplicantsByStatus(selectedStatus as Applicant['status'])
      }
      
      setApplicants(applicantsData)
      setCareerPostsWithApplicants(careerPostsData)
    } catch (error) {
      console.error('Error loading applicants:', error)
      toast.error('Failed to load applicants')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: Applicant['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'reviewed': return 'bg-blue-100 text-blue-800'
      case 'shortlisted': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'hired': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCareerPostTitle = (applicantId: string): string => {
    for (const careerPost of careerPostsWithApplicants) {
      const foundApplicant = careerPost.applicants.find(app => app._id === applicantId)
      if (foundApplicant) {
        return careerPost.careerPostTitle
      }
    }
    return 'Unknown Position'
  }

  const filteredApplicants = applicants.filter(applicant => {
    return applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           applicant.email.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const statuses = ['all', 'pending', 'reviewed', 'shortlisted', 'rejected', 'hired']

  const statusCounts = statuses.reduce((acc, status) => {
    if (status === 'all') {
      acc[status] = applicants.length
    } else {
      acc[status] = applicants.filter(app => app.status === status).length
    }
    return acc
  }, {} as Record<string, number>)

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading applicants...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">All Applicants</h1>
          <p className="text-gray-600">Manage applicants across all career posts</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            Back to Careers
          </Button>
        </div>
      </div>

      {/* Status Overview */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Applicant Status Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {statuses.map(status => (
              <div key={status} className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{statusCounts[status]}</div>
                <div className="text-sm text-gray-500 capitalize">
                  {status === 'all' ? 'Total' : status}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Search and Filter */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search applicants by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="w-full sm:w-48">
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statuses.map(status => (
                  <SelectItem key={status} value={status}>
                    {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Applicants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredApplicants.map((applicant) => (
          <Card key={applicant._id} className="overflow-hidden group hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">{applicant.name}</CardTitle>
                  <CardDescription className="line-clamp-1">
                    📧 {applicant.email}
                  </CardDescription>
                  <p className="text-xs text-blue-600 mt-1">
                    🎯 Applied for: {getCareerPostTitle(applicant._id)}
                  </p>
                </div>
                <Badge className={getStatusColor(applicant.status)}>
                  {applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-3 mb-4">
                <div className="text-sm">
                  <span className="font-medium text-gray-500">📞 Phone:</span>
                  <p className="text-gray-700">{applicant.phone}</p>
                </div>
                
                <div className="text-sm">
                  <span className="font-medium text-gray-500">📅 Applied:</span>
                  <p className="text-gray-700">
                    {new Date(applicant.appliedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                
                <div className="text-sm">
                  <span className="font-medium text-gray-500">📄 Cover Letter:</span>
                  <p className="text-gray-700 line-clamp-3 text-xs">
                    {applicant.coverLetter}
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Button variant="outline" size="sm" asChild className="w-full">
                  <a href={applicant.resumeUrl} target="_blank" rel="noopener noreferrer">
                    📄 View Resume
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredApplicants.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No applicants found</p>
          <p className="text-gray-400">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  )
} 