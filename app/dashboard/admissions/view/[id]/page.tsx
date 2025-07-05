"use client"

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, User, Phone, Mail, MapPin, GraduationCap, FileText, CreditCard, CheckCircle, XCircle, Clock, Download } from 'lucide-react'
import { getAdmissionById, updateAdmissionStatus } from '../../apis'
import { generateAdmissionPDF } from '@/utils/pdf-generator'
import { toast } from 'sonner'

type AdmissionDetail = {
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
        const response = await getAdmissionById(params.id)
        setAdmission(response.data || response as AdmissionDetail)
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
      setAdmission(prev => prev ? { ...prev, applicationStatus: status } : null)
      toast.success(`Status updated to ${status}`)
    } catch (error) {
      toast.error('Failed to update status')
    } finally {
      setUpdating(false)
    }
  }

  const handleDownload = async () => {
    if (!admission) return
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
          <Button
            variant="outline"
            onClick={handleDownload}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
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
            {admission.paymentComplete && <p className="text-sm text-gray-600 mt-1">Payment Complete</p>}
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
            <p className="text-sm">{new Date(admission.submittedAt).toLocaleDateString()}</p>
            <p className="text-xs text-gray-600">{new Date(admission.submittedAt).toLocaleTimeString()}</p>
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
                <p className="text-sm">{admission.studentName || `${admission.firstName} ${admission.lastName}`}</p>
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
                <p className="text-sm">{admission.dateOfBirth ? new Date(admission.dateOfBirth).toLocaleDateString() : 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Gender</label>
                <p className="text-sm capitalize">{admission.gender || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Religion</label>
                <p className="text-sm capitalize">{admission.religion || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Aadhar Number</label>
                <p className="text-sm">{admission.aadharNumber || 'N/A'}</p>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <label className="text-sm font-medium text-gray-600">Permanent Address</label>
              <p className="text-sm flex items-start gap-1">
                <MapPin className="h-3 w-3 mt-0.5" />
                {admission.permanentAddress || 'N/A'}
              </p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">Temporary Address</label>
              <p className="text-sm flex items-start gap-1">
                <MapPin className="h-3 w-3 mt-0.5" />
                {admission.temporaryAddress || 'N/A'}
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">City</label>
                <p className="text-sm capitalize">{admission.city || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">State</label>
                <p className="text-sm capitalize">{admission.state || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Pincode</label>
                <p className="text-sm">{admission.pincode || 'N/A'}</p>
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
                  <p>{admission.fathersName || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-gray-600">Phone</label>
                  <p>{admission.fathersPhone || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-gray-600">Occupation</label>
                  <p className="capitalize">{admission.fathersOccupation || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-gray-600">Qualification</label>
                  <p className="capitalize">{admission.fathersQualification || 'N/A'}</p>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-medium text-sm mb-2">Mother's Details</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <label className="text-gray-600">Name</label>
                  <p>{admission.mothersName || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-gray-600">Phone</label>
                  <p>{admission.mothersPhone || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-gray-600">Occupation</label>
                  <p className="capitalize">{admission.mothersOccupation || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-gray-600">Qualification</label>
                  <p className="capitalize">{admission.mothersQualification || 'N/A'}</p>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <label className="text-gray-600">Annual Income</label>
                <p>₹{admission.parentsAnnualIncome || 'N/A'}</p>
              </div>
              <div>
                <label className="text-gray-600">Address</label>
                <p>{admission.parentsAddress || 'N/A'}</p>
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
                <p>{admission.localGuardianName || 'N/A'}</p>
              </div>
              <div>
                <label className="text-gray-600">Phone</label>
                <p>{admission.localGuardianPhone || 'N/A'}</p>
              </div>
              <div>
                <label className="text-gray-600">Occupation</label>
                <p className="capitalize">{admission.localGuardianOccupation || 'N/A'}</p>
              </div>
              <div>
                <label className="text-gray-600">Relation</label>
                <p className="capitalize">{admission.localGuardianRelation || 'N/A'}</p>
              </div>
            </div>
            <div>
              <label className="text-gray-600">Address</label>
              <p className="text-sm">{admission.localGuardianAddress || 'N/A'}</p>
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
                  <p className="uppercase">{admission.tenthBoard || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-gray-600">Institution</label>
                  <p>{admission.tenthInstitution || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-gray-600">Stream</label>
                  <p className="capitalize">{admission.tenthStream || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-gray-600">Percentage</label>
                  <p>{admission.tenthPercentage || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-gray-600">Year</label>
                  <p>{admission.tenthYear || 'N/A'}</p>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-medium text-sm mb-2">12th Standard</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <label className="text-gray-600">Board</label>
                  <p className="uppercase">{admission.twelfthBoard || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-gray-600">Institution</label>
                  <p>{admission.twelfthInstitution || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-gray-600">Stream</label>
                  <p className="capitalize">{admission.twelfthStream || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-gray-600">Percentage</label>
                  <p>{admission.twelfthPercentage || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-gray-600">Year</label>
                  <p>{admission.twelfthYear || 'N/A'}</p>
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
                      <p className="capitalize">{admission.diplomaStream || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-gray-600">Percentage</label>
                      <p>{admission.diplomaPercentage || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-gray-600">Year</label>
                      <p>{admission.diplomaYear || 'N/A'}</p>
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
                      <p>{admission.graduationPercentage || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-gray-600">Year</label>
                      <p>{admission.graduationYear || 'N/A'}</p>
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
                <p className="uppercase">{admission.programName || 'N/A'}</p>
              </div>
              <div>
                <label className="text-gray-600">Specialization</label>
                <p className="capitalize">{admission.specialization ? admission.specialization.replace('_', ' ') : 'N/A'}</p>
              </div>
              <div>
                <label className="text-gray-600">Campus</label>
                <p className="capitalize">{admission.campus || 'N/A'}</p>
              </div>
              <div>
                <label className="text-gray-600">Program Type</label>
                <p className="capitalize">{admission.programType || 'N/A'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <label className="text-gray-600">Payment Status</label>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={getPaymentBadge(admission.paymentStatus)}>
                    {admission.paymentStatus.toUpperCase()}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-gray-600">Payment Complete</label>
                <p className="mt-1">
                  {admission.paymentComplete ? (
                    <Badge className="bg-green-100 text-green-800">Yes</Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-800">No</Badge>
                  )}
                </p>
              </div>
              <div>
                <label className="text-gray-600">Application Status</label>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={getStatusBadge(admission.applicationStatus)}>
                    {admission.applicationStatus.toUpperCase()}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-gray-600">Application ID</label>
                <p className="font-mono text-sm mt-1">{admission.applicationId}</p>
              </div>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <label className="text-gray-600">Submitted Date</label>
                <p className="mt-1">{new Date(admission.submittedAt).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="text-gray-600">Submitted Time</label>
                <p className="mt-1">{new Date(admission.submittedAt).toLocaleTimeString()}</p>
              </div>
              <div>
                <label className="text-gray-600">Created Date</label>
                <p className="mt-1">{new Date(admission.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="text-gray-600">Last Updated</label>
                <p className="mt-1">{new Date(admission.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Additional Payment Information */}
            <Separator />
            
            <div>
              <h4 className="font-medium text-sm mb-3">Payment Summary</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Application Fee Status:</span>
                    <span className={`font-medium ${admission.paymentComplete ? 'text-green-600' : 'text-red-600'}`}>
                      {admission.paymentComplete ? 'Paid' : 'Pending'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="font-medium">
                      {admission.paymentStatus === 'completed' ? 'Online Payment' : 'Not Specified'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Application Processing:</span>
                    <span className={`font-medium ${
                      admission.applicationStatus === 'pending' ? 'text-yellow-600' :
                      admission.applicationStatus === 'approved' ? 'text-blue-600' :
                      admission.applicationStatus === 'enrolled' ? 'text-green-600' :
                      'text-red-600'
                    }`}>
                      {admission.applicationStatus.charAt(0).toUpperCase() + admission.applicationStatus.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Instructions */}
            {admission.paymentStatus === 'pending' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-sm text-yellow-800 mb-2">Payment Instructions</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Complete the payment to proceed with your application</li>
                  <li>• Payment can be made through the provided payment gateway</li>
                  <li>• Application will be processed after payment confirmation</li>
                  <li>• Contact support if you face any payment issues</li>
                </ul>
              </div>
            )}

            {/* Payment Success Message */}
            {admission.paymentComplete && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-sm text-green-800 mb-2">Payment Confirmed</h4>
                <p className="text-sm text-green-700">
                  Payment has been successfully processed. Your application is now under review.
                </p>
              </div>
            )}
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
                <Badge variant="outline" className={admission.profilePhoto ? "text-green-600" : "text-red-600"}>
                  {admission.profilePhoto ? "✅ Uploaded" : "❌ Not Uploaded"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Signature</span>
                <Badge variant="outline" className={admission.signature ? "text-green-600" : "text-red-600"}>
                  {admission.signature ? "✅ Uploaded" : "❌ Not Uploaded"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Aadhar Card</span>
                <Badge variant="outline" className={admission.aadharCard ? "text-green-600" : "text-red-600"}>
                  {admission.aadharCard ? "✅ Uploaded" : "❌ Not Uploaded"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>10th Marksheet</span>
                <Badge variant="outline" className={admission.tenthMarksheet ? "text-green-600" : "text-red-600"}>
                  {admission.tenthMarksheet ? "✅ Uploaded" : "❌ Not Uploaded"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>12th Marksheet</span>
                <Badge variant="outline" className={admission.twelfthMarksheet ? "text-green-600" : "text-red-600"}>
                  {admission.twelfthMarksheet ? "✅ Uploaded" : "❌ Not Uploaded"}
                </Badge>
              </div>
              {admission.diplomaInstitution && (
                <div className="flex items-center justify-between">
                  <span>Diploma Marksheet</span>
                  <Badge variant="outline" className={admission.diplomaMarksheet ? "text-green-600" : "text-red-600"}>
                    {admission.diplomaMarksheet ? "✅ Uploaded" : "❌ Not Uploaded"}
                  </Badge>
                </div>
              )}
              {admission.graduationUniversity && (
                <div className="flex items-center justify-between">
                  <span>Graduation Marksheet</span>
                  <Badge variant="outline" className={admission.graduationMarksheet ? "text-green-600" : "text-red-600"}>
                    {admission.graduationMarksheet ? "✅ Uploaded" : "❌ Not Uploaded"}
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
