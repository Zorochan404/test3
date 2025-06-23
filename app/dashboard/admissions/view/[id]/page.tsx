"use client"

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, User, Phone, Mail, MapPin, GraduationCap, FileText, CreditCard, CheckCircle, XCircle, Clock } from 'lucide-react'
import { getAdmissionById, updateAdmissionStatus } from '../../apis'
import { toast } from 'sonner'

type AdmissionDetail = {
  _id: string;
  applicationId: string;
  studentName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  religion: string;
  aadharNumber: string;
  permanentAddress: string;
  temporaryAddress: string;
  city: string;
  state: string;
  pincode: string;
  fatherName: string;
  fatherPhone: string;
  fatherOccupation: string;
  fatherQualification: string;
  motherName: string;
  motherPhone: string;
  motherOccupation: string;
  motherQualification: string;
  parentsAnnualIncome: number;
  parentsAddress: string;
  localGuardianName: string;
  localGuardianPhone: string;
  localGuardianOccupation: string;
  localGuardianRelation: string;
  localGuardianAddress: string;
  tenthBoard: string;
  tenthInstitution: string;
  tenthStream: string;
  tenthPercentage: string;
  tenthYear: string;
  twelfthBoard: string;
  twelfthInstitution: string;
  twelfthStream: string;
  twelfthPercentage: string;
  twelfthYear: string;
  diplomaInstitution: string;
  diplomaStream: string;
  diplomaPercentage: string;
  diplomaYear: string;
  graduationUniversity: string;
  graduationPercentage: string;
  graduationYear: string;
  programCategory: string;
  programName: string;
  specialization: string;
  campus: string;
  programType: string;
  profilePhoto: string;
  signature: string;
  aadharCard: string;
  tenthMarksheet: string;
  twelfthMarksheet: string;
  diplomaMarksheet: string;
  graduationMarksheet: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
  applicationStatus: 'pending' | 'approved' | 'rejected' | 'enrolled';
  amount: number;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdmissionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [admission, setAdmission] = useState<AdmissionDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    const fetchAdmission = async () => {
      try {
        if (!params.id || typeof params.id !== 'string') {
          throw new Error('Invalid admission ID')
        }
        const data = await getAdmissionById(params.id)
        setAdmission(data as AdmissionDetail)
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message)
        } else {
          setError('Failed to fetch admission details')
        }
      } finally {
        setLoading(false)
      }
    }
    fetchAdmission()
  }, [params.id])

  const handleStatusUpdate = async (status: string) => {
    if (!admission) return
    try {
      setUpdating(true)
      await updateAdmissionStatus(admission._id, status)
      setAdmission(prev => prev ? { ...prev, applicationStatus: status as 'pending' | 'approved' | 'rejected' | 'enrolled' } : null)
      toast.success(`Status updated to ${status}`)
    } catch (error) {
      toast.error('Failed to update status')
    } finally {
      setUpdating(false)
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

  if (loading) return <div className="p-4">Loading admission details...</div>
  if (error || !admission) return <div className="p-4 text-red-500">{error || 'Admission not found'}</div>

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Admission Details</h1>
            <p className="text-gray-600">Application ID: {admission.applicationId}</p>
          </div>
        </div>
        
        {/* Status Actions */}
        <div className="flex gap-2">
          {admission.applicationStatus === 'pending' && (
            <>
              <Button onClick={() => handleStatusUpdate('approved')} disabled={updating} className="bg-blue-600 hover:bg-blue-700">
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve
              </Button>
              <Button onClick={() => handleStatusUpdate('rejected')} disabled={updating} variant="destructive">
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
            </>
          )}
          {admission.applicationStatus === 'approved' && (
            <Button onClick={() => handleStatusUpdate('enrolled')} disabled={updating} className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="h-4 w-4 mr-2" />
              Enroll
            </Button>
          )}
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Application Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className={getStatusBadge(admission.applicationStatus)}>
              {admission.applicationStatus.toUpperCase()}
            </Badge>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Payment Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className={getPaymentBadge(admission.paymentStatus)}>
              {admission.paymentStatus.toUpperCase()}
            </Badge>
            {admission.amount && <p className="text-sm text-gray-600 mt-1">₹{admission.amount}</p>}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Applied On
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{new Date(admission.createdAt).toLocaleDateString()}</p>
            <p className="text-xs text-gray-600">{new Date(admission.createdAt).toLocaleTimeString()}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Full Name</label>
                <p className="text-sm">{admission.studentName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <p className="text-sm flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {admission.email}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Phone</label>
                <p className="text-sm flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  {admission.phone}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Date of Birth</label>
                <p className="text-sm">{admission.dateOfBirth}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Gender</label>
                <p className="text-sm capitalize">{admission.gender}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Religion</label>
                <p className="text-sm capitalize">{admission.religion}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Aadhar Number</label>
                <p className="text-sm">{admission.aadharNumber}</p>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <label className="text-sm font-medium text-gray-600">Permanent Address</label>
              <p className="text-sm flex items-start gap-1">
                <MapPin className="h-3 w-3 mt-0.5" />
                {admission.permanentAddress}
              </p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">Temporary Address</label>
              <p className="text-sm flex items-start gap-1">
                <MapPin className="h-3 w-3 mt-0.5" />
                {admission.temporaryAddress}
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">City</label>
                <p className="text-sm capitalize">{admission.city}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">State</label>
                <p className="text-sm capitalize">{admission.state}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Pincode</label>
                <p className="text-sm">{admission.pincode}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Guardian Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Guardian Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-sm mb-2">Father's Details</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <label className="text-gray-600">Name</label>
                  <p>{admission.fatherName}</p>
                </div>
                <div>
                  <label className="text-gray-600">Phone</label>
                  <p>{admission.fatherPhone}</p>
                </div>
                <div>
                  <label className="text-gray-600">Occupation</label>
                  <p className="capitalize">{admission.fatherOccupation}</p>
                </div>
                <div>
                  <label className="text-gray-600">Qualification</label>
                  <p className="capitalize">{admission.fatherQualification}</p>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-medium text-sm mb-2">Mother's Details</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <label className="text-gray-600">Name</label>
                  <p>{admission.motherName}</p>
                </div>
                <div>
                  <label className="text-gray-600">Phone</label>
                  <p>{admission.motherPhone}</p>
                </div>
                <div>
                  <label className="text-gray-600">Occupation</label>
                  <p className="capitalize">{admission.motherOccupation}</p>
                </div>
                <div>
                  <label className="text-gray-600">Qualification</label>
                  <p className="capitalize">{admission.motherQualification}</p>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <label className="text-gray-600">Annual Income</label>
                <p>₹{admission.parentsAnnualIncome}</p>
              </div>
              <div>
                <label className="text-gray-600">Address</label>
                <p>{admission.parentsAddress}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Local Guardian */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Local Guardian Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <label className="text-gray-600">Name</label>
                <p>{admission.localGuardianName}</p>
              </div>
              <div>
                <label className="text-gray-600">Phone</label>
                <p>{admission.localGuardianPhone}</p>
              </div>
              <div>
                <label className="text-gray-600">Occupation</label>
                <p className="capitalize">{admission.localGuardianOccupation}</p>
              </div>
              <div>
                <label className="text-gray-600">Relation</label>
                <p className="capitalize">{admission.localGuardianRelation}</p>
              </div>
            </div>
            <div>
              <label className="text-gray-600">Address</label>
              <p className="text-sm">{admission.localGuardianAddress}</p>
            </div>
          </CardContent>
        </Card>

        {/* Academic Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Academic Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-sm mb-2">10th Standard</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <label className="text-gray-600">Board</label>
                  <p className="uppercase">{admission.tenthBoard}</p>
                </div>
                <div>
                  <label className="text-gray-600">Institution</label>
                  <p>{admission.tenthInstitution}</p>
                </div>
                <div>
                  <label className="text-gray-600">Stream</label>
                  <p className="capitalize">{admission.tenthStream}</p>
                </div>
                <div>
                  <label className="text-gray-600">Percentage</label>
                  <p>{admission.tenthPercentage}</p>
                </div>
                <div>
                  <label className="text-gray-600">Year</label>
                  <p>{admission.tenthYear}</p>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-medium text-sm mb-2">12th Standard</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <label className="text-gray-600">Board</label>
                  <p className="uppercase">{admission.twelfthBoard}</p>
                </div>
                <div>
                  <label className="text-gray-600">Institution</label>
                  <p>{admission.twelfthInstitution}</p>
                </div>
                <div>
                  <label className="text-gray-600">Stream</label>
                  <p className="capitalize">{admission.twelfthStream}</p>
                </div>
                <div>
                  <label className="text-gray-600">Percentage</label>
                  <p>{admission.twelfthPercentage}</p>
                </div>
                <div>
                  <label className="text-gray-600">Year</label>
                  <p>{admission.twelfthYear}</p>
                </div>
              </div>
            </div>
            
            {admission.diplomaInstitution && (
              <>
                <Separator />
                <div>
                  <h4 className="font-medium text-sm mb-2">Diploma</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <label className="text-gray-600">Institution</label>
                      <p>{admission.diplomaInstitution}</p>
                    </div>
                    <div>
                      <label className="text-gray-600">Stream</label>
                      <p className="capitalize">{admission.diplomaStream}</p>
                    </div>
                    <div>
                      <label className="text-gray-600">Percentage</label>
                      <p>{admission.diplomaPercentage}</p>
                    </div>
                    <div>
                      <label className="text-gray-600">Year</label>
                      <p>{admission.diplomaYear}</p>
                    </div>
                  </div>
                </div>
              </>
            )}
            
            {admission.graduationUniversity && (
              <>
                <Separator />
                <div>
                  <h4 className="font-medium text-sm mb-2">Graduation</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <label className="text-gray-600">University</label>
                      <p>{admission.graduationUniversity}</p>
                    </div>
                    <div>
                      <label className="text-gray-600">Percentage</label>
                      <p>{admission.graduationPercentage}</p>
                    </div>
                    <div>
                      <label className="text-gray-600">Year</label>
                      <p>{admission.graduationYear}</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Program Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Program Selection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <label className="text-gray-600">Program Category</label>
                <p className="capitalize">{admission.programCategory || 'N/A'}</p>
              </div>
              <div>
                <label className="text-gray-600">Program Name</label>
                <p className="uppercase">{admission.programName}</p>
              </div>
              <div>
                <label className="text-gray-600">Specialization</label>
                <p className="capitalize">{admission.specialization.replace('_', ' ')}</p>
              </div>
              <div>
                <label className="text-gray-600">Campus</label>
                <p className="capitalize">{admission.campus}</p>
              </div>
              <div>
                <label className="text-gray-600">Program Type</label>
                <p className="capitalize">{admission.programType}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documents */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Uploaded Documents
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-1 gap-2 text-sm">
              <div className="flex items-center justify-between">
                <span>Profile Photo</span>
                <Badge variant="outline" className="text-green-600">✅ Uploaded</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Signature</span>
                <Badge variant="outline" className="text-green-600">✅ Uploaded</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Aadhar Card</span>
                <Badge variant="outline" className="text-green-600">✅ Uploaded</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>10th Marksheet</span>
                <Badge variant="outline" className="text-green-600">✅ Uploaded</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>12th Marksheet</span>
                <Badge variant="outline" className="text-green-600">✅ Uploaded</Badge>
              </div>
              {admission.diplomaInstitution && (
                <div className="flex items-center justify-between">
                  <span>Diploma Marksheet</span>
                  <Badge variant="outline" className="text-green-600">✅ Uploaded</Badge>
                </div>
              )}
              {admission.graduationUniversity && (
                <div className="flex items-center justify-between">
                  <span>Graduation Marksheet</span>
                  <Badge variant="outline" className="text-green-600">✅ Uploaded</Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Details */}
      {admission.razorpayOrderId && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <label className="text-gray-600">Razorpay Order ID</label>
                <p className="font-mono">{admission.razorpayOrderId}</p>
              </div>
              {admission.razorpayPaymentId && (
                <div>
                  <label className="text-gray-600">Razorpay Payment ID</label>
                  <p className="font-mono">{admission.razorpayPaymentId}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
