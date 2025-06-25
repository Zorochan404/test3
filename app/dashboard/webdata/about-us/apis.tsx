// About Us API functions and types

export interface AboutUsHeroImage {
  _id?: string;
  imageUrl: string;
  altText: string;
  order: number;
}

export interface AboutUsStatistic {
  _id?: string;
  number: string;
  title: string;
  description: string;
  imageUrl: string;
  order: number;
}

export interface AboutUsCoreValue {
  _id?: string;
  title: string;
  description: string;
  imageUrl: string;
  order: number;
}

export interface AboutUsCampusImage {
  _id?: string;
  imageUrl: string;
  altText: string;
  order: number;
}

export interface AboutUsContent {
  _id?: string;
  sectionType: 'who-we-are' | 'about-us' | 'vision' | 'mission' | 'core-values-text';
  title: string;
  content: string;
  imageUrl?: string;
  order: number;
  isActive: boolean;
}

import { apiClient, handleApiResponse } from '@/lib/api-config';

// API Base URL
const API_BASE_URL = 'https://backend-rakj.onrender.com/api/v1/about-us';

// Hero Images API
export async function getHeroImages(): Promise<AboutUsHeroImage[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/hero-images/getheroimages`);
    if (!response.ok) {
      throw new Error('Failed to fetch hero images');
    }
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Error fetching hero images:', error);
    throw error;
  }
}

export async function addHeroImage(data: Omit<AboutUsHeroImage, '_id'>): Promise<AboutUsHeroImage> {
  try {
    const response = await fetch(`${API_BASE_URL}/hero-images/addheroimage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      throw new Error('Failed to add hero image');
    }
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error adding hero image:', error);
    throw error;
  }
}

export async function updateHeroImage(id: string, data: Partial<AboutUsHeroImage>): Promise<AboutUsHeroImage> {
  try {
    const response = await fetch(`${API_BASE_URL}/hero-images/updateheroimage/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      throw new Error('Failed to update hero image');
    }
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error updating hero image:', error);
    throw error;
  }
}

export async function deleteHeroImage(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/hero-images/deleteheroimage/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      throw new Error('Failed to delete hero image');
    }
  } catch (error) {
    console.error('Error deleting hero image:', error);
    throw error;
  }
}

// Content Sections API
export async function getContentSections(): Promise<AboutUsContent[]> {
  try {
    const response = await apiClient.get('/about-us/content/getcontentsections');
    return handleApiResponse<AboutUsContent[]>(response);
  } catch (error) {
    console.error('Error fetching content sections:', error);
    throw error;
  }
}

export async function getContentByType(sectionType: string): Promise<AboutUsContent | null> {
  try {
    const response = await apiClient.get(`/about-us/content/getcontentbytype/${sectionType}`);
    return handleApiResponse<AboutUsContent>(response);
  } catch (error: any) {
    if (error.status === 404) {
      return null;
    }
    console.error('Error fetching content section:', error);
    throw error;
  }
}

export async function createContentSection(data: Omit<AboutUsContent, '_id' | 'createdAt' | 'updatedAt'>): Promise<AboutUsContent> {
  try {
    const response = await apiClient.post('/about-us/content/addcontentsection', data);
    return handleApiResponse<AboutUsContent>(response);
  } catch (error) {
    console.error('Error creating content section:', error);
    throw error;
  }
}

export async function updateContentSection(id: string, data: Partial<AboutUsContent>): Promise<AboutUsContent> {
  try {
    const response = await apiClient.put(`/about-us/content/updatecontentsection/${id}`, data);
    return handleApiResponse<AboutUsContent>(response);
  } catch (error) {
    console.error('Error updating content section:', error);
    throw error;
  }
}

export async function deleteContentSection(id: string): Promise<void> {
  try {
    await apiClient.delete(`/about-us/content/deletecontentsection/${id}`);
  } catch (error) {
    console.error('Error deleting content section:', error);
    throw error;
  }
}

// Statistics API
export async function getStatistics(): Promise<AboutUsStatistic[]> {
  try {
    const response = await apiClient.get('/about-us/statistics/getstatistics');
    return handleApiResponse<AboutUsStatistic[]>(response);
  } catch (error) {
    console.error('Error fetching statistics:', error);
    throw error;
  }
}

export async function getStatisticById(id: string): Promise<AboutUsStatistic | null> {
  try {
    const response = await apiClient.get(`/about-us/statistics/getstatisticbyid/${id}`);
    return handleApiResponse<AboutUsStatistic>(response);
  } catch (error: any) {
    if (error.status === 404) {
      return null;
    }
    console.error('Error fetching statistic:', error);
    throw error;
  }
}

export async function createStatistic(data: Omit<AboutUsStatistic, '_id' | 'createdAt' | 'updatedAt'>): Promise<AboutUsStatistic> {
  try {
    const response = await apiClient.post('/about-us/statistics/addstatistic', data);
    return handleApiResponse<AboutUsStatistic>(response);
  } catch (error) {
    console.error('Error creating statistic:', error);
    throw error;
  }
}

export async function updateStatistic(id: string, data: Partial<AboutUsStatistic>): Promise<AboutUsStatistic> {
  try {
    const response = await apiClient.put(`/about-us/statistics/updatestatistic/${id}`, data);
    return handleApiResponse<AboutUsStatistic>(response);
  } catch (error) {
    console.error('Error updating statistic:', error);
    throw error;
  }
}

export async function deleteStatistic(id: string): Promise<void> {
  try {
    await apiClient.delete(`/about-us/statistics/deletestatistic/${id}`);
  } catch (error) {
    console.error('Error deleting statistic:', error);
    throw error;
  }
}

// Core Values API
export async function getCoreValues(): Promise<AboutUsCoreValue[]> {
  try {
    const response = await apiClient.get('/about-us/core-values/getcorevalues');
    return handleApiResponse<AboutUsCoreValue[]>(response);
  } catch (error) {
    console.error('Error fetching core values:', error);
    throw error;
  }
}

export async function getCoreValueById(id: string): Promise<AboutUsCoreValue | null> {
  try {
    const response = await apiClient.get(`/about-us/core-values/getcorevaluebyid/${id}`);
    return handleApiResponse<AboutUsCoreValue>(response);
  } catch (error: any) {
    if (error.status === 404) {
      return null;
    }
    console.error('Error fetching core value:', error);
    throw error;
  }
}

export async function createCoreValue(data: Omit<AboutUsCoreValue, '_id' | 'createdAt' | 'updatedAt'>): Promise<AboutUsCoreValue> {
  try {
    const response = await apiClient.post('/about-us/core-values/addcorevalue', data);
    return handleApiResponse<AboutUsCoreValue>(response);
  } catch (error) {
    console.error('Error creating core value:', error);
    throw error;
  }
}

export async function updateCoreValue(id: string, data: Partial<AboutUsCoreValue>): Promise<AboutUsCoreValue> {
  try {
    const response = await apiClient.put(`/about-us/core-values/updatecorevalue/${id}`, data);
    return handleApiResponse<AboutUsCoreValue>(response);
  } catch (error) {
    console.error('Error updating core value:', error);
    throw error;
  }
}

export async function deleteCoreValue(id: string): Promise<void> {
  try {
    await apiClient.delete(`/about-us/core-values/deletecorevalue/${id}`);
  } catch (error) {
    console.error('Error deleting core value:', error);
    throw error;
  }
}

// Campus Images API
export async function getCampusImages(): Promise<AboutUsCampusImage[]> {
  try {
    const response = await apiClient.get('/about-us/campus-images/getcampusimages');
    return handleApiResponse<AboutUsCampusImage[]>(response);
  } catch (error) {
    console.error('Error fetching campus images:', error);
    throw error;
  }
}

export async function getCampusImageById(id: string): Promise<AboutUsCampusImage | null> {
  try {
    const response = await apiClient.get(`/about-us/campus-images/getcampusimagebyid/${id}`);
    return handleApiResponse<AboutUsCampusImage>(response);
  } catch (error: any) {
    if (error.status === 404) {
      return null;
    }
    console.error('Error fetching campus image:', error);
    throw error;
  }
}

export async function createCampusImage(data: Omit<AboutUsCampusImage, '_id' | 'createdAt' | 'updatedAt'>): Promise<AboutUsCampusImage> {
  try {
    const response = await apiClient.post('/about-us/campus-images/addcampusimage', data);
    return handleApiResponse<AboutUsCampusImage>(response);
  } catch (error) {
    console.error('Error creating campus image:', error);
    throw error;
  }
}

export async function updateCampusImage(id: string, data: Partial<AboutUsCampusImage>): Promise<AboutUsCampusImage> {
  try {
    const response = await apiClient.put(`/about-us/campus-images/updatecampusimage/${id}`, data);
    return handleApiResponse<AboutUsCampusImage>(response);
  } catch (error) {
    console.error('Error updating campus image:', error);
    throw error;
  }
}

export async function deleteCampusImage(id: string): Promise<void> {
  try {
    await apiClient.delete(`/about-us/campus-images/deletecampusimage/${id}`);
  } catch (error) {
    console.error('Error deleting campus image:', error);
    throw error;
  }
}

// Alias exports for backward compatibility
export const addCampusImage = createCampusImage;
export const addCoreValue = createCoreValue;
export const addStatistic = createStatistic;
export const addOrUpdateContent = updateContentSection;
