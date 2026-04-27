/**
 * Seats API Service
 */

import { apiAuthFetch, apiFetch } from './client';

export interface LockSeatRequest {
  event_id: string;
  seat_id: string;
}

export interface LockSeatResponse {
  seat_id: string;
  locked_until: string;
  status: string;
}

export interface LockedSeat {
  id: string;
  seat_number: string;
  event_id: string;
  locked_until: string;
  price: number;
}

/**
 * Seats API Methods
 */
export const seatsApi = {
  /**
   * Lock a seat (10 minutes)
   * POST /seats/lock
   */
  lockSeat: (payload: LockSeatRequest) =>
    apiAuthFetch<LockSeatResponse>('/seats/lock', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  /**
   * Unlock a seat
   * POST /seats/unlock/:id
   */
  unlockSeat: (seatId: string) =>
    apiAuthFetch(`/seats/unlock/${seatId}`, {
      method: 'POST',
    }),

  /**
   * Get user's locked seats
   * GET /seats/locked
   */
  getLockedSeats: () =>
    apiAuthFetch<LockedSeat[]>('/seats/locked', {
      method: 'GET',
    }),

  /**
   * Check seat status
   * GET /seats/:id/status
   */
  checkSeatStatus: (seatId: string) =>
    apiFetch(`/seats/${seatId}/status`, {
      method: 'GET',
    }),
};
