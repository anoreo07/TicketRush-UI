'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { BookingResponse, TicketResponse } from '@/lib/api/booking';
import { bookingApi } from '@/lib/api/booking';
import { seatsApi } from '@/lib/api/seats';
import { SeatMap, Seat } from '@/lib/api/events';
import { ApiError } from '@/lib/api/client';

interface BookingContextType {
  // State
  booking: BookingResponse | null;
  selectedSeatIds: string[];
  selectedSeats: Seat[];
  isLoading: boolean;
  error: string | null;
  eventId: string | null;
  tickets: TicketResponse[];
  seatMap: SeatMap | null;

  // Actions
  setEventId: (id: string) => void;
  setSeatMap: (map: SeatMap | null) => void;
  lockSeat: (seat: Seat) => Promise<void>;
  unlockSeat: (seatId: string) => Promise<void>;
  confirmBooking: (paymentMethod?: string) => Promise<void>;
  getTickets: () => Promise<TicketResponse[]>;
  setError: (error: string | null) => void;
  clearBooking: () => void;
}

const BookingContext = createContext<BookingContextType | null>(null);

export const BookingProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [booking, setBooking] = useState<BookingResponse | null>(null);
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [eventId, setEventId] = useState<string | null>(null);
  const [tickets, setTickets] = useState<TicketResponse[]>([]);
  const [seatMap, setSeatMap] = useState<SeatMap | null>(null);

  const lockSeat = useCallback(
    async (seat: Seat) => {
      if (!eventId) {
        setError('Vui lòng chọn sự kiện trước');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const result = await bookingApi.lockSeat({
          event_id: eventId,
          seat_id: seat.id,
        });

        setBooking(result);
        setSelectedSeatIds(prev => [...prev, seat.id]);
        setSelectedSeats(prev => [...prev, { ...seat, status: 'locked', locked_by_user: true }]);
      } catch (err) {
        const errorMsg = err instanceof ApiError
          ? err.message
          : 'Không thể giữ ghế. Vui lòng thử lại.';
        setError(errorMsg);
        throw err; // re-throw so SeatSelection can handle optimistic rollback
      } finally {
        setIsLoading(false);
      }
    },
    [eventId]
  );

  const unlockSeat = useCallback(
    async (seatId: string) => {
      setIsLoading(true);
      setError(null);

      try {
        await seatsApi.unlockSeat(seatId);
        setSelectedSeatIds(prev => prev.filter(id => id !== seatId));
        setSelectedSeats(prev => prev.filter(s => s.id !== seatId));
      } catch (err) {
        // On unlock error, still remove optimistically from UI
        setSelectedSeatIds(prev => prev.filter(id => id !== seatId));
        setSelectedSeats(prev => prev.filter(s => s.id !== seatId));
      } finally {
        setIsLoading(false);
      }
    },
    []
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
        
        // Save details for success page
        sessionStorage.setItem('bookingDetails', JSON.stringify({
          bookingId: result.id,
          totalAmount: result.total_amount,
          seatCount: result.seat_ids?.length || 1,
        }));

        // Redirect to success page
        router.push('/success');
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
    setSelectedSeats([]);
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
    selectedSeats,
    isLoading,
    error,
    eventId,
    tickets,
    seatMap,
    setEventId,
    setSeatMap,
    lockSeat,
    unlockSeat,
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
