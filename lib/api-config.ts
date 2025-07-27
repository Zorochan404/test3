import axios, { AxiosError, AxiosResponse } from 'axios';

// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_base_url;

// Helper function to build API URLs
export const buildApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}/${endpoint}`;
};

// Common headers for API requests
export const getApiHeaders = (): Record<string, string> => {
  return {
    'Content-Type': 'application/json',
  };
};

// Create axios instance with default configuration
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: getApiHeaders(),
  timeout: 30000, // 30 seconds timeout
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error: AxiosError) => {
    console.error('❌ Response Error:', error.response?.data);
    
    // Handle different types of errors with user-friendly messages
    let userMessage = 'Something went wrong. Please try again.';
    let errorDetails: string[] = [];
    
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const data = error.response.data as any;
      
      // Handle backend validation errors with details
      if (data && data.success === false && data.errorType === 'VALIDATION' && data.details) {
        userMessage = data.details;
        errorDetails = Array.isArray(data.details) ? data.details : [data.details];
      } else {
        // Handle other HTTP status errors
        switch (status) {
          case 400:
            userMessage = data?.error || data?.message || 'Invalid request. Please check your input.';
            if (data?.details) {
              errorDetails = Array.isArray(data.details) ? data.details : [data.details];
            }
            break;
          case 401:
            userMessage = 'You are not authorized to perform this action. Please log in again.';
            break;
          case 403:
            userMessage = 'You do not have permission to perform this action.';
            break;
          case 404:
            userMessage = 'The requested resource was not found.';
            break;
          case 409:
            userMessage = data?.error || data?.message || 'This resource already exists.';
            break;
          case 422:
            userMessage = data?.error || data?.message || 'Validation failed. Please check your input.';
            if (data?.details) {
              errorDetails = Array.isArray(data.details) ? data.details : [data.details];
            }
            break;
          case 429:
            userMessage = 'Too many requests. Please wait a moment and try again.';
            break;
          case 500:
            userMessage = 'Server error. Please try again later.';
            break;
          case 502:
            userMessage = 'Server is temporarily unavailable. Please try again later.';
            break;
          case 503:
            userMessage = 'Service is temporarily unavailable. Please try again later.';
            break;
          default:
            userMessage = data?.error || data?.message || `Server error (${status}). Please try again.`;
            if (data?.details) {
              errorDetails = Array.isArray(data.details) ? data.details : [data.details];
            }
        }
      }
    } else if (error.request) {
      // Network error
      userMessage = 'Network error. Please check your internet connection and try again.';
    } else {
      // Other error
      userMessage = error.message || 'An unexpected error occurred. Please try again.';
    }
    
    // Create a custom error with user-friendly message and details
    const customError = new Error(userMessage);
    (customError as any).originalError = error;
    (customError as any).status = error.response?.status;
    (customError as any).data = error.response?.data || {};
    (customError as any).details = errorDetails;
    // @ts-ignore
    (customError as any).errorType = error.response?.data?.errorType || null;
    
    return Promise.reject(customError);
  }
);

// Helper function to handle API responses
export const handleApiResponse = <T>(response: AxiosResponse): T => {
  const { data } = response;
  
  if (data.success && data.data !== undefined) {
    return data.data;
  } else if (data.success === false) {
    throw new Error(data.message || 'API request failed');
  } else {
    // If no success field, assume the data is directly the result
    return data;
  }
};

// Helper function to create API error
export const createApiError = (message: string, originalError?: any): Error => {
  const error = new Error(message);
  if (originalError) {
    (error as any).originalError = originalError;
  }
  return error;
};

// Helper function to format validation errors for display
export const formatValidationErrors = (error: any): string => {
  if (error.details && Array.isArray(error.details)) {
    return error.details.join('\n');
  }
  return error.message || 'An error occurred';
}; 