'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi, saveAuthToken, saveUserData } from '@/lib/api';
import { validateSignupForm } from '@/lib/validators';

export const SignupForm = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    password: '',
    confirm_password: '',
    terms: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error for this field when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
    setServerError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Clear previous errors
    setFieldErrors({});
    setServerError(null);

    // Validate form
    const validation = validateSignupForm(formData);
    if (!validation.isValid) {
      setFieldErrors(validation.errors);
      return;
    }

    setIsLoading(true);

    try {
      // Call register API
      const response = await authApi.register({
        email: formData.email,
        password: formData.password,
        full_name: formData.full_name,
      });

      // Save auth data
      saveAuthToken(response.token);
      saveUserData(response.user);

      // Redirect to dashboard or home page
      router.push('/');
    } catch (error: any) {
      const errorMessage = error?.message || 'Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại.';
      setServerError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Server Error Alert */}
      {serverError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-700 font-medium">{serverError}</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="full_name" className="block text-sm font-bold text-on-surface ml-1">
            Họ và tên
          </label>
          <input
            id="full_name"
            name="full_name"
            type="text"
            placeholder="Nguyễn Văn A"
            value={formData.full_name}
            onChange={handleChange}
            disabled={isLoading}
            className={`w-full px-4 py-3 bg-surface border rounded-lg focus:ring-2 focus:border-primary transition-all duration-200 placeholder:text-outline/50 ${
              fieldErrors.full_name ? 'border-red-500 focus:ring-red-500' : 'border-outline-variant focus:ring-primary'
            }`}
          />
          {fieldErrors.full_name && (
            <p className="text-xs text-red-500 ml-1">{fieldErrors.full_name}</p>
          )}
        </div>
        <div className="space-y-2">
          <label htmlFor="phone" className="block text-sm font-bold text-on-surface ml-1">
            Số điện thoại (tùy chọn)
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="090 123 4567"
            value={formData.phone}
            onChange={handleChange}
            disabled={isLoading}
            className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 placeholder:text-outline/50 disabled:opacity-50"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-bold text-on-surface ml-1">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="example@ticketrush.vn"
          value={formData.email}
          onChange={handleChange}
          disabled={isLoading}
          className={`w-full px-4 py-3 bg-surface border rounded-lg focus:ring-2 focus:border-primary transition-all duration-200 placeholder:text-outline/50 disabled:opacity-50 ${
            fieldErrors.email ? 'border-red-500 focus:ring-red-500' : 'border-outline-variant focus:ring-primary'
          }`}
        />
        {fieldErrors.email && (
          <p className="text-xs text-red-500 ml-1">{fieldErrors.email}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-bold text-on-surface ml-1">
            Mật khẩu
          </label>
          <div className="relative flex items-center">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
              className={`w-full px-4 py-3 bg-surface border rounded-lg focus:ring-2 focus:border-primary transition-all duration-200 placeholder:text-outline/50 disabled:opacity-50 ${
                fieldErrors.password ? 'border-red-500 focus:ring-red-500' : 'border-outline-variant focus:ring-primary'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
              className="absolute right-3 text-outline hover:text-on-surface transition-colors disabled:opacity-50"
              aria-label="Toggle password visibility"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {showPassword ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803" />
                )}
              </svg>
            </button>
          </div>
          {fieldErrors.password && (
            <p className="text-xs text-red-500 ml-1">{fieldErrors.password}</p>
          )}
        </div>
        <div className="space-y-2">
          <label htmlFor="confirm_password" className="block text-sm font-bold text-on-surface ml-1">
            Xác nhận mật khẩu
          </label>
          <div className="relative flex items-center">
            <input
              id="confirm_password"
              name="confirm_password"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={formData.confirm_password}
              onChange={handleChange}
              disabled={isLoading}
              className={`w-full px-4 py-3 bg-surface border rounded-lg focus:ring-2 focus:border-primary transition-all duration-200 placeholder:text-outline/50 disabled:opacity-50 ${
                fieldErrors.confirm_password ? 'border-red-500 focus:ring-red-500' : 'border-outline-variant focus:ring-primary'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={isLoading}
              className="absolute right-3 text-outline hover:text-on-surface transition-colors disabled:opacity-50"
              aria-label="Toggle confirm password visibility"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {showConfirmPassword ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803" />
                )}
              </svg>
            </button>
          </div>
          {fieldErrors.confirm_password && (
            <p className="text-xs text-red-500 ml-1">{fieldErrors.confirm_password}</p>
          )}
        </div>
      </div>

      <div className="flex items-start gap-3 pt-2">
        <div className="flex items-center h-5">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            checked={formData.terms}
            onChange={handleChange}
            disabled={isLoading}
            className="w-5 h-5 text-tertiary border-outline-variant rounded focus:ring-tertiary cursor-pointer disabled:opacity-50"
          />
        </div>
        <label htmlFor="terms" className="text-sm text-on-surface-variant leading-relaxed">
          Tôi đồng ý với{' '}
          <a href="#" className="text-primary font-bold hover:underline">
            Điều khoản dịch vụ
          </a>{' '}
          và{' '}
          <a href="#" className="text-primary font-bold hover:underline">
            Chính sách bảo mật
          </a>{' '}
          của TicketRush.
        </label>
      </div>
      {fieldErrors.terms && (
        <p className="text-xs text-red-500 ml-1">{fieldErrors.terms}</p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-4 px-6 bg-[#5700BF] text-white rounded-full font-headline font-bold text-lg shadow-[0_20px_40px_rgba(87,0,191,0.4)] hover:shadow-[0_25px_50px_rgba(87,0,191,0.5)] hover:bg-[#6b0fc8] active:scale-[0.98] transition-all duration-300 mt-8 disabled:opacity-70 disabled:cursor-not-allowed"
        >   
        {isLoading ? 'Đang xử lý...' : 'Đăng ký ngay'}
      </button>
    </form>
  );
};
