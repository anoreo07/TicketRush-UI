/**
 * useBookingApi Hook
 * Manages booking API calls and state
 */

'use client';

import { useState, useCallback } from 'react';
import { bookingApi, BookingResponse, TicketResponse } from '@/lib/api/booking';
import { ApiError } from '@/lib/api/client';

interface UseBookingApiState {
  booking: BookingResponse | null;
  tickets: TicketResponse[] | null;
  isLoading: boolean;
  error: string | null;
}

interface UseBookingApiReturn extends UseBookingApiState {
  lockSeat: (eventId: string, seatId: string) => Promise<BookingResponse>;
  confirmBooking: (bookingId: string, paymentMethod?: string) => Promise<BookingResponse>;
  getTickets: () => Promise<TicketResponse[]>;
  clearError: () => void;
}

export const useBookingApi = (): UseBookingApiReturn => {
  const [state, setState] = useState<UseBookingApiState>({
    booking: null,
    tickets: null,
    isLoading: false,
    error: null,
  });

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const lockSeat = useCallback(
    async (eventId: string, seatId: string): Promise<BookingResponse> => {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        const result = await bookingApi.lockSeat({
          event_id: eventId,
          seat_id: seatId,
        });

        setState(prev => ({
          ...prev,
          booking: result,
          isLoading: false,
        }));

        return result;
      } catch (err) {
        const errorMsg = err instanceof ApiError 
          ? err.message 
          : 'Không thể giữ ghế. Vui lòng thử lại.';
        
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: errorMsg,
        }));
        throw err;
      }
    },
    []
  );

  const confirmBooking = useCallback(
    async (bookingId: string, paymentMethod?: string): Promise<BookingResponse> => {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        const result = await bookingApi.confirmBooking({
          booking_id: bookingId,
          payment_method: paymentMethod,
        });

        setState(prev => ({
          ...prev,
          booking: result,
          isLoading: false,
        }));

        return result;
      } catch (err) {
        const errorMsg = err instanceof ApiError 
          ? err.message 
          : 'Không thể xác nhận đơn hàng. Vui lòng thử lại.';
        
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: errorMsg,
        }));
        throw err;
      }
    },
    []
  );

  const getTickets = useCallback(async (): Promise<TicketResponse[]> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await bookingApi.getTickets();

      setState(prev => ({
        ...prev,
        tickets: result,
        isLoading: false,
      }));

      return result;
    } catch (err) {
      const errorMsg = err instanceof ApiError 
        ? err.message 
        : 'Không thể lấy danh sách vé. Vui lòng thử lại.';
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMsg,
      }));
      throw err;
    }
  }, []);

  return {
    ...state,
    lockSeat,
    confirmBooking,
    getTickets,
    clearError,
  };
};
