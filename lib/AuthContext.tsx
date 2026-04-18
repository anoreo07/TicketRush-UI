/**
 * Auth Context / Service for managing authentication state
 * Provides centralized auth state management
 */

'use client';

import { createContext, useContext, useCallback } from 'react';
import { useAuth } from './useAuth';

interface AuthContextType {
  user: any | null;
  token: string | null;
  isLoading: boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={{ ...auth, isAuthenticated: !!auth.user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
};
