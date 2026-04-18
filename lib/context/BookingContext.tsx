/**
 * BookingContext
 * Shared state for booking workflow
 */

'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { BookingResponse, TicketResponse } from '@/lib/api/booking';
import { bookingApi } from '@/lib/api/booking';
import { ApiError } from '@/lib/api/client';

interface BookingContextType {
  // State
  booking: BookingResponse | null;
  selectedSeatIds: string[];
  isLoading: boolean;
  error: string | null;
  eventId: string | null;
  tickets: TicketResponse[];

  // Actions
  setEventId: (id: string) => void;
  lockSeat: (seatId: string) => Promise<void>;
  confirmBooking: (paymentMethod?: string) => Promise<void>;
  getTickets: () => Promise<TicketResponse[]>;
  setError: (error: string | null) => void;
  clearBooking: () => void;
}

const BookingContext = createContext<BookingContextType | null>(null);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [booking, setBooking] = useState<BookingResponse | null>(null);
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [eventId, setEventId] = useState<string | null>(null);
  const [tickets, setTickets] = useState<TicketResponse[]>([]);

  const lockSeat = useCallback(
    async (seatId: string) => {
      if (!eventId) {
        setError('Vui lòng chọn sự kiện trước');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const result = await bookingApi.lockSeat({
          event_id: eventId,
          seat_id: seatId,
        });

        setBooking(result);
        setSelectedSeatIds(prev => [...prev, seatId]);
      } catch (err) {
        const errorMsg = err instanceof ApiError
          ? err.message
          : 'Không thể giữ ghế. Vui lòng thử lại.';
        setError(errorMsg);
      } finally {
        setIsLoading(false);
      }
    },
    [eventId]
  );

  const confirmBooking = useCallback(
    async (paymentMethod?: string) => {
      if (!booking) {
        setError('Không có đơn hàng để xác nhận');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const result = await bookingApi.confirmBooking({
          booking_id: booking.id,
          payment_method: paymentMethod,
        });

        setBooking(result);
      } catch (err) {
        const errorMsg = err instanceof ApiError
          ? err.message
          : 'Không thể xác nhận đơn hàng. Vui lòng thử lại.';
        setError(errorMsg);
      } finally {
        setIsLoading(false);
      }
    },
    [booking]
  );

  const clearBooking = useCallback(() => {
    setBooking(null);
    setSelectedSeatIds([]);
    setError(null);
  }, []);

  const getTickets = useCallback(
    async () => {
      setIsLoading(true);
      setError(null);

      try {
        const userTickets = await bookingApi.getTickets();
        setTickets(userTickets);
        return userTickets;
      } catch (err) {
        const errorMsg = err instanceof ApiError
          ? err.message
          : 'Không thể lấy danh sách vé. Vui lòng thử lại.';
        setError(errorMsg);
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const value: BookingContextType = {
    booking,
    selectedSeatIds,
    isLoading,
    error,
    eventId,
    tickets,
    setEventId,
    lockSeat,
    confirmBooking,
    getTickets,
    setError,
    clearBooking,
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBookingContext = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBookingContext must be used within BookingProvider');
  }
  return context;
};
