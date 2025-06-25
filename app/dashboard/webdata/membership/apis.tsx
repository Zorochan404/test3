import { apiClient, handleApiResponse } from '@/lib/api-config';

export type MembershipInput = {
  name: string;
  src?: string;
};

export async function getMemberships() {
  try {
    const response = await apiClient.get('/membership/getMembership');
    return handleApiResponse(response);
  } catch (error) {
    console.error('Error fetching memberships:', error);
    throw error;
  }
}

export async function getMembershipById(id: string) {
  try {
    const response = await apiClient.get(`/membership/getMembershipById/${id}`);
    return handleApiResponse(response);
  } catch (error: any) {
    if (error.status === 404) {
      return null;
    }
    console.error('Error fetching membership:', error);
    throw error;
  }
}

export async function deleteMembership(id: string) {
  try {
    await apiClient.delete(`/membership/deleteMembership/${id}`);
  } catch (error) {
    console.error('Error deleting membership:', error);
    throw error;
  }
}

export async function updateMembership(id: string, data: any) {
  try {
    const response = await apiClient.put(`/membership/updateMembership/${id}`, data);
    return handleApiResponse(response);
  } catch (error) {
    console.error('Error updating membership:', error);
    throw error;
  }
}

export async function createMembership(data: any) {
  try {
    const response = await apiClient.post('/membership/addMembership', data);
    return handleApiResponse(response);
  } catch (error) {
    console.error('Error creating membership:', error);
    throw error;
  }
}

// Alias exports for backward compatibility
export const updateMembershipById = updateMembership;
export const deleteMembershipById = deleteMembership;
