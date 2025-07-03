// Free Courses API functions and types

export interface CourseDetails {
  duration: number;
  mode: string;
  certificate: string;
  level: string;
  _id?: string;
}

export interface FreeCourseData {
  name: string;
  shortDescription: string;
  details: CourseDetails[];
  whyLearnThisCourse: string;
  whatYouWillLearn: string[];
  careerOpportunities: string;
  courseBenefits: string[];
  imageUrl: string;
  isActive: boolean;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
}

export interface FreeCourse extends FreeCourseData {
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

import { apiClient, handleApiResponse } from '@/lib/api-config';

// API Functions
export async function getFreeCourses(): Promise<FreeCourse[]> {
  try {
    const response = await apiClient.get('/free-courses/');
    console.log('Raw API response:', response); // Debug log
    
    // Try different response structures
    let courses: FreeCourse[] = [];
    
    if (response.data && Array.isArray(response.data)) {
      // Direct array response
      courses = response.data;
    } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
      // Nested data structure
      courses = response.data.data;
    } else if (response.data && response.data.success && response.data.data && Array.isArray(response.data.data)) {
      // Success wrapper with data
      courses = response.data.data;
    } else {
      console.warn('Unexpected response structure:', response);
      courses = [];
    }
    
    console.log('Processed courses:', courses); // Debug log
    return courses;
  } catch (error) {
    console.error('Error fetching free courses:', error);
    throw error;
  }
}

export async function getFreeCourseById(id: string): Promise<FreeCourse | null> {
  try {
    const response = await apiClient.get(`/free-courses/${id}`);
    return handleApiResponse<FreeCourse>(response);
  } catch (error: any) {
    if (error.status === 404) {
      return null; // Course not found
    }
    console.error('Error fetching free course:', error);
    throw error;
  }
}

export async function createFreeCourse(data: FreeCourseData): Promise<FreeCourse> {
  try {
    // Validate required fields
    if (!data.name || data.name.trim().length < 3) {
      throw new Error('Course name must be at least 3 characters long');
    }

    if (!data.shortDescription || data.shortDescription.trim().length < 10) {
      throw new Error('Short description must be at least 10 characters long');
    }

    if (!data.details || data.details.length === 0) {
      throw new Error('At least one course detail is required');
    }

    if (!data.whatYouWillLearn || data.whatYouWillLearn.length === 0) {
      throw new Error('At least one learning objective is required');
    }

    if (!data.courseBenefits || data.courseBenefits.length === 0) {
      throw new Error('At least one course benefit is required');
    }

    // Prepare data for API
    const coursePayload = {
      ...data,
      name: data.name.trim(),
      shortDescription: data.shortDescription.trim(),
      whyLearnThisCourse: data.whyLearnThisCourse.trim(),
      careerOpportunities: data.careerOpportunities.trim(),
      metaTitle: data.metaTitle.trim(),
      metaDescription: data.metaDescription.trim(),
      metaKeywords: data.metaKeywords.trim(),
      isActive: data.isActive ?? true
    };

    const response = await apiClient.post('/free-courses/', coursePayload);
    return handleApiResponse<FreeCourse>(response);
  } catch (error) {
    console.error('Error creating free course:', error);
    throw error;
  }
}

export async function updateFreeCourse(id: string, data: FreeCourseData): Promise<FreeCourse> {
  try {
    // Validate required fields
    if (!data.name || data.name.trim().length < 3) {
      throw new Error('Course name must be at least 3 characters long');
    }

    if (!data.shortDescription || data.shortDescription.trim().length < 10) {
      throw new Error('Short description must be at least 10 characters long');
    }

    if (!data.details || data.details.length === 0) {
      throw new Error('At least one course detail is required');
    }

    if (!data.whatYouWillLearn || data.whatYouWillLearn.length === 0) {
      throw new Error('At least one learning objective is required');
    }

    if (!data.courseBenefits || data.courseBenefits.length === 0) {
      throw new Error('At least one course benefit is required');
    }

    // Prepare data for API
    const coursePayload = {
      ...data,
      name: data.name.trim(),
      shortDescription: data.shortDescription.trim(),
      whyLearnThisCourse: data.whyLearnThisCourse.trim(),
      careerOpportunities: data.careerOpportunities.trim(),
      metaTitle: data.metaTitle.trim(),
      metaDescription: data.metaDescription.trim(),
      metaKeywords: data.metaKeywords.trim()
    };

    const response = await apiClient.put(`/free-courses/${id}`, coursePayload);
    return handleApiResponse<FreeCourse>(response);
  } catch (error) {
    console.error('Error updating free course:', error);
    throw error;
  }
}

export async function deleteFreeCourse(id: string): Promise<void> {
  try {
    await apiClient.delete(`/free-courses/${id}`);
  } catch (error) {
    console.error('Error deleting free course:', error);
    throw error;
  }
}

export async function updateFreeCourseStatus(id: string, isActive: boolean): Promise<FreeCourse> {
  try {
    const response = await apiClient.put(`/free-courses/${id}/toggle-status`, { isActive });
    return handleApiResponse<FreeCourse>(response);
  } catch (error) {
    console.error('Error updating free course status:', error);
    throw error;
  }
} 