"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { toast } from 'sonner'
import {
  getCareerPosts,
  getCareerPostsWithApplicants,
  getApplicantsForCareerPost,
  deleteCareerPost,
  toggleCareerPostStatus,
  type CareerPost
} from './apis'

export default function CareersPage() {
  const [careers, setCareers] = useState<CareerPost[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')

  useEffect(() => {
    loadCareers()
  }, [])

  const loadCareers = async () => {
    try {
      setLoading(true)
      console.log('Fetching career posts...') // Debug log
      
      // First try to get career posts with applicants populated
      let careersData = await getCareerPostsWithApplicants()
      console.log('Loaded career posts with applicants:', careersData)
      
      // Check if applicants are included in the response
      const hasApplicants = careersData.some(career => career.applicants && career.applicants.length > 0)
      
      if (!hasApplicants) {
        console.log('No applicants found in response, fetching separately...')
        // If no applicants in response, fetch them separately for each career
        const careersWithApplicants = await Promise.all(
          careersData.map(async (career) => {
            try {
              const applicants = await getApplicantsForCareerPost(career._id)
              return {
                ...career,
                applicants
              }
            } catch (error) {
              console.error(`Error fetching applicants for career ${career._id}:`, error)
              return {
                ...career,
                applicants: []
              }
            }
          })
        )
        careersData = careersWithApplicants
      }
      
      console.log('Final careers data:', careersData)
      console.log('Number of careers:', careersData.length) // Debug log
      
      // Debug: Check if applicants are included
      careersData.forEach((career, index) => {
        console.log(`Career ${index + 1}:`, {
          title: career.title,
          applicants: career.applicants,
          applicantsCount: career.applicants?.length || 0
        })
      })
      
      setCareers(careersData)
    } catch (error) {
      console.error('Error loading career posts:', error)
      toast.error('Failed to load career posts. Please check if the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!id) {
      toast.error('Invalid career post ID')
      return
    }

    if (!confirm('Are you sure you want to delete this career post?')) return

    try {
      console.log('Deleting career post with ID:', id)
      await deleteCareerPost(id)
      toast.success('Career post deleted successfully')
      loadCareers()
    } catch (error: unknown) {
      console.error('Error deleting career post:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to delete career post')
    }
  }

  const handleStatusToggle = async (id: string) => {
    if (!id) {
      toast.error('Invalid career post ID')
      return
    }

    try {
      await toggleCareerPostStatus(id)
      toast.success('Career post status updated successfully')
      loadCareers()
    } catch (error: unknown) {
      console.error('Error updating career post status:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to update career post status')
    }
  }

  const filteredCareers = careers.filter(career => {
    const matchesSearch = career.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         career.place.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         career.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = selectedType === 'all' || 
                       (selectedType === 'fulltime' && !career.partTime) ||
                       (selectedType === 'parttime' && career.partTime)
    
    const matchesStatus = selectedStatus === 'all' || 
                         (selectedStatus === 'active' && career.isActive) ||
                         (selectedStatus === 'inactive' && !career.isActive)
    
    return matchesSearch && matchesType && matchesStatus
  })

  const types = ['all', 'fulltime', 'parttime']
  const statuses = ['all', 'active', 'inactive']

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading career posts...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Careers Management</h1>
          <p className="text-gray-600">Manage job postings and career opportunities</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/webdata/careers/all-applicants">
              📄 All Applicants
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <a href="https://www.inframeschool.com/careers" target="_blank" rel="noopener noreferrer">
              View Live
            </a>
          </Button>
          <Button asChild>
            <Link href="/dashboard/webdata/careers/add">
              Add New Career
            </Link>
          </Button>
          
          
        </div>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search career posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="w-full sm:w-48">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
            >
              {types.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
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

      {/* Careers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCareers.map((career) => (
          <Card key={career._id} className="overflow-hidden group hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-2">{career.title}</CardTitle>
                  <CardDescription className="line-clamp-1">
                    📍 {career.place}
                  </CardDescription>
                </div>
                <div className="flex gap-1 ml-2">
                  <Badge variant="secondary">
                    {career.partTime ? 'Part Time' : 'Full Time'}
                  </Badge>
                  <Badge
                    variant={career.isActive ? 'default' : 'destructive'}
                  >
                    {career.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-3 mb-4">
                <p className="text-sm text-gray-600 line-clamp-3">
                  {career.description}
                </p>
                
                                 <div className="space-y-1">
                   <p className="text-xs font-medium text-gray-500">Requirements:</p>
                   <ul className="text-xs text-gray-600 space-y-1">
                     {career.requirements.slice(0, 2).map((req, index) => (
                       <li key={index} className="flex items-start gap-1">
                         <span className="text-blue-500 mt-1">•</span>
                         <span className="line-clamp-1">{req}</span>
                       </li>
                     ))}
                     {career.requirements.length > 2 && (
                       <li className="text-xs text-gray-500">
                         +{career.requirements.length - 2} more requirements
                       </li>
                     )}
                   </ul>
                 </div>
                 
                 <div className="flex items-center justify-between text-xs text-gray-500">
                   <span>📄 {career.applicants?.length || 0} applicants</span>
                   <span>{new Date(career.createdAt).toLocaleDateString()}</span>
                 </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild className="flex-1">
                  <Link href={`/dashboard/webdata/careers/view/${career._id}`}>
                    View
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild className="flex-1">
                  <Link href={`/dashboard/webdata/careers/edit/${career._id}`}>
                    Edit
                  </Link>
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => handleDelete(career._id)}
                  className="flex-1"
                >
                  Delete
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild className="w-full">
                  <Link href={`/dashboard/webdata/careers/applicants/${career._id}`}>
                    📄 Applicants ({career.applicants?.length || 0})
                  </Link>
                </Button>
              </div>
              
              <div className="mt-3">
                <Button
                  variant={career.isActive ? "destructive" : "default"}
                  size="sm"
                  onClick={() => handleStatusToggle(career._id)}
                  className="w-full"
                >
                  {career.isActive ? 'Deactivate' : 'Activate'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCareers.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No career posts found</p>
          <p className="text-gray-400">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  )
} 