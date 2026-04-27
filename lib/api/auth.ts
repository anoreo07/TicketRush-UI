/**
 * Auth API Endpoints
 */

import { apiFetch, apiAuthFetch } from './client';

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    full_name: string;
    role: string;
  };
}

export interface UserResponse {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  role: string;
  created_at: string;
}

/**
 * Auth API Methods
 */
export const authApi = {
  /**
   * Register - POST /auth/register
   */
  register: (payload: RegisterRequest) =>
    apiFetch<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  /**
   * Login - POST /auth/login
   */
  login: (payload: LoginRequest) =>
    apiFetch<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  /**
   * Get Current User - GET /auth/me
   * Requires token in Authorization header
   */
  getCurrentUser: () =>
    apiAuthFetch<UserResponse>('/auth/me', {
      method: 'GET',
    }),

  /**
   * Change Password - POST /auth/change-password
   */
  changePassword: (currentPassword: string, newPassword: string) =>
    apiAuthFetch('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    }),

  /**
   * Delete Account - POST /auth/delete-account
   */
  deleteAccount: () =>
    apiAuthFetch('/auth/delete-account', {
      method: 'POST',
    }),

  /**
   * Logout - POST /auth/logout
   */
  logout: () =>
    apiAuthFetch('/auth/logout', {
      method: 'POST',
    }),
};
