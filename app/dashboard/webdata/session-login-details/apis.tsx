import { apiClient, handleApiResponse } from '@/lib/api-config';

export type SessionLoginInput = {
  name: string;
  phoneNumber: string;
  email: string;
  city: string;
  course: string;
};

export async function getSessionLogins() {
  try {
    const response = await apiClient.get('/session/getsessionlogins');
    return handleApiResponse(response);
  } catch (error) {
    console.error('Error fetching session logins:', error);
    throw error;
  }
}

export async function getSessionLoginById(id: string) {
  try {
    const response = await apiClient.get(`/session/getsessionloginbyid/${id}`);
    return handleApiResponse(response);
  } catch (error: any) {
    if (error.status === 404) {
      return null;
    }
    console.error('Error fetching session login:', error);
    throw error;
  }
}

export async function deleteSessionLogin(id: string) {
  try {
    await apiClient.delete(`/session/deletesessionlogin/${id}`);
  } catch (error) {
    console.error('Error deleting session login:', error);
    throw error;
  }
}

export async function updateSessionLogin(id: string, data: any) {
  try {
    const response = await apiClient.put(`/session/updatesessionlogin/${id}`, data);
    return handleApiResponse(response);
  } catch (error) {
    console.error('Error updating session login:', error);
    throw error;
  }
}

export async function createSessionLogin(data: any) {
  try {
    const response = await apiClient.post('/session/addsessionlogin', data);
    return handleApiResponse(response);
  } catch (error) {
    console.error('Error creating session login:', error);
    throw error;
  }
}

// Alias exports for backward compatibility
export const updateSessionLoginById = updateSessionLogin;
export const deleteSessionLoginById = deleteSessionLogin;
export const addSessionLogin = createSessionLogin;
