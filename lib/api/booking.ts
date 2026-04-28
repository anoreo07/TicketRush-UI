/**
 * Booking API Service
 */

import { apiFetch, apiAuthFetch } from './client';
import { BookingSummary, SelectedSeat } from '@/lib/types/booking';

export interface CreateBookingRequest {
  event_id: string;
  seats: string[]; // seat IDs
}

export interface LockSeatRequest {
  event_id: string;
  seat_id: string;
}

export interface ConfirmBookingRequest {
  booking_id: string;
  payment_method?: string;
}

export interface BookingResponse {
  id: string;
  user_id: string;
  event_id: string;
  seats: SelectedSeat[];
  total_amount: number;
  status: 'pending' | 'confirmed' | 'paid' | 'cancelled';
  created_at: string;
  expires_at: string;
}

export interface TicketResponse {
  id: string;
  booking_id: string;
  seat_id: string;
  qr_code: string;
  issued_at: string;
}

/**
 * Booking API Methods
 */
export const bookingApi = {
  /**
   * Lock a seat (10 minutes)
   * POST /bookings/lock
   */
  lockSeat: (payload: LockSeatRequest) =>
    apiAuthFetch<BookingResponse>('/bookings/lock', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  /**
   * Confirm booking and process payment
   * POST /bookings/confirm
   */
  confirmBooking: (payload: ConfirmBookingRequest) =>
    apiAuthFetch<BookingResponse>('/bookings/confirm', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  /**
   * Get user's tickets
   * GET /bookings/tickets
   */
  getTickets: () =>
    apiAuthFetch<TicketResponse[]>('/bookings/tickets', {
      method: 'GET',
    }),

  /**
   * Create a new booking (legacy)
   */
  create: (payload: CreateBookingRequest) =>
    apiAuthFetch<BookingResponse>('/bookings', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  /**
   * Get booking details
   */
  getById: (bookingId: string) =>
    apiAuthFetch<BookingResponse>(`/bookings/${bookingId}`, {
      method: 'GET',
    }),

  /**
   * Get user's bookings
   */
  getMyBookings: () =>
    apiAuthFetch<BookingResponse[]>('/bookings/my-bookings', {
      method: 'GET',
    }),

  /**
   * Get user's tickets - GET /users/me/tickets
   */
  getMyTickets: () =>
    apiAuthFetch<TicketResponse[]>('/users/me/tickets', {
      method: 'GET',
    }),

  /**
   * Cancel booking
   */
  cancel: (bookingId: string) =>
    apiAuthFetch(`/bookings/${bookingId}/cancel`, {
      method: 'POST',
    }),

  /**
   * Get available seats for event
   */
  getAvailableSeats: (eventId: string) =>
    apiAuthFetch(`/events/${eventId}/seats`, {
      method: 'GET',
    }),

  /**
   * Get user's tickets
   */
  getUserTickets: () =>
    apiAuthFetch('/bookings/my-tickets', {
      method: 'GET',
    }),
};
