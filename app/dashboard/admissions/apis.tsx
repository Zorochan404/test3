import { buildApiUrl, getApiHeaders, apiClient, handleApiResponse } from '@/lib/api-config';

// Placeholder API for admissions management
// TODO: Replace with real API endpoints when backend is ready

export async function getAdmissions() {
  try {
    const response = await apiClient.get('/admission/all');
    console.log('Raw API response:', response.data);
    
    // Handle the specific response structure from your API
    if (response.data.success && response.data.data) {
      return response.data.data;
    } else if (response.data.success === false) {
      throw new Error(response.data.message || 'API request failed');
    } else {
      // If no success field, assume the data is directly the result
      return response.data;
    }
  } catch (error) {
    console.error('Error fetching admissions:', error);
    throw error;
  }
}

export async function getAdmissionById(id: string) {
  try {
    const response = await apiClient.get(`/admission/${id}`);
    return handleApiResponse(response);
  } catch (error: any) {
    if (error.status === 404) {
      return null;
    }
    console.error('Error fetching admission:', error);
    throw error;
  }
}

export async function updateAdmissionStatus(id: string, status: string) {
  try {
    const response = await apiClient.put(`/admission/status/${id}`, { status });
    return handleApiResponse(response);
  } catch (error) {
    console.error('Error updating admission status:', error);
    throw error;
  }
}

// TODO: Add these functions when backend is ready:
// export async function createAdmission(data: AdmissionData) { ... }
// export async function deleteAdmission(id: string) { ... }
// export async function updateAdmission(id: string, data: AdmissionData) { ... } 