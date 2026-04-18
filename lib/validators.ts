/**
 * Frontend Validation Functions
 * Validates form data before sending to backend
 */

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Validate email format
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * - Minimum 8 characters
 * - Must contain at least one uppercase letter
 * - Must contain at least one lowercase letter
 * - Must contain at least one number
 */
export const validatePassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

/**
 * Validate full name
 * - Minimum 2 characters
 * - Only letters, spaces, and hyphens
 */
export const validateFullName = (fullName: string): boolean => {
  const nameRegex = /^[a-zA-ZÀ-ỿ\s\-]{2,}$/;
  return nameRegex.test(fullName.trim());
};

/**
 * Validate phone number (Vietnamese format)
 * - Must be 10-11 digits
 * - Can start with +84 or 0
 */
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^(\+84|0)[0-9]{9,10}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Validate signup form
 */
export const validateSignupForm = (formData: {
  full_name: string;
  email: string;
  password: string;
  confirm_password: string;
  terms: boolean;
}): ValidationResult => {
  const errors: Record<string, string> = {};

  // Validate full name
  if (!formData.full_name.trim()) {
    errors.full_name = 'Vui lòng nhập họ và tên';
  } else if (!validateFullName(formData.full_name)) {
    errors.full_name = 'Họ và tên phải có ít nhất 2 ký tự và chỉ chứa chữ cái';
  }

  // Validate email
  if (!formData.email.trim()) {
    errors.email = 'Vui lòng nhập email';
  } else if (!validateEmail(formData.email)) {
    errors.email = 'Email không hợp lệ';
  }

  // Validate password
  if (!formData.password) {
    errors.password = 'Vui lòng nhập mật khẩu';
  } else if (!validatePassword(formData.password)) {
    errors.password = 'Mật khẩu phải có ít nhất 8 ký tự, chứa chữ hoa, chữ thường và số';
  }

  // Validate confirm password
  if (!formData.confirm_password) {
    errors.confirm_password = 'Vui lòng xác nhận mật khẩu';
  } else if (formData.password !== formData.confirm_password) {
    errors.confirm_password = 'Mật khẩu xác nhận không khớp';
  }

  // Validate terms
  if (!formData.terms) {
    errors.terms = 'Bạn phải đồng ý với điều khoản dịch vụ';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate login form
 */
export const validateLoginForm = (formData: {
  email: string;
  password: string;
}): ValidationResult => {
  const errors: Record<string, string> = {};

  // Validate email
  if (!formData.email.trim()) {
    errors.email = 'Vui lòng nhập email';
  } else if (!validateEmail(formData.email)) {
    errors.email = 'Email không hợp lệ';
  }

  // Validate password
  if (!formData.password) {
    errors.password = 'Vui lòng nhập mật khẩu';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
