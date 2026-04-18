/**
 * Auth API Endpoints
 */

import { apiFetch } from './client';

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

/**
 * Register - Đăng ký người dùng
 * POST /auth/register
 */
export const authApi = {
  register: (payload: RegisterRequest) =>
    apiFetch<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  login: (payload: LoginRequest) =>
    apiFetch<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  logout: () =>
    apiFetch('/auth/logout', {
      method: 'POST',
    }),

  getCurrentUser: () =>
    apiFetch('/auth/me', {
      method: 'GET',
    }),
};
