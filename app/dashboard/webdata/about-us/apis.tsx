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
    const response = await fetch(`${API_BASE_URL}/content/getcontentsections`);
    if (!response.ok) {
      throw new Error('Failed to fetch content sections');
    }
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Error fetching content sections:', error);
    throw error;
  }
}

export async function getContentByType(sectionType: string): Promise<AboutUsContent | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/content/getcontentbytype/${sectionType}`);
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch content section');
    }
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error fetching content section:', error);
    throw error;
  }
}

export async function addOrUpdateContent(data: Omit<AboutUsContent, '_id'>): Promise<AboutUsContent> {
  try {
    const response = await fetch(`${API_BASE_URL}/content/addorupdatecontent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      throw new Error('Failed to save content section');
    }
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error saving content section:', error);
    throw error;
  }
}

// Statistics API
export async function getStatistics(): Promise<AboutUsStatistic[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/statistics/getstatistics`);
    if (!response.ok) {
      throw new Error('Failed to fetch statistics');
    }
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Error fetching statistics:', error);
    throw error;
  }
}

export async function addStatistic(data: Omit<AboutUsStatistic, '_id'>): Promise<AboutUsStatistic> {
  try {
    const response = await fetch(`${API_BASE_URL}/statistics/addstatistic`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      throw new Error('Failed to add statistic');
    }
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error adding statistic:', error);
    throw error;
  }
}

export async function updateStatistic(id: string, data: Partial<AboutUsStatistic>): Promise<AboutUsStatistic> {
  try {
    const response = await fetch(`${API_BASE_URL}/statistics/updatestatistic/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      throw new Error('Failed to update statistic');
    }
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error updating statistic:', error);
    throw error;
  }
}

export async function deleteStatistic(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/statistics/deletestatistic/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      throw new Error('Failed to delete statistic');
    }
  } catch (error) {
    console.error('Error deleting statistic:', error);
    throw error;
  }
}

// Core Values API
export async function getCoreValues(): Promise<AboutUsCoreValue[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/core-values/getcorevalues`);
    if (!response.ok) {
      throw new Error('Failed to fetch core values');
    }
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Error fetching core values:', error);
    throw error;
  }
}

export async function addCoreValue(data: Omit<AboutUsCoreValue, '_id'>): Promise<AboutUsCoreValue> {
  try {
    const response = await fetch(`${API_BASE_URL}/core-values/addcorevalue`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      throw new Error('Failed to add core value');
    }
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error adding core value:', error);
    throw error;
  }
}

export async function updateCoreValue(id: string, data: Partial<AboutUsCoreValue>): Promise<AboutUsCoreValue> {
  try {
    const response = await fetch(`${API_BASE_URL}/core-values/updatecorevalue/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      throw new Error('Failed to update core value');
    }
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error updating core value:', error);
    throw error;
  }
}

export async function deleteCoreValue(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/core-values/deletecorevalue/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      throw new Error('Failed to delete core value');
    }
  } catch (error) {
    console.error('Error deleting core value:', error);
    throw error;
  }
}

// Campus Images API
export async function getCampusImages(): Promise<AboutUsCampusImage[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/campus-images/getcampusimages`);
    if (!response.ok) {
      throw new Error('Failed to fetch campus images');
    }
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Error fetching campus images:', error);
    throw error;
  }
}

export async function addCampusImage(data: Omit<AboutUsCampusImage, '_id'>): Promise<AboutUsCampusImage> {
  try {
    const response = await fetch(`${API_BASE_URL}/campus-images/addcampusimage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      throw new Error('Failed to add campus image');
    }
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error adding campus image:', error);
    throw error;
  }
}

export async function updateCampusImage(id: string, data: Partial<AboutUsCampusImage>): Promise<AboutUsCampusImage> {
  try {
    const response = await fetch(`${API_BASE_URL}/campus-images/updatecampusimage/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      throw new Error('Failed to update campus image');
    }
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error updating campus image:', error);
    throw error;
  }
}

export async function deleteCampusImage(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/campus-images/deletecampusimage/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      throw new Error('Failed to delete campus image');
    }
  } catch (error) {
    console.error('Error deleting campus image:', error);
    throw error;
  }
}
