/**
 * Login Integration Examples
 * How to use LoginForm component in different scenarios
 */

// ============================================================
// 1. BASIC USAGE - Standard Login Page
// ============================================================

// File: app/login/page.tsx
import { LoginForm } from "@/app/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main>
      {/* Your page structure here */}
      <LoginForm />
    </main>
  );
}

// ============================================================
// 2. MODAL/DIALOG LOGIN
// ============================================================

// File: app/components/auth/LoginModal.tsx
'use client';

import { LoginForm } from './LoginForm';

export const LoginModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <LoginForm 
          onSubmitSuccess={() => {
            onClose();
            // Optionally trigger a page refresh or redirect
          }} 
        />
      </div>
    </div>
  );
};

// ============================================================
// 3. USING USEAUTH HOOK IN COMPONENTS
// ============================================================

'use client';

import { useAuth } from '@/lib/useAuth';

export const UserGreeting = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {user ? (
        <p>Xin chào, {user.full_name}!</p>
      ) : (
        <p>Vui lòng đăng nhập</p>
      )}
    </div>
  );
};

// ============================================================
// 4. PROTECTED ROUTES
// ============================================================

// File: app/dashboard/page.tsx
'use client';

import { ProtectedRoute } from '@/lib/ProtectedRoute';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <main>
        <h1>Dashboard</h1>
        {/* Dashboard content only visible to authenticated users */}
      </main>
    </ProtectedRoute>
  );
}

// ============================================================
// 5. API CALLS WITH AUTHENTICATION
// ============================================================

'use client';

import { authApi, apiAuthFetch, getAuthToken } from '@/lib/api';

// Using pre-built auth API
const user = await authApi.login({
  email: 'user@example.com',
  password: 'Password123'
});

// Using generic authenticated fetch for custom endpoints
const userData = await apiAuthFetch('/users/me', {
  method: 'GET'
});

// Manual token usage
const token = getAuthToken();
const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
};

// ============================================================
// 6. LOGOUT IMPLEMENTATION
// ============================================================

'use client';

import { useAuth } from '@/lib/useAuth';
import { useRouter } from 'next/navigation';

export const LogoutButton = () => {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <button onClick={handleLogout}>
      Đăng xuất
    </button>
  );
};

// ============================================================
// 7. FORM VALIDATION
// ============================================================

import { validateLoginForm, validateSignupForm } from '@/lib/validators';

const formData = {
  email: 'test@example.com',
  password: 'Password123'
};

const validation = validateLoginForm(formData);

if (!validation.isValid) {
  console.log('Errors:', validation.errors);
  // Display field errors in form
}

// ============================================================
// 8. ERROR HANDLING
// ============================================================

'use client';

import { authApi, ApiError } from '@/lib/api';

try {
  const response = await authApi.login({
    email: 'user@example.com',
    password: 'Password123'
  });
} catch (error: any) {
  if (error instanceof ApiError) {
    console.log('Status:', error.statusCode);
    console.log('Message:', error.message);
    console.log('Code:', error.code);
    
    // Handle specific error types
    if (error.statusCode === 401) {
      // Invalid credentials
    } else if (error.statusCode === 429) {
      // Too many attempts - rate limited
    }
  }
}

// ============================================================
// 9. REMEMBER ME FEATURE
// ============================================================

// LoginForm component already handles this:
// - Saves email to localStorage when "Remember Me" is checked
// - Retrieves saved email on page load
// No additional code needed!

// ============================================================
// 10. TOKEN MANAGEMENT
// ============================================================

import { 
  saveAuthToken, 
  getAuthToken, 
  removeAuthToken,
  saveUserData,
  getUserData,
  clearAuthData 
} from '@/lib/api';

// Save token after login
saveAuthToken(token);

// Get token for API requests
const currentToken = getAuthToken();

// Remove token on logout
removeAuthToken();

// Save user profile
saveUserData(user);

// Get user profile
const currentUser = getUserData();

// Clear everything
clearAuthData();

// ============================================================
// API CONFIGURATION
// ============================================================

// File: .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

// For production:
// NEXT_PUBLIC_API_URL=https://api.ticketrush.com/api/v1
