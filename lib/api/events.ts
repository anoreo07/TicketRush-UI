/**
 * Events API Service
 * Quản lý tất cả API calls liên quan đến events
 */

import { apiFetch, apiAuthFetch } from './client';

/**
 * Event Types
 */
export interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string; // ISO datetime
  location: string;
  venue: string;
  image_url: string;
  banner_url?: string;
  category?: string;
  price_range?: {
    min: number;
    max: number;
  };
  total_seats: number;
  available_seats: number;
  status: 'draft' | 'published' | 'ongoing' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface EventDetail extends Event {
  organizer: {
    id: string;
    name: string;
    avatar_url?: string;
  };
  rules: string[];
  refund_policy: string;
}

// Seat from backend DB
export interface Seat {
  id: string;
  col_index: number;
  price: number;
  status: 'available' | 'locked' | 'sold';
  locked_by?: string | null;
  locked_until?: string | null;
  locked_by_user?: boolean; // set client-side after lock
}

// Row in the seat matrix returned by backend
export interface SeatRow {
  row_index: number;
  seats: Seat[];
}

// Backend /events/:id/seats response shape
export interface SeatMap {
  event: {
    id: string;
    title: string;
    location: string;
    start_time: string;
    status: string;
  };
  matrix_config: {
    total_rows: number;
    total_cols: number;
  };
  seats: SeatRow[]; // array of rows
  stats: {
    total: number;
    available: number;
    locked: number;
    sold: number;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  pages: number;
}

/**
 * Events API Methods
 */
export const eventsApi = {
  /**
   * Get all events with pagination
   * GET /api/v1/events?page=1&limit=12&status=published
   */
  getAll: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    category?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.category) queryParams.append('category', params.category);

    const query = queryParams.toString();
    return apiFetch<PaginatedResponse<Event>>(
      `/events${query ? '?' + query : ''}`,
      { method: 'GET' }
    );
  },

  /**
   * Get event by ID
   * GET /api/v1/events/:id
   */
  getById: (eventId: string) =>
    apiAuthFetch<EventDetail>(`/events/${eventId}`, {
      method: 'GET',
    }),

  /**
   * Get seat map for event
   * GET /api/v1/events/:id/seats
   */
  getSeats: (eventId: string) =>
    apiAuthFetch<SeatMap>(`/events/${eventId}/seats`, {
      method: 'GET',
    }),

  /**
   * Get available seats count
   * GET /api/v1/events/:id/available-seats
   */
  getAvailableSeatsCount: (eventId: string) =>
    apiFetch<{ available: number; total: number }>(
      `/events/${eventId}/available-seats`,
      { method: 'GET' }
    ),

  /**
   * Search events
   * GET /api/v1/events/search?q=concert
   */
  search: (query: string, filters?: { category?: string; date?: string }) => {
    const params = new URLSearchParams({ q: query });
    if (filters?.category) params.append('category', filters.category);
    if (filters?.date) params.append('date', filters.date);

    return apiFetch<PaginatedResponse<Event>>(
      `/events/search?${params.toString()}`,
      { method: 'GET' }
    );
  },

  /**
   * Get trending events
   * GET /api/v1/events/trending
   */
  getTrending: (limit = 6) =>
    apiFetch<Event[]>(`/events/trending?limit=${limit}`, {
      method: 'GET',
    }),
};

/**
 * Admin Events API
 */
export const adminEventsApi = {
  /**
   * Create new event
   * POST /api/v1/events/admin
   */
  create: (payload: {
    title: string;
    description: string;
    start_time: string;
    location: string;
    category?: string;
    banner_url?: string;
    matrix_config: {
      total_rows: number;
      total_cols: number;
    };
    seat_price: number;
  }) =>
    apiAuthFetch<Event>('/events/admin', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  /**
   * Update event
   * PATCH /api/v1/events/admin/:id
   */
  update: (eventId: string, payload: Partial<Event>) =>
    apiAuthFetch<Event>(`/events/admin/${eventId}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),

  /**
   * Tải ảnh banner (chỉ Admin)
   * POST /api/v1/events/admin/upload-banner
   */
  uploadBanner: (payload: { fileName: string, mimeType: string, base64: string }) =>
    apiAuthFetch<{ url: string }>('/events/admin/upload-banner', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  /**
   * Publish event
   * PATCH /api/v1/events/admin/:id/publish
   */
  publish: (eventId: string) =>
    apiAuthFetch<Event>(`/events/admin/${eventId}/publish`, {
      method: 'PATCH',
    }),

  /**
   * Cancel event
   * PATCH /api/v1/events/admin/:id/cancel
   */
  cancel: (eventId: string) =>
    apiAuthFetch<Event>(`/events/admin/${eventId}/cancel`, {
      method: 'PATCH',
    }),

  /**
   * Delete event
   * DELETE /api/v1/events/admin/:id
   */
  delete: (eventId: string) =>
    apiAuthFetch(`/events/admin/${eventId}`, {
      method: 'DELETE',
    }),
};
