// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://backend-rakj.onrender.com/api/v1';

// Helper function to build API URLs
export const buildApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}/${endpoint}`;
};

// Common headers for API requests
export const getApiHeaders = (): HeadersInit => {
  return {
    'Content-Type': 'application/json',
  };
}; 