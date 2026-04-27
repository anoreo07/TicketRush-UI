/**
 * Export all API endpoints
 */

export { authApi, type RegisterRequest, type LoginRequest, type AuthResponse } from './auth';
export { eventsApi, type Event, type EventDetail, type Seat, type SeatMap, type PaginatedResponse } from './events';
export { passwordApi } from './password';
export { apiFetch, apiAuthFetch, ApiError, API_CONFIG, type ApiResponse } from './client';
export { saveAuthToken, getAuthToken, removeAuthToken, saveUserData, getUserData, clearAuthData } from './client';
