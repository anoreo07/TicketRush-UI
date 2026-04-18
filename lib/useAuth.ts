/**
 * useAuth Hook
 * Custom hook để quản lý authentication state
 */

'use client';

import { useEffect, useState } from 'react';
import { getUserData, getAuthToken, removeAuthToken } from '@/lib/api';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
}

export interface UseAuthReturn {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  logout: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load user data from localStorage on mount
    const savedUser = getUserData();
    const savedToken = getAuthToken();

    setUser(savedUser);
    setToken(savedToken);
    setIsLoading(false);
  }, []);

  const logout = () => {
    setUser(null);
    setToken(null);
    removeAuthToken();
    try {
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Failed to remove user data:', error);
    }
  };

  return {
    user,
    token,
    isLoading,
    logout,
  };
};
