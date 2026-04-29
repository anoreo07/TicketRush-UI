'use client';

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BookingResponse, TicketResponse } from '@/lib/api/booking';
import { bookingApi } from '@/lib/api/booking';
import { seatsApi } from '@/lib/api/seats';
import { SeatMap, Seat, Event, eventsApi } from '@/lib/api/events';
import { ApiError } from '@/lib/api/client';

interface BookingContextType {
  // State
  booking: BookingResponse | null;
  selectedSeatIds: string[];
  selectedSeats: Seat[];
  isLoading: boolean;
  error: string | null;
  eventId: string | null;
  event: Event | null;
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
  loadBooking: (id: string) => Promise<void>;
  refreshSeatMap: () => Promise<void>;
  refreshTrigger: number;
  timeLeft: number | null; // Seconds remaining
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
  const [event, setEvent] = useState<Event | null>(null);
  const [tickets, setTickets] = useState<TicketResponse[]>([]);
  const [seatMap, setSeatMap] = useState<SeatMap | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  // Fetch event details when eventId changes
  useEffect(() => {
    if (eventId) {
      eventsApi.getById(eventId)
        .then(setEvent)
        .catch(err => console.error('Failed to fetch event details:', err));
    } else {
      setEvent(null);
    }
  }, [eventId]);

  const refreshSeatMap = useCallback(async () => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

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

  const loadBooking = useCallback(
    async (id: string) => {
      console.log(`[DEBUG] BookingContext: Starting loadBooking for ID: ${id}`);
      setIsLoading(true);
      setError(null);
      try {
        const result = await bookingApi.getById(id);
        console.log(`[DEBUG] BookingContext: API result received:`, JSON.stringify(result));
        
        // Check if expired (ensure UTC timezone parsing by appending 'Z' if missing)
        const expiresAtStr = result.expires_at.endsWith('Z') ? result.expires_at : `${result.expires_at}Z`;
        const expirationTime = new Date(expiresAtStr).getTime();
        const now = new Date().getTime();
        
        console.log(`[DEBUG] BookingContext: expiresAtStr=${expiresAtStr}, expirationTime=${expirationTime}, now=${now}, diff=${expirationTime - now}ms`);
        
        if (expirationTime <= now) {
          console.warn(`[DEBUG] BookingContext: Loaded booking is already expired`);
          setError('Đơn hàng đã hết hạn giữ ghế. Vui lòng đặt lại.');
          setIsLoading(false);
          return;
        }

        setBooking(result);
        setEventId(result.event_id);
        
        // Map backend seats to context seats
        const items = result.booking_items;
        if (items) {
          const itemsArray = Array.isArray(items) ? items : [items];
          console.log(`[DEBUG] BookingContext: Mapping ${itemsArray.length} items`);
          const mappedSeats = itemsArray.map((item: any) => {
            const seat = item.seats || item.seat;
            return {
              id: seat?.id || '',
              row_index: seat?.row_index || 0,
              col_index: seat?.col_index || 0,
              price: item.price || 0,
              status: 'locked' as const,
              locked_by_user: true
            };
          });
          setSelectedSeats(mappedSeats);
          setSelectedSeatIds(mappedSeats.map(s => s.id));
          
          // Update booking object with seats property for UI compatibility
          setBooking(prev => prev ? {
            ...prev,
            seats: mappedSeats.map(s => ({
              id: s.id,
              row: s.row_index,
              number: s.col_index,
              price: s.price
            }))
          } : null);
        }
        console.log(`[DEBUG] BookingContext: loadBooking completed successfully`);
      } catch (err) {
        console.error('[DEBUG] BookingContext: Failed to load booking:', err);
        setError('Không thể tải thông tin đơn hàng');
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
    event,
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
    loadBooking,
    refreshSeatMap,
    refreshTrigger,
    timeLeft,
  };

  // Timer Effect
  useEffect(() => {
    if (!booking || !booking.expires_at || booking.status !== 'pending') {
      setTimeLeft(null);
      return;
    }

    const calculateTimeLeft = () => {
      const expiresAtStr = booking.expires_at.endsWith('Z') ? booking.expires_at : `${booking.expires_at}Z`;
      const expirationTime = new Date(expiresAtStr).getTime();
      const now = new Date().getTime();
      const difference = Math.max(0, Math.floor((expirationTime - now) / 1000));
      
      setTimeLeft(difference);

      if (difference <= 0) {
        setError('Thời gian giữ ghế đã hết hạn. Vui lòng chọn lại ghế.');
        clearBooking();
      }
    };

    // Initial calculation
    calculateTimeLeft();

    // Update every second
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [booking, clearBooking]);

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
