'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye } from 'lucide-react';
import { authApi, saveAuthToken, saveUserData } from '@/lib/api';
import { validateLoginForm } from '@/lib/validators';

interface LoginFormProps {
  onSubmitSuccess?: () => void;
}

export const LoginForm = ({ onSubmitSuccess }: LoginFormProps) => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
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
    const validation = validateLoginForm(formData);
    if (!validation.isValid) {
      setFieldErrors(validation.errors);
      return;
    }

    setIsLoading(true);

    try {
      // Call login API
      const response = await authApi.login({
        email: formData.email,
        password: formData.password,
      });

      // Save auth data
      saveAuthToken(response.token);
      saveUserData(response.user);

      // Save "Remember me" preference
      if (rememberMe) {
        try {
          localStorage.setItem('rememberEmail', formData.email);
        } catch (error) {
          console.error('Failed to save remember me:', error);
        }
      }

      // Call callback or redirect
      if (onSubmitSuccess) {
        onSubmitSuccess();
      } else {
        router.push('/');
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại.';
      setServerError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Load remembered email on mount
  const handleLoadRemembered = () => {
    try {
      const rememberedEmail = localStorage.getItem('rememberEmail');
      if (rememberedEmail) {
        setFormData(prev => ({ ...prev, email: rememberedEmail }));
        setRememberMe(true);
      }
    } catch (error) {
      console.error('Failed to load remembered email:', error);
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {/* Server Error Alert */}
      {serverError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-700 font-medium">{serverError}</p>
        </div>
      )}

      {/* Email Input */}
      <div className="space-y-2">
        <label
          className="block text-sm font-semibold text-[#484554] ml-1"
          htmlFor="email"
        >
          Địa chỉ Email
        </label>
        <input
          className={`w-full px-5 py-3.5 rounded-xl border transition-all bg-white text-[#191c1e] ${
            fieldErrors.email
              ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
              : 'border-[#c9c4d7] focus:border-[#301ec9] focus:ring-2 focus:ring-[#301ec9]/20'
          }`}
          id="email"
          name="email"
          placeholder="name@company.com"
          type="email"
          value={formData.email}
          onChange={handleChange}
          disabled={isLoading}
        />
        {fieldErrors.email && (
          <p className="text-xs text-red-500 ml-1">{fieldErrors.email}</p>
        )}
      </div>

      {/* Password Input */}
      <div className="space-y-2">
        <div className="flex justify-between items-center ml-1">
          <label
            className="block text-sm font-semibold text-[#484554]"
            htmlFor="password"
          >
            Mật khẩu
          </label>
          <a
            className="text-sm font-bold text-[#301ec9] hover:underline"
            href="/forgot-password"
          >
            Quên mật khẩu?
          </a>
        </div>
        <div className="relative">
          <input
            className={`w-full px-5 py-3.5 rounded-xl border transition-all bg-white text-[#191c1e] ${
              fieldErrors.password
                ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                : 'border-[#c9c4d7] focus:border-[#301ec9] focus:ring-2 focus:ring-[#301ec9]/20'
            }`}
            id="password"
            name="password"
            placeholder="••••••••"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            disabled={isLoading}
          />
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#c9c4d7] hover:text-[#797586] transition-colors disabled:opacity-50"
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading}
          >
            <Eye className="h-5 w-5" />
          </button>
        </div>
        {fieldErrors.password && (
          <p className="text-xs text-red-500 ml-1">{fieldErrors.password}</p>
        )}
      </div>

      {/* Remember Me */}
      <div className="flex items-center gap-3 ml-1">
        <input
          className="w-5 h-5 rounded border-[#c9c4d7] text-[#301ec9] focus:ring-[#301ec9]/20 cursor-pointer disabled:opacity-50"
          id="remember"
          name="rememberMe"
          type="checkbox"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
          disabled={isLoading}
        />
        <label
          className="text-sm font-medium text-[#484554] cursor-pointer"
          htmlFor="remember"
        >
          Ghi nhớ đăng nhập
        </label>
      </div>

      {/* Submit Button */}
      <button
        className="w-full py-4 bg-gradient-to-r from-[#301ec9] to-[#5700bf] text-white rounded-full font-bold text-lg shadow-[0_20px_40px_rgba(48,30,201,0.15)] hover:shadow-[0_20px_40px_rgba(48,30,201,0.25)] hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
      </button>
    </form>
  );
};
