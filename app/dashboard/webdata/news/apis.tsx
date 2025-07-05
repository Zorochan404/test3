// News API functions and types

export interface NewsItem {
  _id?: string;
  title: string;
  type: string;
  subType: string;
  description: string;
  pointdetails: string[];
  image: string;
  date: string;
  time: string;
  tags: string[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface NewsResponse {
  success: boolean;
  message: string;
  data: {
    news: NewsItem[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalNews: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
  statusCode: number;
  timestamp: string;
}

export interface SingleNewsResponse {
  success: boolean;
  message: string;
  data: NewsItem;
  statusCode: number;
  timestamp: string;
}

import { apiClient, handleApiResponse } from '@/lib/api-config';

// API Base URL
const API_BASE_URL = 'http://localhost:5500/api/v1/news';

// Get all news with pagination
export async function getAllNews(page: number = 1, limit: number = 10): Promise<NewsResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/all?page=${page}&limit=${limit}`);
    if (!response.ok) {
      throw new Error('Failed to fetch news');
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
}

// Get news by ID
export async function getNewsById(id: string): Promise<SingleNewsResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch news item');
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching news item:', error);
    throw error;
  }
}

// Create news
export async function createNews(data: Omit<NewsItem, '_id' | 'createdAt' | 'updatedAt'>): Promise<SingleNewsResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      throw new Error('Failed to create news');
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error creating news:', error);
    throw error;
  }
}

// Update news
export async function updateNews(id: string, data: Partial<NewsItem>): Promise<SingleNewsResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      throw new Error('Failed to update news');
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error updating news:', error);
    throw error;
  }
}

// Delete news
export async function deleteNews(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      throw new Error('Failed to delete news');
    }
  } catch (error) {
    console.error('Error deleting news:', error);
    throw error;
  }
}

// Get news by type
export async function getNewsByType(type: string, page: number = 1, limit: number = 10): Promise<NewsResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/type/${type}?page=${page}&limit=${limit}`);
    if (!response.ok) {
      throw new Error('Failed to fetch news by type');
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching news by type:', error);
    throw error;
  }
}

// Get news by subtype
export async function getNewsBySubType(subType: string, page: number = 1, limit: number = 10): Promise<NewsResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/subtype/${subType}?page=${page}&limit=${limit}`);
    if (!response.ok) {
      throw new Error('Failed to fetch news by subtype');
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching news by subtype:', error);
    throw error;
  }
}

// Search news
export async function searchNews(query: string, page: number = 1, limit: number = 10): Promise<NewsResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
    if (!response.ok) {
      throw new Error('Failed to search news');
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error searching news:', error);
    throw error;
  }
}

// Get latest news
export async function getLatestNews(limit: number = 5): Promise<NewsResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/latest?limit=${limit}`);
    if (!response.ok) {
      throw new Error('Failed to fetch latest news');
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching latest news:', error);
    throw error;
  }
}

// Get active news
export async function getActiveNews(page: number = 1, limit: number = 10): Promise<NewsResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/active?page=${page}&limit=${limit}`);
    if (!response.ok) {
      throw new Error('Failed to fetch active news');
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching active news:', error);
    throw error;
  }
}

// Get news types
export async function getNewsTypes(): Promise<string[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/types/all`);
    if (!response.ok) {
      throw new Error('Failed to fetch news types');
    }
    const result = await response.json();
    console.log('News types response:', result);
    
    // Handle different response structures
    if (Array.isArray(result)) {
      return result;
    } else if (result.data && Array.isArray(result.data)) {
      return result.data;
    } else if (result.types && Array.isArray(result.types)) {
      return result.types;
    } else {
      console.warn('Unexpected news types response structure:', result);
      return [];
    }
  } catch (error) {
    console.error('Error fetching news types:', error);
    return [];
  }
}

// Get news subtypes
export async function getNewsSubTypes(): Promise<string[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/subtypes/all`);
    if (!response.ok) {
      throw new Error('Failed to fetch news subtypes');
    }
    const result = await response.json();
    console.log('News subtypes response:', result);
    
    // Handle different response structures
    if (Array.isArray(result)) {
      return result;
    } else if (result.data && Array.isArray(result.data)) {
      return result.data;
    } else if (result.subTypes && Array.isArray(result.subTypes)) {
      return result.subTypes;
    } else {
      console.warn('Unexpected news subtypes response structure:', result);
      return [];
    }
  } catch (error) {
    console.error('Error fetching news subtypes:', error);
    return [];
  }
}

// Get news tags
export async function getNewsTags(): Promise<string[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/tags/all`);
    if (!response.ok) {
      throw new Error('Failed to fetch news tags');
    }
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Error fetching news tags:', error);
    throw error;
  }
}

// Toggle news status
export async function toggleNewsStatus(id: string): Promise<SingleNewsResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}/toggle-status`, {
      method: 'PUT'
    });
    if (!response.ok) {
      throw new Error('Failed to toggle news status');
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error toggling news status:', error);
    throw error;
  }
}

// Update news image
export async function updateNewsImage(id: string, imageUrl: string): Promise<SingleNewsResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}/image`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: imageUrl })
    });
    if (!response.ok) {
      throw new Error('Failed to update news image');
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error updating news image:', error);
    throw error;
  }
} 