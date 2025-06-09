// Download API functions and types

export interface DownloadItem {
  id: string;
  _id?: string; // Optional MongoDB _id for backward compatibility
  title: string;
  description: string;
  category: string;
  fileUrl: string;
  fileName: string;
  fileSize: string;
  uploadDate: string;
  downloadCount: number;
  isActive: boolean;
}

export interface DownloadItemData {
  title: string;
  description: string;
  category: string;
  fileUrl: string;
  fileName: string;
  fileSize: string;
  uploadDate: string;
  downloadCount: number;
  isActive: boolean;
}

// Download categories based on the website
export const DEFAULT_DOWNLOAD_CATEGORIES = [
  'Entrance Exam Schedule',
  'Previous Year Sample Papers',
  'Newsletters',
  'Brochure/Prospectus',
  'Placement Partner Documents',
  'Club Documents',
  'Scholarship and Discount'
];

// Category interface
export interface DownloadCategory {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdDate: string;
  downloadCount: number;
}

export interface DownloadCategoryData {
  name: string;
  description?: string;
  isActive: boolean;
}

// API Functions
export async function getDownloads(): Promise<DownloadItem[]> {
  try {
    const response = await fetch('https://backend-rakj.onrender.com/api/v1/download/getdownloads');
    
    if (!response.ok) {
      throw new Error('Failed to fetch downloads');
    }
    
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Error fetching downloads:', error);
    throw error;
  }
}

export async function getDownloadById(id: string): Promise<DownloadItem | null> {
  try {
    const response = await fetch(`https://backend-rakj.onrender.com/api/v1/download/getdownloadbyid/${id}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return null; // Download not found
      }
      throw new Error('Failed to fetch download');
    }
    
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error fetching download:', error);
    throw error;
  }
}

export async function createDownload(data: DownloadItemData): Promise<DownloadItem> {
  try {
    // Validate required fields
    if (!data.title || data.title.trim().length < 3) {
      throw new Error('Title must be at least 3 characters long');
    }
    
    if (!data.description || data.description.trim().length < 10) {
      throw new Error('Description must be at least 10 characters long');
    }
    
    if (!data.category) {
      throw new Error('Category is required');
    }
    
    if (!data.fileUrl) {
      throw new Error('File URL is required');
    }
    
    if (!data.fileName) {
      throw new Error('File name is required');
    }
    
    // Prepare data for API
    const downloadPayload = {
      ...data,
      title: data.title.trim(),
      description: data.description.trim(),
      uploadDate: data.uploadDate || new Date().toISOString().split('T')[0],
      downloadCount: 0,
      isActive: true
    };
    
    const response = await fetch('https://backend-rakj.onrender.com/api/v1/download/adddownload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(downloadPayload)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create download');
    }
    
    const result = await response.json();
    return result.data;
   
  } catch (error) {
    console.error('Error creating download:', error);
    throw error;
  }
}

export async function updateDownload(id: string, data: DownloadItemData): Promise<DownloadItem> {
  try {
    // Validate required fields
    if (!data.title || data.title.trim().length < 3) {
      throw new Error('Title must be at least 3 characters long');
    }
    
    if (!data.description || data.description.trim().length < 10) {
      throw new Error('Description must be at least 10 characters long');
    }
    
    if (!data.category) {
      throw new Error('Category is required');
    }
    
    if (!data.fileUrl) {
      throw new Error('File URL is required');
    }
    
    if (!data.fileName) {
      throw new Error('File name is required');
    }
    
    // Prepare data for API
    const downloadPayload = {
      ...data,
      title: data.title.trim(),
      description: data.description.trim()
    };
    
    const response = await fetch(`https://backend-rakj.onrender.com/api/v1/download/updatedownload/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(downloadPayload)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update download');
    }
    
    const result = await response.json();
    return result.data;
   
  } catch (error) {
    console.error('Error updating download:', error);
    throw error;
  }
}

export async function deleteDownload(id: string): Promise<void> {
  try {
    const response = await fetch(`https://backend-rakj.onrender.com/api/v1/download/deletedownload/${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete download');
    }
  } catch (error) {
    console.error('Error deleting download:', error);
    throw error;
  }
}

// Utility function to format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Utility function to get file extension
export function getFileExtension(filename: string): string {
  return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
}

// Category API Functions
export async function getCategories(): Promise<DownloadCategory[]> {
  try {
    const response = await fetch('https://backend-rakj.onrender.com/api/v1/download/getcategories');

    if (!response.ok) {
      // If categories endpoint doesn't exist, return default categories
      if (response.status === 404) {
        return DEFAULT_DOWNLOAD_CATEGORIES.map((name, index) => ({
          id: `default-${index}`,
          name,
          description: `Default category: ${name}`,
          isActive: true,
          createdDate: new Date().toISOString().split('T')[0],
          downloadCount: 0
        }));
      }
      throw new Error('Failed to fetch categories');
    }

    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    // Return default categories as fallback
    return DEFAULT_DOWNLOAD_CATEGORIES.map((name, index) => ({
      id: `default-${index}`,
      name,
      description: `Default category: ${name}`,
      isActive: true,
      createdDate: new Date().toISOString().split('T')[0],
      downloadCount: 0
    }));
  }
}



export async function deleteCategory(id: string): Promise<void> {
  try {
    const response = await fetch(`https://backend-rakj.onrender.com/api/v1/download/deletecategory/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete category');
    }
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
}

// Utility function to validate PDF file
export function validatePDFFile(file: File): boolean {
  const allowedTypes = ['application/pdf'];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!allowedTypes.includes(file.type)) {
    throw new Error('Only PDF files are allowed');
  }

  if (file.size > maxSize) {
    throw new Error('File size must be less than 10MB');
  }

  return true;
}
