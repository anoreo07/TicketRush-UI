/**
 * useBookingFlow - Quản lý toàn bộ booking flow
 * 
 * Flow:
 * 1. Lock seat → Xác nhận thanh toán → Confirm booking
 * 2. Xử lý error: conflict (409), expired (410), sold (400)
 * 3. Optimistic update + rollback khi error
 * 4. Countdown timer cho locked_until
 */

'use client';

import { useState, useCallback, useRef } from 'react';
import { bookingApi, BookingResponse } from '@/lib/api/booking';
import { useBookingSeatManager, SeatLockInfo } from './useBookingSeatManager';
import { ApiError } from '@/lib/api/client';

export interface BookingFlowState {
  booking: BookingResponse | null;
  isLoading: boolean;
  error: string | null;
  errorCode?: string;
}

export type BookingErrorType = 
  | 'SEAT_CONFLICT' // 409 - ghế đã bị người khác giữ
  | 'SEAT_SOLD' // 400 - ghế đã được bán
  | 'BOOKING_EXPIRED' // 410 - đơn hàng hết hạn
  | 'PAYMENT_FAILED' // payment error
  | 'NETWORK_ERROR' // network error
  | 'UNKNOWN_ERROR';

const parseBookingError = (error: unknown): { message: string; code: BookingErrorType } => {
  if (error instanceof ApiError) {
    // Phân loại error dựa vào HTTP statusCode
    if (error.statusCode === 409) {
      return {
        message: 'Ghế đã có người giữ. Vui lòng chọn ghế khác.',
        code: 'SEAT_CONFLICT',
      };
    }
    if (error.statusCode === 400 && error.message.includes('sold')) {
      return {
        message: 'Ghế này đã được bán rồi.',
        code: 'SEAT_SOLD',
      };
    }
    if (error.statusCode === 410) {
      return {
        message: 'Thời hạn giữ ghế đã hết. Vui lòng thử lại.',
        code: 'BOOKING_EXPIRED',
      };
    }
    if (error.message) {
      return {
        message: error.message,
        code: 'UNKNOWN_ERROR',
      };
    }
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      code: 'NETWORK_ERROR',
    };
  }

  return {
    message: 'Đã xảy ra lỗi. Vui lòng thử lại.',
    code: 'UNKNOWN_ERROR',
  };
};

export const useBookingFlow = (eventId: string) => {
  const [state, setState] = useState<BookingFlowState>({
    booking: null,
    isLoading: false,
    error: null,
  });

  const seatManager = useBookingSeatManager(eventId);
  const lockTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Lock seat
   * - Gọi API POST /bookings/lock
   * - Optimistic update: set ghế thành locked
   * - Nếu fail: rollback + set error
   */
  const lockSeat = useCallback(
    async (seatId: string) => {
      // Check if can lock
      if (!seatManager.canLockSeat(seatId)) {
        const currentState = seatManager.getSeatState(seatId);
        if (currentState?.status === 'locked' && currentState.lockInfo?.locked_by_user) {
          // Ghế đã locked bởi user hiện tại → unlock (toggle)
          seatManager.unlockSeat(seatId);
          return;
        }
        return;
      }

      setState(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        // API call
        const result = await bookingApi.lockSeat({
          event_id: eventId,
          seat_id: seatId,
        });

        // Success: Update state
        const lockInfo: SeatLockInfo = {
          booking_id: result.id,
          locked_at: result.created_at,
          locked_until: result.expires_at,
          locked_by_user: true,
          time_remaining: new Date(result.expires_at).getTime() - Date.now(),
        };

        seatManager.lockSeat(seatId, lockInfo);
        setState(prev => ({
          ...prev,
          booking: result,
          isLoading: false,
          error: null,
        }));
      } catch (err) {
        // Error: Parse & Set error message
        const { message, code } = parseBookingError(err);
        
        // Handle specific errors
        if (code === 'SEAT_CONFLICT') {
          // Ghế đã bị người khác giữ → lock_by_other
          const lockInfo: SeatLockInfo = {
            booking_id: 'unknown',
            locked_at: new Date().toISOString(),
            locked_until: new Date(Date.now() + 10 * 60000).toISOString(),
            locked_by_user: false,
            time_remaining: 10 * 60 * 1000,
          };
          seatManager.setSeatLockedByOther(seatId, lockInfo);
        } else if (code === 'SEAT_SOLD') {
          // Ghế đã bán
          // TODO: Cập nhật trạng thái ghế từ API
        }

        seatManager.setSeatError(seatId, message);
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: message,
          errorCode: code,
        }));
      }
    },
    [eventId, seatManager]
  );

  /**
   * Confirm booking (thanh toán)
   * - Gọi API POST /bookings/confirm
   * - Nếu success: cập nhật ghế thành sold
   * - Nếu expire: tự động unlock ghế
   */
  const confirmBooking = useCallback(
    async (paymentMethod?: string) => {
      if (!state.booking) {
        setState(prev => ({
          ...prev,
          error: 'Không có đơn hàng để xác nhận',
          errorCode: 'UNKNOWN_ERROR',
        }));
        return;
      }

      setState(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        // API call
        const result = await bookingApi.confirmBooking({
          booking_id: state.booking.id,
          payment_method: paymentMethod,
        });

        // Success: Update seat status to sold
        const lockedSeats = seatManager.getLockedSeats();
        lockedSeats.forEach(({ seatId }) => {
          seatManager.confirmSeat(seatId);
        });

        setState(prev => ({
          ...prev,
          booking: result,
          isLoading: false,
          error: null,
        }));
      } catch (err) {
        // Error: Parse & Set error message
        const { message, code } = parseBookingError(err);

        if (code === 'BOOKING_EXPIRED') {
          // Tự động unlock tất cả ghế
          const lockedSeats = seatManager.getLockedSeats();
          lockedSeats.forEach(({ seatId }) => {
            seatManager.unlockSeat(seatId);
          });
        }

        setState(prev => ({
          ...prev,
          isLoading: false,
          error: message,
          errorCode: code,
        }));
      }
    },
    [state.booking, seatManager]
  );

  /**
   * Cancel booking
   */
  const cancelBooking = useCallback(async () => {
    if (!state.booking) return;

    try {
      await bookingApi.cancel(state.booking.id);

      // Unlock tất cả ghế
      const lockedSeats = seatManager.getLockedSeats();
      lockedSeats.forEach(({ seatId }) => {
        seatManager.unlockSeat(seatId);
      });

      setState({
        booking: null,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      const { message } = parseBookingError(err);
      setState(prev => ({
        ...prev,
        error: message,
      }));
    }
  }, [state.booking, seatManager]);

  /**
   * Reset booking
   */
  const reset = useCallback(() => {
    if (lockTimeoutRef.current) {
      clearTimeout(lockTimeoutRef.current);
    }
    seatManager.resetAll();
    setState({
      booking: null,
      isLoading: false,
      error: null,
    });
  }, [seatManager]);

  return {
    // State
    booking: state.booking,
    isLoading: state.isLoading,
    error: state.error,
    errorCode: state.errorCode,

    // Seat Manager
    seatStates: seatManager.seatStates,
    getSeatState: seatManager.getSeatState,
    canLockSeat: seatManager.canLockSeat,
    canConfirmSeat: seatManager.canConfirmSeat,
    getLockedSeats: seatManager.getLockedSeats,
    getSoldSeats: seatManager.getSoldSeats,

    // Actions
    lockSeat,
    confirmBooking,
    cancelBooking,
    reset,
  };
};
