/**
 * API Client Configuration
 * Centralized API base configuration
 */

export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
};

/**
 * API Error Class
 */
export class ApiError extends Error {
  constructor(
    public message: string,
    public code?: string,
    public statusCode?: number,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Generic API Response Interface
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message: string;
  statusCode?: number;
}

/**
 * Helper function to handle API responses
 */
const handleApiResponse = async <T = any>(response: Response): Promise<T> => {
  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(
      data.message || 'Đã xảy ra lỗi',
      data.code,
      response.status,
      data.data
    );
  }

  return data.data || data;
};

/**
 * Generic fetch wrapper with error handling
 */
export const apiFetch = async <T = any>(
  endpoint: string,
  options?: RequestInit
): Promise<T> => {
  try {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    console.log('🌐 Fetching URL:', url);
    console.log('🌐 API_CONFIG.BASE_URL:', API_CONFIG.BASE_URL);
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    return await handleApiResponse<T>(response);
  } catch (error) {
    console.error('❌ Fetch error:', error);
    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof TypeError) {
      console.error('❌ TypeError caught - network error');
      throw new ApiError(
        'Không thể kết nối đến server. Vui lòng kiểm tra kết nối.',
        'NETWORK_ERROR',
        0
      );
    }

    throw new ApiError(
      'Đã xảy ra lỗi không xác định',
      'UNKNOWN_ERROR',
      500
    );
  }
};

/**
 * Fetch with authorization token
 */
export const apiAuthFetch = async <T = any>(
  endpoint: string,
  options?: RequestInit
): Promise<T> => {
  const token = getAuthToken();
  
  return apiFetch<T>(endpoint, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
};

/**
 * Save token to localStorage
 */
export const saveAuthToken = (token: string): void => {
  try {
    localStorage.setItem('authToken', token);
  } catch (error) {
    console.error('Failed to save auth token:', error);
  }
};

/**
 * Get token from localStorage
 */
export const getAuthToken = (): string | null => {
  try {
    return localStorage.getItem('authToken');
  } catch (error) {
    console.error('Failed to get auth token:', error);
    return null;
  }
};

/**
 * Remove token from localStorage
 */
export const removeAuthToken = (): void => {
  try {
    localStorage.removeItem('authToken');
  } catch (error) {
    console.error('Failed to remove auth token:', error);
  }
};

/**
 * Save user data to localStorage
 */
export const saveUserData = (user: any): void => {
  try {
    localStorage.setItem('user', JSON.stringify(user));
  } catch (error) {
    console.error('Failed to save user data:', error);
  }
};

/**
 * Get user data from localStorage
 */
export const getUserData = (): any | null => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Failed to get user data:', error);
    return null;
  }
};

/**
 * Clear all auth data
 */
export const clearAuthData = (): void => {
  removeAuthToken();
  try {
    localStorage.removeItem('user');
  } catch (error) {
    console.error('Failed to clear user data:', error);
  }
};
