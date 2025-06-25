import { apiClient, handleApiResponse } from '@/lib/api-config'

export interface Enquiry {
  _id: string
  name: string
  phoneNumber: string
  email: string
  city: string
  course: string
  createdAt: string
  status: 'new' | 'contacted' | 'enrolled' | 'not-interested'
  message?: string
  source?: string
  updatedAt?: string
}

export interface UpdateEnquiryStatusData {
  status: 'new' | 'contacted' | 'enrolled' | 'not-interested'
  notes?: string
}

// Fetch all enquiries
export async function getEnquiries(): Promise<Enquiry[]> {
  try {
    const response = await apiClient.get('/enquiries')
    return handleApiResponse<Enquiry[]>(response)
  } catch (error) {
    console.error('Error fetching enquiries:', error)
    throw error
  }
}

// Fetch enquiry by ID
export async function getEnquiryById(id: string): Promise<Enquiry | null> {
  try {
    const response = await apiClient.get(`/enquiries/${id}`)
    return handleApiResponse<Enquiry>(response)
  } catch (error: any) {
    if (error.status === 404) {
      return null
    }
    console.error('Error fetching enquiry:', error)
    throw error
  }
}

// Update enquiry status
export async function updateEnquiryStatus(id: string, data: UpdateEnquiryStatusData): Promise<Enquiry> {
  try {
    const response = await apiClient.patch(`/enquiries/${id}/status`, data)
    return handleApiResponse<Enquiry>(response)
  } catch (error) {
    console.error('Error updating enquiry status:', error)
    throw error
  }
}

// Delete enquiry
export async function deleteEnquiry(id: string): Promise<void> {
  try {
    await apiClient.delete(`/enquiries/${id}`)
  } catch (error) {
    console.error('Error deleting enquiry:', error)
    throw error
  }
}

// Get enquiry statistics
export async function getEnquiryStats(): Promise<{
  total: number
  new: number
  contacted: number
  enrolled: number
  notInterested: number
}> {
  try {
    const response = await apiClient.get('/enquiries/stats')
    return handleApiResponse(response)
  } catch (error) {
    console.error('Error fetching enquiry stats:', error)
    throw error
  }
} 