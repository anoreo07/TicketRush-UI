/**
 * EventBookingContext
 * Quản lý toàn bộ flow: Events → Seat Selection → Booking → Payment
 * 
 * State:
 * - Events list & pagination
 * - Selected event & seat map
 * - Booking flow (lock, confirm, tickets)
 * - Global error handling
 */

'use client';

import { createContext, useContext, useCallback, useState, useEffect } from 'react';
import { useEvents } from '@/lib/hooks/useEvents';
import { useBookingFlow } from '@/lib/hooks/useBookingFlow';
import { Event, EventDetail, SeatMap } from '@/lib/api/events';
import { BookingResponse, TicketResponse } from '@/lib/api/booking';
import { bookingApi } from '@/lib/api/booking';

interface EventBookingContextType {
  // Events State
  events: Event[];
  currentEvent: EventDetail | null;
  seatMap: SeatMap | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };

  // Booking State
  booking: BookingResponse | null;
  tickets: TicketResponse[];
  seatStates: any;
  isLoading: boolean;
  error: string | null;
  errorCode?: string;
  stage: 'events' | 'event-detail' | 'seat-selection' | 'checkout' | 'payment' | 'tickets';

  // Events Actions
  fetchEvents: (page?: number, limit?: number, search?: string) => Promise<void>;
  searchEvents: (query: string) => Promise<void>;
  getTrendingEvents: () => Promise<void>;
  selectEvent: (eventId: string) => Promise<void>;
  deselectEvent: () => void;

  // Booking Actions
  lockSeat: (seatId: string) => Promise<void>;
  unlockSeat: (seatId: string) => void;
  confirmBooking: (paymentMethod?: string) => Promise<void>;
  getTickets: () => Promise<TicketResponse[]>;
  clearBooking: () => void;

  // Utilities
  canConfirmBooking: () => boolean;
  getLockedSeats: () => any[];
}

const EventBookingContext = createContext<EventBookingContextType | null>(null);

export const EventBookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const eventsHook = useEvents();
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [stage, setStage] = useState<EventBookingContextType['stage']>('events');
  const [tickets, setTickets] = useState<TicketResponse[]>([]);

  // Initialize booking flow - always call, but with null check for actual eventId
  const bookingFlow = useBookingFlow(selectedEventId || 'temp');

  /**
   * Select event and load details + seat map
   */
  const selectEvent = useCallback(
    async (eventId: string) => {
      try {
        setSelectedEventId(eventId);
        await eventsHook.loadEvent(eventId);
        setStage('seat-selection');
      } catch (err) {
        console.error('Failed to select event:', err);
      }
    },
    [eventsHook]
  );

  /**
   * Deselect event
   */
  const deselectEvent = useCallback(() => {
    setSelectedEventId(null);
    eventsHook.clearCurrentEvent();
    setStage('events');
  }, [eventsHook]);

  /**
   * Fetch events
   */
  const fetchEvents = useCallback(
    async (page = 1, limit = 12, search?: string) => {
      await eventsHook.fetchEvents(page, limit, search, 'published');
      setStage('events');
    },
    [eventsHook]
  );

  /**
   * Search events
   */
  const searchEvents = useCallback(
    async (query: string) => {
      await eventsHook.searchEvents(query);
      setStage('events');
    },
    [eventsHook]
  );

  /**
   * Get trending events
   */
  const getTrendingEvents = useCallback(async () => {
    await eventsHook.getTrending(12);
    setStage('events');
  }, [eventsHook]);

  /**
   * Lock seat
   */
  const lockSeat = useCallback(
    async (seatId: string) => {
      if (!selectedEventId) {
        throw new Error('Vui lòng chọn sự kiện trước');
      }
      await bookingFlow.lockSeat(seatId);
    },
    [bookingFlow, selectedEventId]
  );

  /**
   * Unlock seat
   */
  const unlockSeat = useCallback(
    (seatId: string) => {
      if (!selectedEventId) return;
      const seatState = bookingFlow.getSeatState(seatId);
      if (seatState?.status === 'locked' && seatState.lockInfo?.locked_by_user) {
        bookingFlow.seatStates[seatId].status = 'available';
      }
    },
    [bookingFlow, selectedEventId]
  );

  /**
   * Confirm booking
   */
  const confirmBooking = useCallback(
    async (paymentMethod?: string) => {
      if (!selectedEventId) {
        throw new Error('Vui lòng chọn sự kiện trước');
      }
      await bookingFlow.confirmBooking(paymentMethod);
      setStage('payment');
    },
    [bookingFlow, selectedEventId]
  );

  /**
   * Get tickets
   */
  const getTickets = useCallback(async () => {
    try {
      const result = await bookingApi.getTickets();
      setTickets(result);
      setStage('tickets');
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
    if (selectedEventId) {
      bookingFlow.reset();
    }
    setSelectedEventId(null);
    setTickets([]);
    setStage('events');
  }, [bookingFlow, selectedEventId]);

  /**
   * Can confirm booking
   */
  const canConfirmBooking = useCallback(() => {
    if (!bookingFlow) return false;
    const lockedSeats = bookingFlow.getLockedSeats();
    return lockedSeats.length > 0 && !bookingFlow.isLoading;
  }, [bookingFlow]);

  const value: EventBookingContextType = {
    // Events State
    events: eventsHook.events || [],
    currentEvent: eventsHook.currentEvent,
    seatMap: eventsHook.seatMap,
    pagination: eventsHook.pagination || {
      page: 1,
      limit: 12,
      total: 0,
      pages: 0,
    },

    // Booking State
    booking: bookingFlow.booking || null,
    tickets,
    seatStates: bookingFlow.seatStates || {},
    isLoading: eventsHook.isLoading || bookingFlow.isLoading || false,
    error: eventsHook.error || bookingFlow.error || null,
    errorCode: bookingFlow.errorCode,
    stage,

    // Events Actions
    fetchEvents,
    searchEvents,
    getTrendingEvents,
    selectEvent,
    deselectEvent,

    // Booking Actions
    lockSeat,
    unlockSeat,
    confirmBooking,
    getTickets,
    clearBooking,

    // Utilities
    canConfirmBooking,
    getLockedSeats: bookingFlow.getLockedSeats || (() => []),
  };

  return (
    <EventBookingContext.Provider value={value}>{children}</EventBookingContext.Provider>
  );
};

export const useEventBooking = () => {
  const context = useContext(EventBookingContext);
  if (!context) {
    throw new Error('useEventBooking must be used within EventBookingProvider');
  }
  return context;
};
