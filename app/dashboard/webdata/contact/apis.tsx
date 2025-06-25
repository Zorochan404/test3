import { apiClient, handleApiResponse } from '@/lib/api-config';

export type ContactSubmission = {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  message: string;
  submittedAt?: string;
  status?: 'new' | 'read' | 'replied';
}

// Contact Submissions API
export async function getContacts() {
  try {
    const response = await apiClient.get('/contact/getcontacts');
    return handleApiResponse(response);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    throw error;
  }
}

export async function getContactById(id: string) {
  try {
    const response = await apiClient.get(`/contact/getcontactbyid/${id}`);
    return handleApiResponse(response);
  } catch (error: any) {
    if (error.status === 404) {
      return null;
    }
    console.error('Error fetching contact:', error);
    throw error;
  }
}

export async function createContact(data: any) {
  try {
    const response = await apiClient.post('/contact/addcontact', data);
    return handleApiResponse(response);
  } catch (error) {
    console.error('Error creating contact:', error);
    throw error;
  }
}

export async function updateContact(id: string, data: any) {
  try {
    const response = await apiClient.put(`/contact/updatecontact/${id}`, data);
    return handleApiResponse(response);
  } catch (error) {
    console.error('Error updating contact:', error);
    throw error;
  }
}

export async function deleteContact(id: string) {
  try {
    await apiClient.delete(`/contact/deletecontact/${id}`);
  } catch (error) {
    console.error('Error deleting contact:', error);
    throw error;
  }
}

// Mark contact as read
export async function markContactAsRead(id: string) {
    return updateContact(id, { status: 'read' });
}

// Mark contact as replied
export async function markContactAsReplied(id: string) {
    return updateContact(id, { status: 'replied' });
}

// Alias exports for backward compatibility
export const getContactSubmissions = getContacts;
export const deleteContactSubmission = deleteContact;
export const addContactSubmission = createContact;
