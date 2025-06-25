import { apiClient, handleApiResponse } from '@/lib/api-config';

export type AdvisorInput = {
  name: string;
  src?: string;
  role: string;
  description: string;
};

export async function getAdvisors() {
  try {
    const response = await apiClient.get('/advisor/getadvisors');
    return handleApiResponse(response);
  } catch (error) {
    console.error('Error fetching advisors:', error);
    throw error;
  }
}

export async function getAdvisorById(id: string) {
  try {
    const response = await apiClient.get(`/advisor/getadvisorsbyid/${id}`);
    return handleApiResponse(response);
  } catch (error: any) {
    if (error.status === 404) {
      return null;
    }
    console.error('Error fetching advisor:', error);
    throw error;
  }
}

export async function deleteAdvisor(id: string) {
  try {
    await apiClient.delete(`/advisor/deleteadvisor/${id}`);
  } catch (error) {
    console.error('Error deleting advisor:', error);
    throw error;
  }
}

export async function updateAdvisor(id: string, data: any) {
  try {
    const response = await apiClient.put(`/advisor/updateadvisor/${id}`, data);
    return handleApiResponse(response);
  } catch (error) {
    console.error('Error updating advisor:', error);
    throw error;
  }
}

export async function createAdvisor(data: any) {
  try {
    const response = await apiClient.post('/advisor/addadvisor', data);
    return handleApiResponse(response);
  } catch (error) {
    console.error('Error creating advisor:', error);
    throw error;
  }
}

// Alias exports for backward compatibility
export const getadvisors = getAdvisors;
export const getadvisorById = getAdvisorById;
export const updateadvisorById = updateAdvisor;
export const deleteadvisorById = deleteAdvisor;
export const addadvisor = createAdvisor;
