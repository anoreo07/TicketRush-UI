/**
 * useEvents - Hook để quản lý events
 * 
 * Features:
 * - Fetch events list với pagination
 * - Fetch event detail
 * - Fetch seat map
 * - Search events
 * - Cache management
 */

'use client';

import { useState, useCallback, useEffect } from 'react';
import { eventsApi, Event, EventDetail, SeatMap, PaginatedResponse } from '@/lib/api/events';
import { ApiError } from '@/lib/api/client';

interface UseEventsState {
  events: Event[];
  currentEvent: EventDetail | null;
  seatMap: SeatMap | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const useEvents = () => {
  const [state, setState] = useState<UseEventsState>({
    events: [],
    currentEvent: null,
    seatMap: null,
    isLoading: false,
    error: null,
    pagination: {
      page: 1,
      limit: 12,
      total: 0,
      pages: 0,
    },
  });

  /**
   * Fetch events list
   */
  const fetchEvents = useCallback(
    async (page = 1, limit = 12, search?: string, status?: string) => {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        const result = await eventsApi.getAll({
          page,
          limit,
          search,
          status: status || 'published',
        });

        setState(prev => ({
          ...prev,
          events: result.data,
          pagination: {
            page: result.page,
            limit: result.limit,
            total: result.total,
            pages: result.pages,
          },
          isLoading: false,
        }));

        return result;
      } catch (err) {
        const errorMsg = err instanceof ApiError ? err.message : 'Không thể tải danh sách sự kiện';
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

  /**
   * Fetch event detail
   */
  const fetchEventDetail = useCallback(async (eventId: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const eventDetail = await eventsApi.getById(eventId);
      setState(prev => ({
        ...prev,
        currentEvent: eventDetail,
        isLoading: false,
      }));

      return eventDetail;
    } catch (err) {
      const errorMsg = err instanceof ApiError ? err.message : 'Không thể tải chi tiết sự kiện';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMsg,
      }));
      throw err;
    }
  }, []);

  /**
   * Fetch seat map
   */
  const fetchSeatMap = useCallback(async (eventId: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      console.log('🔄 Fetching seat map for event:', eventId);
      console.log('🔄 eventId type:', typeof eventId);
      console.log('🔄 eventId length:', eventId?.length);
      console.log('🔄 eventId falsy?:', !eventId);
      if (!eventId) {
        throw new Error('eventId is required');
      }
      const seatMap = await eventsApi.getSeats(eventId);
      console.log('✅ Seat map loaded:', seatMap);
      setState(prev => ({
        ...prev,
        seatMap,
        isLoading: false,
      }));

      return seatMap;
    } catch (err) {
      console.error('❌ Failed to fetch seat map:', err);
      const errorMsg = err instanceof ApiError ? err.message : 'Không thể tải sơ đồ ghế';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMsg,
      }));
      throw err;
    }
  }, []);

  /**
   * Fetch event both detail and seat map
   */
  const loadEvent = useCallback(
    async (eventId: string) => {
      try {
        const [eventDetail, seatMap] = await Promise.all([
          fetchEventDetail(eventId),
          fetchSeatMap(eventId),
        ]);

        return { eventDetail, seatMap };
      } catch (err) {
        console.error('Failed to load event:', err);
        throw err;
      }
    },
    [fetchEventDetail, fetchSeatMap]
  );

  /**
   * Search events
   */
  const searchEvents = useCallback(async (query: string, category?: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await eventsApi.search(query, { category });
      setState(prev => ({
        ...prev,
        events: result.data,
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          pages: result.pages,
        },
        isLoading: false,
      }));

      return result;
    } catch (err) {
      const errorMsg = err instanceof ApiError ? err.message : 'Không thể tìm kiếm sự kiện';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMsg,
      }));
      throw err;
    }
  }, []);

  /**
   * Get trending events
   */
  const getTrending = useCallback(async (limit = 6) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const trending = await eventsApi.getTrending(limit);
      setState(prev => ({
        ...prev,
        events: trending,
        isLoading: false,
      }));

      return trending;
    } catch (err) {
      const errorMsg = err instanceof ApiError ? err.message : 'Không thể tải sự kiện hot';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMsg,
      }));
      throw err;
    }
  }, []);

  /**
   * Clear current event
   */
  const clearCurrentEvent = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentEvent: null,
      seatMap: null,
    }));
  }, []);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setState(prev => ({
      ...prev,
      error: null,
    }));
  }, []);

  return {
    // State
    events: state.events,
    currentEvent: state.currentEvent,
    seatMap: state.seatMap,
    isLoading: state.isLoading,
    error: state.error,
    pagination: state.pagination,

    // Actions
    fetchEvents,
    fetchEventDetail,
    fetchSeatMap,
    loadEvent,
    searchEvents,
    getTrending,
    clearCurrentEvent,
    clearError,
  };
};
