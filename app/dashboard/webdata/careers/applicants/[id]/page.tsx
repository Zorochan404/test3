"use client"

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import {
  getCareerPostById,
  getApplicantsForCareerPost,
  removeApplicantFromCareerPost,
  updateApplicantStatus,
  type CareerPost,
  type Applicant
} from '../../apis'

export default function ApplicantsPage() {
  const router = useRouter()
  const params = useParams()
  const careerId = params.id as string
  
  const [loading, setLoading] = useState(true)
  const [career, setCareer] = useState<CareerPost | null>(null)
  const [applicants, setApplicants] = useState<Applicant[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')

  useEffect(() => {
    loadCareerAndApplicants()
  }, [careerId])

  const loadCareerAndApplicants = async () => {
    try {
      setLoading(true)
      const [careerData, applicantsData] = await Promise.all([
        getCareerPostById(careerId),
        getApplicantsForCareerPost(careerId)
      ])
      
      if (!careerData) {
        toast.error('Career post not found')
        router.push('/dashboard/webdata/careers')
        return
      }

      setCareer(careerData)
      setApplicants(applicantsData)
    } catch (error) {
      console.error('Error loading career and applicants:', error)
      toast.error('Failed to load applicants')
      router.push('/dashboard/webdata/careers')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (applicantId: string, newStatus: Applicant['status']) => {
    try {
      await updateApplicantStatus(careerId, applicantId, newStatus)
      toast.success('Applicant status updated successfully')
      loadCareerAndApplicants() // Reload to get updated data
    } catch (error) {
      console.error('Error updating applicant status:', error)
      toast.error('Failed to update applicant status')
    }
  }

  const handleRemoveApplicant = async (applicantId: string, applicantName: string) => {
    if (!confirm(`Are you sure you want to remove ${applicantName} from this career post?`)) {
      return
    }

    try {
      await removeApplicantFromCareerPost(careerId, applicantId)
      toast.success('Applicant removed successfully')
      loadCareerAndApplicants() // Reload to get updated data
    } catch (error) {
      console.error('Error removing applicant:', error)
      toast.error('Failed to remove applicant')
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

  const filteredApplicants = applicants.filter(applicant => {
    const matchesSearch = applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         applicant.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || applicant.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const statuses = ['all', 'pending', 'reviewed', 'shortlisted', 'rejected', 'hired']

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading applicants...</div>
        </div>
      </div>
    )
  }

  if (!career) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Career post not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Applicants for {career.title}</h1>
          <p className="text-gray-600">📍 {career.place} • {applicants.length} applicants</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            Back to Careers
          </Button>
          <Button variant="outline" asChild>
            <a href={`/dashboard/webdata/careers/view/${career._id}`}>
              View Job Post
            </a>
          </Button>
        </div>
      </div>

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
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild className="flex-1">
                    <a href={applicant.resumeUrl} target="_blank" rel="noopener noreferrer">
                      📄 View Resume
                    </a>
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => handleRemoveApplicant(applicant._id, applicant.name)}
                    className="flex-1"
                  >
                    Remove
                  </Button>
                </div>
                
                <Select 
                  value={applicant.status} 
                  onValueChange={(value: Applicant['status']) => handleStatusUpdate(applicant._id, value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="reviewed">Reviewed</SelectItem>
                    <SelectItem value="shortlisted">Shortlisted</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="hired">Hired</SelectItem>
                  </SelectContent>
                </Select>
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