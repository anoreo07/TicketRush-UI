/**
 * Enhanced BookingContext
 * Quản lý toàn bộ booking flow theo spec
 * 
 * Flow:
 * 1. Lock seat → Xác nhận thanh toán → Confirm booking
 * 2. Xử lý error: conflict, expired, sold
 * 3. Countdown timer cho locked_until
 * 4. Auto-cancel nếu hết hạn
 */

'use client';

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useBookingFlow } from '@/lib/hooks/useBookingFlow';
import { TicketResponse } from '@/lib/api/booking';
import { bookingApi } from '@/lib/api/booking';

interface EnhancedBookingContextType {
  // State
  eventId: string | null;
  booking: any | null;
  isLoading: boolean;
  error: string | null;
  errorCode?: string;
  tickets: TicketResponse[];
  seatStates: any;

  // Actions
  setEventId: (id: string) => void;
  lockSeat: (seatId: string) => Promise<void>;
  confirmBooking: (paymentMethod?: string) => Promise<void>;
  cancelBooking: () => Promise<void>;
  getTickets: () => Promise<TicketResponse[]>;
  clearBooking: () => void;

  // Queries
  getLockedSeats: () => any[];
  getSoldSeats: () => string[];
  getSeatState: (seatId: string) => any;
  canLockSeat: (seatId: string) => boolean;
}

const EnhancedBookingContext = createContext<EnhancedBookingContextType | null>(null);

export const EnhancedBookingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [eventId, setEventId] = useState<string | null>(null);
  const [tickets, setTickets] = useState<TicketResponse[]>([]);

  // Flow manager
  const flow = eventId ? useBookingFlow(eventId) : null;

  /**
   * Lock seat
   */
  const lockSeat = useCallback(
    async (seatId: string) => {
      if (!flow) {
        throw new Error('Vui lòng chọn sự kiện trước');
      }
      await flow.lockSeat(seatId);
    },
    [flow]
  );

  /**
   * Confirm booking
   */
  const confirmBooking = useCallback(
    async (paymentMethod?: string) => {
      if (!flow) {
        throw new Error('Không có đơn hàng để xác nhận');
      }
      await flow.confirmBooking(paymentMethod);
    },
    [flow]
  );

  /**
   * Cancel booking
   */
  const cancelBooking = useCallback(async () => {
    if (!flow) {
      throw new Error('Không có đơn hàng để hủy');
    }
    await flow.cancelBooking();
  }, [flow]);

  /**
   * Get user tickets
   */
  const getTickets = useCallback(async () => {
    try {
      const result = await bookingApi.getTickets();
      setTickets(result);
      return result;
    } catch (err) {
      console.error('Failed to get tickets:', err);
      return [];
    }
  }, []);

  /**
   * Clear booking
   */
  const clearBooking = useCallback(() => {
    if (flow) {
      flow.reset();
    }
    setTickets([]);
  }, [flow]);

  const value: EnhancedBookingContextType = {
    // State
    eventId,
    booking: flow?.booking || null,
    isLoading: flow?.isLoading || false,
    error: flow?.error || null,
    errorCode: flow?.errorCode,
    tickets,
    seatStates: flow?.seatStates || {},

    // Actions
    setEventId,
    lockSeat,
    confirmBooking,
    cancelBooking,
    getTickets,
    clearBooking,

    // Queries
    getLockedSeats: flow?.getLockedSeats || (() => []),
    getSoldSeats: flow?.getSoldSeats || (() => []),
    getSeatState: flow?.getSeatState || (() => null),
    canLockSeat: flow?.canLockSeat || (() => false),
  };

  return (
    <EnhancedBookingContext.Provider value={value}>
      {children}
    </EnhancedBookingContext.Provider>
  );
};

export const useEnhancedBooking = () => {
  const context = useContext(EnhancedBookingContext);
  if (!context) {
    throw new Error('useEnhancedBooking must be used within EnhancedBookingProvider');
  }
  return context;
};
