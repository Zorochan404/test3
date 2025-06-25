import { buildApiUrl, getApiHeaders, apiClient, handleApiResponse } from '@/lib/api-config';

// Placeholder API for admissions management
// TODO: Replace with real API endpoints when backend is ready

export async function getAdmissions() {
  try {
    const response = await apiClient.get('/admissions/getadmissions');
    return handleApiResponse(response);
  } catch (error) {
    console.error('Error fetching admissions:', error);
    throw error;
  }
}

export async function getAdmissionById(id: string) {
  try {
    const response = await apiClient.get(`/admissions/getadmissionbyid/${id}`);
    return handleApiResponse(response);
  } catch (error: any) {
    if (error.status === 404) {
      return null;
    }
    console.error('Error fetching admission:', error);
    throw error;
  }
}

export async function updateAdmissionStatus(id: string, data: any) {
  try {
    const response = await apiClient.patch(`/admissions/updatestatus/${id}`, data);
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