"use client"

import DynamicTable from '@/components/dynamic-table'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getAdmissions, updateAdmissionStatus } from './apis'
import { generateAdmissionPDF } from '@/utils/pdf-generator'
import { toast } from 'sonner'
import { Download } from 'lucide-react'

type Admission = {
  _id: string;
  userId: string;
  status: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  submittedAt: string;
  paymentComplete: boolean;
  paymentStatus: string;
  applicationStatus: string;
  createdAt: string;
  updatedAt: string;
  applicationId: string;
  studentName: string;
  aadharCard?: string;
  aadharNumber?: string;
  campus?: string;
  city?: string;
  dateOfBirth?: string;
  diplomaInstitution?: string;
  diplomaPercentage?: string;
  diplomaStream?: string;
  diplomaYear?: string;
  fathersName?: string;
  fathersOccupation?: string;
  fathersPhone?: string;
  fathersQualification?: string;
  gender?: string;
  graduationPercentage?: string;
  graduationUniversity?: string;
  graduationYear?: string;
  localGuardianAddress?: string;
  localGuardianName?: string;
  localGuardianOccupation?: string;
  localGuardianPhone?: string;
  localGuardianRelation?: string;
  mothersName?: string;
  mothersOccupation?: string;
  mothersPhone?: string;
  mothersQualification?: string;
  parentsAddress?: string;
  parentsAnnualIncome?: number;
  permanentAddress?: string;
  pincode?: string;
  programCategory?: string;
  programName?: string;
  programType?: string;
  religion?: string;
  specialization?: string;
  state?: string;
  temporaryAddress?: string;
  tenthBoard?: string;
  tenthInstitution?: string;
  tenthPercentage?: string;
  tenthStream?: string;
  tenthYear?: string;
  twelfthBoard?: string;
  twelfthInstitution?: string;
  twelfthPercentage?: string;
  twelfthStream?: string;
  twelfthYear?: string;
  profilePhoto?: string;
  signature?: string;
  diplomaMarksheet?: string;
  tenthMarksheet?: string;
  twelfthMarksheet?: string;
  graduationMarksheet?: string;
  documents?: {
    randomDocuments: string[];
    tenthMarksheet?: string;
    twelfthMarksheet?: string;
    diplomaMarksheet?: string;
    graduationMarksheet?: string;
    signature?: string;
  };
}

// Type validation functions
const isValidPaymentStatus = (status: string): status is 'pending' | 'completed' | 'failed' => {
  return ['pending', 'completed', 'failed'].includes(status);
};

const isValidApplicationStatus = (status: string): status is 'pending' | 'approved' | 'rejected' | 'enrolled' => {
  return ['pending', 'approved', 'rejected', 'enrolled'].includes(status);
};

export default function AdmissionsPage() {
  const [admissions, setAdmissions] = useState<Admission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    enrolled: 0,
    rejected: 0
  })

  useEffect(() => {
    fetchAdmissions()
  }, [])

  const fetchAdmissions = async () => {
    try {
      setLoading(true)
      const data = await getAdmissions()
      
      console.log('Admissions data:', data)
      
      // Ensure data is an array
      const admissionsArray = Array.isArray(data) ? data : []
      
      // Validate and transform the data
      const validatedData = admissionsArray.map((admission: Admission) => ({
        ...admission,
        paymentStatus: isValidPaymentStatus(admission.paymentStatus) ? admission.paymentStatus : 'pending',
        applicationStatus: isValidApplicationStatus(admission.applicationStatus) ? admission.applicationStatus : 'pending'
      }))
      
      setAdmissions(validatedData)
      
      // Calculate stats
      const stats = {
        total: validatedData.length,
        pending: validatedData.filter(a => a.applicationStatus === 'pending').length,
        approved: validatedData.filter(a => a.applicationStatus === 'approved').length,
        enrolled: validatedData.filter(a => a.applicationStatus === 'enrolled').length,
        rejected: validatedData.filter(a => a.applicationStatus === 'rejected').length
      }
      setStats(stats)
    } catch (error) {
      console.error('Error fetching admissions:', error)
      setError('Failed to fetch admissions')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await updateAdmissionStatus(id, status)
      toast.success(`Status updated to ${status}`)
      fetchAdmissions() // Refresh data
    } catch (error) {
      toast.error('Failed to update status')
    }
  }

  const handleDownload = async (admission: Admission) => {
    try {
      toast.loading('Generating PDF...')
      await generateAdmissionPDF(admission)
      toast.dismiss()
      toast.success('PDF downloaded successfully!')
    } catch (error) {
      toast.dismiss()
      console.error('Error generating PDF:', error)
      toast.error('Failed to generate PDF')
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-blue-100 text-blue-800',
      enrolled: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    }
    return variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800'
  }

  const getPaymentBadge = (status: string) => {
    const variants = {
      pending: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800'
    }
    return variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800'
  }

  const mappedAdmissions = admissions.map((admission) => ({
    id: admission._id,
    studentName: admission.studentName || `${admission.firstName} ${admission.lastName}`,
    email: admission.email,
    phone: admission.phone,
    courseName: admission.programName || admission.programType || 'N/A',
    applicationId: admission.applicationId,
    paymentStatus: { 
      type: 'text' as const, 
      value: admission.paymentStatus 
    },
    applicationStatus: { 
      type: 'text' as const, 
      value: admission.applicationStatus 
    },
    submittedAt: new Date(admission.submittedAt).toLocaleDateString(),
    actions: { 
      type: 'custom' as const, 
      value: (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleDownload(admission)}
            className="flex items-center gap-1"
          >
            <Download className="h-3 w-3" />
            Download
          </Button>
        </div>
      )
    }
  }))

  if (loading) {
    return <div className="p-4">Loading admissions...</div>
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>
  }

  return (
    <div className="space-y-6">
      <div className='flex justify-between items-center'>
        <div className='text-2xl font-bold capitalize'>
          Admissions Management
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.approved}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enrolled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.enrolled}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
          </CardContent>
        </Card>
      </div>

      {/* Admissions Table */}
      <DynamicTable 
        data={mappedAdmissions}
        headers={[
          { key: 'studentName', label: 'Student Name' },
          { key: 'email', label: 'Email' },
          { key: 'phone', label: 'Phone' },
          { key: 'applicationId', label: 'Application ID' },
          { key: 'courseName', label: 'Program' },
          { key: 'paymentStatus', label: 'Payment Status' },
          { key: 'applicationStatus', label: 'Application Status' },
          { key: 'submittedAt', label: 'Applied On' },
          { key: 'actions', label: 'Actions', className: 'w-[200px]' }
        ]}
        url="/dashboard/admissions/view"
      />
    </div>
  )
} 