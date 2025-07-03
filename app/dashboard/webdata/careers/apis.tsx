// Careers API functions and types

export interface Applicant {
  _id: string;
  name: string;
  email: string;
  phone: string;
  resumeUrl: string;
  coverLetter: string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'hired';
  appliedAt: string;
}

export interface CareerPostData {
  title: string;
  place: string;
  description: string;
  requirements: string[];
  partTime: boolean;
  isActive: boolean;
}

export interface CareerPost extends CareerPostData {
  _id: string;
  applicants?: Applicant[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CareerPostWithApplicants {
  careerPostId: string;
  careerPostTitle: string;
  applicants: Applicant[];
  totalApplicants: number;
}

import { apiClient, handleApiResponse } from '@/lib/api-config';

// API Functions
export async function getCareerPosts(): Promise<CareerPost[]> {
  try {
    const response = await apiClient.get('/career-posts/getallcareerposts');
    console.log('Raw API response:', response); // Debug log
    
    // Try different response structures
    let careers: CareerPost[] = [];
    
    if (response.data && Array.isArray(response.data)) {
      // Direct array response
      careers = response.data;
    } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
      // Nested data structure
      careers = response.data.data;
    } else if (response.data && response.data.success && response.data.data && Array.isArray(response.data.data)) {
      // Success wrapper with data
      careers = response.data.data;
    } else {
      console.warn('Unexpected response structure:', response);
      careers = [];
    }
    
    console.log('Processed careers:', careers); // Debug log
    return careers;
  } catch (error) {
    console.error('Error fetching career posts:', error);
    throw error;
  }
}

export async function getCareerPostsWithApplicants(): Promise<CareerPost[]> {
  try {
    // Try to get career posts with applicants populated
    const response = await apiClient.get('/career-posts/getallcareerposts?populate=applicants');
    console.log('Raw API response with applicants:', response); // Debug log
    
    // Try different response structures
    let careers: CareerPost[] = [];
    
    if (response.data && Array.isArray(response.data)) {
      careers = response.data;
    } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
      careers = response.data.data;
    } else if (response.data && response.data.success && response.data.data && Array.isArray(response.data.data)) {
      careers = response.data.data;
    } else {
      console.warn('Unexpected response structure with applicants:', response);
      careers = [];
    }
    
    console.log('Processed careers with applicants:', careers); // Debug log
    return careers;
  } catch (error) {
    console.error('Error fetching career posts with applicants:', error);
    // Fallback to regular getCareerPosts
    return getCareerPosts();
  }
}

export async function getActiveCareerPosts(): Promise<CareerPost[]> {
  try {
    const response = await apiClient.get('/career-posts/getactivecareerposts');
    const result = handleApiResponse<{ data: CareerPost[] }>(response);
    return result.data || [];
  } catch (error) {
    console.error('Error fetching active career posts:', error);
    throw error;
  }
}

export async function getCareerPostById(id: string): Promise<CareerPost | null> {
  try {
    const response = await apiClient.get(`/career-posts/getcareerpostbyid/${id}`);
    return handleApiResponse<CareerPost>(response);
  } catch (error: any) {
    if (error.status === 404) {
      return null; // Career post not found
    }
    console.error('Error fetching career post:', error);
    throw error;
  }
}

export async function createCareerPost(data: CareerPostData): Promise<CareerPost> {
  try {
    // Validate required fields
    if (!data.title || data.title.trim().length < 3) {
      throw new Error('Title must be at least 3 characters long');
    }

    if (!data.place || data.place.trim().length < 2) {
      throw new Error('Place must be at least 2 characters long');
    }

    if (!data.description || data.description.trim().length < 10) {
      throw new Error('Description must be at least 10 characters long');
    }

    if (!data.requirements || data.requirements.length === 0) {
      throw new Error('At least one requirement is required');
    }

    // Validate each requirement has minimum content length
    for (const requirement of data.requirements) {
      if (!requirement || requirement.trim().length < 5) {
        throw new Error('Each requirement must be at least 5 characters long');
      }
    }

    // Prepare data for API
    const careerPayload = {
      ...data,
      title: data.title.trim(),
      place: data.place.trim(),
      description: data.description.trim(),
      requirements: data.requirements.map(req => req.trim()),
      partTime: data.partTime ?? false,
      isActive: data.isActive ?? true
    };

    const response = await apiClient.post('/career-posts/addcareerpost', careerPayload);
    return handleApiResponse<CareerPost>(response);
  } catch (error) {
    console.error('Error creating career post:', error);
    throw error;
  }
}

export async function updateCareerPost(id: string, data: CareerPostData): Promise<CareerPost> {
  try {
    // Validate required fields
    if (!data.title || data.title.trim().length < 3) {
      throw new Error('Title must be at least 3 characters long');
    }

    if (!data.place || data.place.trim().length < 2) {
      throw new Error('Place must be at least 2 characters long');
    }

    if (!data.description || data.description.trim().length < 10) {
      throw new Error('Description must be at least 10 characters long');
    }

    if (!data.requirements || data.requirements.length === 0) {
      throw new Error('At least one requirement is required');
    }

    // Validate each requirement has minimum content length
    for (const requirement of data.requirements) {
      if (!requirement || requirement.trim().length < 5) {
        throw new Error('Each requirement must be at least 5 characters long');
      }
    }

    // Prepare data for API
    const careerPayload = {
      ...data,
      title: data.title.trim(),
      place: data.place.trim(),
      description: data.description.trim(),
      requirements: data.requirements.map(req => req.trim())
    };

    const response = await apiClient.put(`/career-posts/updatecareerpost/${id}`, careerPayload);
    return handleApiResponse<CareerPost>(response);
  } catch (error) {
    console.error('Error updating career post:', error);
    throw error;
  }
}

export async function deleteCareerPost(id: string): Promise<void> {
  try {
    await apiClient.delete(`/career-posts/deletecareerpost/${id}`);
  } catch (error) {
    console.error('Error deleting career post:', error);
    throw error;
  }
}

export async function toggleCareerPostStatus(id: string): Promise<CareerPost> {
  try {
    const response = await apiClient.put(`/career-posts/togglecareerpoststatus/${id}`);
    return handleApiResponse<CareerPost>(response);
  } catch (error) {
    console.error('Error toggling career post status:', error);
    throw error;
  }
}

export async function activateCareerPost(id: string): Promise<CareerPost> {
  try {
    const response = await apiClient.put(`/career-posts/activatecareerpost/${id}`);
    return handleApiResponse<CareerPost>(response);
  } catch (error) {
    console.error('Error activating career post:', error);
    throw error;
  }
}

export async function deactivateCareerPost(id: string): Promise<CareerPost> {
  try {
    const response = await apiClient.put(`/career-posts/deactivatecareerpost/${id}`);
    return handleApiResponse<CareerPost>(response);
  } catch (error) {
    console.error('Error deactivating career post:', error);
    throw error;
  }
}

export async function getCareerPostsByType(type: 'fulltime' | 'parttime'): Promise<CareerPost[]> {
  try {
    const response = await apiClient.get(`/career-posts/getcareerpostsbytype/${type}`);
    const result = handleApiResponse<{ data: CareerPost[] }>(response);
    return result.data || [];
  } catch (error) {
    console.error('Error fetching career posts by type:', error);
    throw error;
  }
}

export async function getCareerPostsByPlace(place: string): Promise<CareerPost[]> {
  try {
    const response = await apiClient.get(`/career-posts/getcareerpostsbyplace/${encodeURIComponent(place)}`);
    const result = handleApiResponse<{ data: CareerPost[] }>(response);
    return result.data || [];
  } catch (error) {
    console.error('Error fetching career posts by place:', error);
    throw error;
  }
}

export async function searchCareerPosts(query: string): Promise<CareerPost[]> {
  try {
    const response = await apiClient.get(`/career-posts/searchcareerposts?q=${encodeURIComponent(query)}`);
    const result = handleApiResponse<{ data: CareerPost[] }>(response);
    return result.data || [];
  } catch (error) {
    console.error('Error searching career posts:', error);
    throw error;
  }
}

// ===== APPLICANT API FUNCTIONS =====

export async function getApplicantsForCareerPost(careerId: string): Promise<Applicant[]> {
  try {
    const response = await apiClient.get(`/career-posts/applicants/${careerId}`);
    console.log('Raw applicants response:', response); // Debug log
    
    // Handle the actual response structure
    if (response.data && response.data.success && response.data.data) {
      const result = response.data.data;
      console.log('Applicants result:', result); // Debug log
      
      // Check if applicants array exists in the response
      if (result.applicants && Array.isArray(result.applicants)) {
        console.log('Found applicants:', result.applicants); // Debug log
        return result.applicants;
      } else {
        console.warn('No applicants array found in response:', result);
        return [];
      }
    } else {
      console.warn('Unexpected applicants response structure:', response);
      return [];
    }
  } catch (error) {
    console.error('Error fetching applicants:', error);
    throw error;
  }
}

export async function getAllApplicants(): Promise<Applicant[]> {
  try {
    const response = await apiClient.get('/career-posts/all-applicants');
    console.log('Raw all applicants response:', response); // Debug log
    
    // Handle the actual response structure
    if (response.data && response.data.success && response.data.data) {
      const result = response.data.data;
      console.log('All applicants result:', result); // Debug log
      
      // Check if careerPosts array exists in the response
      if (result.careerPosts && Array.isArray(result.careerPosts)) {
        // Extract all applicants from all career posts
        const allApplicants: Applicant[] = [];
        result.careerPosts.forEach((careerPost: any) => {
          if (careerPost.applicants && Array.isArray(careerPost.applicants)) {
            allApplicants.push(...careerPost.applicants);
          }
        });
        console.log('Found all applicants from career posts:', allApplicants); // Debug log
        return allApplicants;
      } else if (result.applicants && Array.isArray(result.applicants)) {
        // Direct applicants array (fallback)
        console.log('Found direct applicants array:', result.applicants); // Debug log
        return result.applicants;
      } else if (Array.isArray(result)) {
        // Direct array response (fallback)
        console.log('Found direct array:', result); // Debug log
        return result;
      } else {
        console.warn('No applicants found in response:', result);
        return [];
      }
    } else {
      console.warn('Unexpected all applicants response structure:', response);
      return [];
    }
  } catch (error) {
    console.error('Error fetching all applicants:', error);
    throw error;
  }
}

export async function getAllCareerPostsWithApplicants(): Promise<CareerPostWithApplicants[]> {
  try {
    const response = await apiClient.get('/career-posts/all-applicants');
    console.log('Raw all career posts with applicants response:', response); // Debug log
    
    // Handle the actual response structure
    if (response.data && response.data.success && response.data.data) {
      const result = response.data.data;
      console.log('All career posts with applicants result:', result); // Debug log
      
      // Check if careerPosts array exists in the response
      if (result.careerPosts && Array.isArray(result.careerPosts)) {
        console.log('Found career posts with applicants:', result.careerPosts); // Debug log
        return result.careerPosts;
      } else {
        console.warn('No career posts found in response:', result);
        return [];
      }
    } else {
      console.warn('Unexpected all career posts with applicants response structure:', response);
      return [];
    }
  } catch (error) {
    console.error('Error fetching all career posts with applicants:', error);
    throw error;
  }
}

export async function removeApplicantFromCareerPost(careerId: string, applicantId: string): Promise<void> {
  try {
    await apiClient.delete(`/career-posts/applicants/${careerId}/${applicantId}`);
  } catch (error) {
    console.error('Error removing applicant:', error);
    throw error;
  }
}

export async function updateApplicantStatus(
  careerId: string, 
  applicantId: string, 
  status: Applicant['status']
): Promise<Applicant> {
  try {
    const response = await apiClient.put(`/career-posts/applicants/${careerId}/${applicantId}/status`, { status });
    console.log('Raw update status response:', response); // Debug log
    
    // Handle the actual response structure
    if (response.data && response.data.success && response.data.data) {
      console.log('Updated applicant:', response.data.data); // Debug log
      return response.data.data;
    } else if (response.data && response.data.success) {
      // If no data field, return the response data
      console.log('Updated applicant (no data field):', response.data); // Debug log
      return response.data;
    } else {
      console.warn('Unexpected update status response structure:', response);
      throw new Error('Invalid response structure from update status API');
    }
  } catch (error) {
    console.error('Error updating applicant status:', error);
    throw error;
  }
}

export async function getApplicantsByStatus(status: Applicant['status']): Promise<Applicant[]> {
  try {
    const response = await apiClient.get(`/career-posts/applicants-by-status/${status}`);
    console.log('Raw applicants by status response:', response); // Debug log
    
    // Handle the actual response structure
    if (response.data && response.data.success && response.data.data) {
      const result = response.data.data;
      console.log('Applicants by status result:', result); // Debug log
      
      // Check if applicants array exists in the response
      if (result.applicants && Array.isArray(result.applicants)) {
        console.log('Found applicants by status:', result.applicants); // Debug log
        return result.applicants;
      } else if (Array.isArray(result)) {
        // Direct array response
        console.log('Found applicants array by status:', result); // Debug log
        return result;
      } else {
        console.warn('No applicants array found in response:', result);
        return [];
      }
    } else {
      console.warn('Unexpected applicants by status response structure:', response);
      return [];
    }
  } catch (error) {
    console.error('Error fetching applicants by status:', error);
    throw error;
  }
} 