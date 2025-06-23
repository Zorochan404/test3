import { API_BASE_URL, getApiHeaders } from '@/lib/api-config'

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
    const response = await fetch(`${API_BASE_URL}/enquiries`, {
      headers: getApiHeaders(),
    })
    
    if (!response.ok) {
      console.error('API Error:', response.status, response.statusText)
      throw new Error(`Failed to fetch enquiries: ${response.status} ${response.statusText}`)
    }
    
    const result = await response.json()
    console.log('Enquiries API Response:', result)
    
    if (result.success && result.data && Array.isArray(result.data)) {
      return result.data
    } else {
      console.error('Invalid API response format:', result)
      throw new Error('Invalid API response format')
    }
  } catch (error) {
    console.error('Error fetching enquiries:', error)
    throw error
  }
}

// Fetch enquiry by ID
export async function getEnquiryById(id: string): Promise<Enquiry | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/enquiries/${id}`, {
      headers: getApiHeaders(),
    })
    
    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      console.error('API Error:', response.status, response.statusText)
      throw new Error(`Failed to fetch enquiry: ${response.status} ${response.statusText}`)
    }
    
    const result = await response.json()
    console.log('Enquiry API Response:', result)
    
    if (result.success && result.data) {
      return result.data
    } else {
      console.error('Invalid API response format:', result)
      throw new Error('Invalid API response format')
    }
  } catch (error) {
    console.error('Error fetching enquiry:', error)
    throw error
  }
}

// Update enquiry status
export async function updateEnquiryStatus(id: string, data: UpdateEnquiryStatusData): Promise<Enquiry> {
  try {
    const response = await fetch(`${API_BASE_URL}/enquiries/${id}/status`, {
      method: 'PATCH',
      headers: {
        ...getApiHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    
    if (!response.ok) {
      console.error('API Error:', response.status, response.statusText)
      throw new Error(`Failed to update enquiry status: ${response.status} ${response.statusText}`)
    }
    
    const result = await response.json()
    console.log('Update Enquiry Status API Response:', result)
    
    if (result.success && result.data) {
      return result.data
    } else {
      console.error('Invalid API response format:', result)
      throw new Error('Invalid API response format')
    }
  } catch (error) {
    console.error('Error updating enquiry status:', error)
    throw error
  }
}

// Delete enquiry
export async function deleteEnquiry(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/enquiries/${id}`, {
      method: 'DELETE',
      headers: getApiHeaders(),
    })
    
    if (!response.ok) {
      console.error('API Error:', response.status, response.statusText)
      throw new Error(`Failed to delete enquiry: ${response.status} ${response.statusText}`)
    }
    
    const result = await response.json()
    console.log('Delete Enquiry API Response:', result)
    
    if (!result.success) {
      console.error('Invalid API response format:', result)
      throw new Error('Invalid API response format')
    }
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
    const response = await fetch(`${API_BASE_URL}/enquiries/stats`, {
      headers: getApiHeaders(),
    })
    
    if (!response.ok) {
      console.error('API Error:', response.status, response.statusText)
      throw new Error(`Failed to fetch enquiry stats: ${response.status} ${response.statusText}`)
    }
    
    const result = await response.json()
    console.log('Enquiry Stats API Response:', result)
    
    if (result.success && result.data) {
      return result.data
    } else {
      console.error('Invalid API response format:', result)
      throw new Error('Invalid API response format')
    }
  } catch (error) {
    console.error('Error fetching enquiry stats:', error)
    throw error
  }
} 