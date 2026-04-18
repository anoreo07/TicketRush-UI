/**
 * Password Recovery Service
 * For forgot password and password reset functionality
 */

import { apiFetch } from './client';

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  new_password: string;
  confirm_password: string;
}

/**
 * Password recovery API
 */
export const passwordApi = {
  /**
   * Request password reset link via email
   */
  forgotPassword: (email: string) =>
    apiFetch('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  /**
   * Reset password with token
   */
  resetPassword: (token: string, newPassword: string) =>
    apiFetch('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({
        token,
        new_password: newPassword,
      }),
    }),

  /**
   * Verify reset token validity
   */
  verifyResetToken: (token: string) =>
    apiFetch(`/auth/verify-reset-token/${token}`, {
      method: 'GET',
    }),
};
