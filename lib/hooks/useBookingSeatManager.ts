/**
 * useBookingSeatManager - Quản lý trạng thái ghế trong booking flow
 * 
 * Xử lý:
 * - Trạng thái ghế: available, locked, sold, locked_by_other
 * - Countdown timer cho locked_until
 * - Các state phụ: locked_at, locked_until, lock_timeout
 * - Tự động hủy ghế khi hết hạn
 */

'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

export interface SeatLockInfo {
  booking_id: string;
  locked_at: string; // ISO timestamp
  locked_until: string; // ISO timestamp
  locked_by_user: boolean; // true = user hiện tại, false = user khác
  time_remaining: number; // milliseconds
}

export type SeatStatus = 'available' | 'locked' | 'sold' | 'locked_by_other';

export interface SeatState {
  status: SeatStatus;
  lockInfo?: SeatLockInfo;
  error?: string;
}

interface SeatManagerState {
  [seatId: string]: SeatState;
}

export const useBookingSeatManager = (eventId?: string) => {
  const [seatStates, setSeatStates] = useState<SeatManagerState>({});
  const timersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  /**
   * Cập nhật trạng thái ghế
   */
  const setSeatState = useCallback((seatId: string, state: SeatState) => {
    setSeatStates(prev => ({
      ...prev,
      [seatId]: state,
    }));
  }, []);

  /**
   * Lock a seat
   */
  const lockSeat = useCallback((seatId: string, lockInfo: SeatLockInfo) => {
    setSeatState(seatId, {
      status: 'locked',
      lockInfo,
      error: undefined,
    });

    // Start countdown timer
    startLockCountdown(seatId, lockInfo.locked_until);
  }, [setSeatState]);

  /**
   * Start countdown timer cho seat lock
   */
  const startLockCountdown = useCallback((seatId: string, lockedUntil: string) => {
    // Clear existing timer
    const existingTimer = timersRef.current.get(seatId);
    if (existingTimer) clearTimeout(existingTimer);

    const updateTimer = () => {
      const now = new Date().getTime();
      const unlockTime = new Date(lockedUntil).getTime();
      const timeRemaining = Math.max(0, unlockTime - now);

      setSeatStates(prev => {
        const currentState = prev[seatId];
        if (!currentState || currentState.status !== 'locked') return prev;

        // Nếu hết thời gian, tự động hủy lock
        if (timeRemaining <= 0) {
          timersRef.current.delete(seatId);
          return {
            ...prev,
            [seatId]: {
              status: 'available',
              error: undefined,
            },
          };
        }

        // Update time_remaining
        return {
          ...prev,
          [seatId]: {
            ...currentState,
            lockInfo: currentState.lockInfo
              ? { ...currentState.lockInfo, time_remaining: timeRemaining }
              : undefined,
          },
        };
      });

      // Tiếp tục update mỗi giây
      if (timeRemaining > 0) {
        const timer = setTimeout(updateTimer, 1000);
        timersRef.current.set(seatId, timer);
      }
    };

    updateTimer();
  }, []);

  /**
   * Confirm seat (ghế đã bán)
   */
  const confirmSeat = useCallback((seatId: string) => {
    const timer = timersRef.current.get(seatId);
    if (timer) clearTimeout(timer);
    timersRef.current.delete(seatId);

    setSeatState(seatId, {
      status: 'sold',
      error: undefined,
    });
  }, [setSeatState]);

  /**
   * Unlock seat (cancel lock)
   */
  const unlockSeat = useCallback((seatId: string) => {
    const timer = timersRef.current.get(seatId);
    if (timer) clearTimeout(timer);
    timersRef.current.delete(seatId);

    setSeatState(seatId, {
      status: 'available',
      error: undefined,
    });
  }, [setSeatState]);

  /**
   * Mark seat as locked by other user
   */
  const setSeatLockedByOther = useCallback((seatId: string, lockInfo: SeatLockInfo) => {
    setSeatState(seatId, {
      status: 'locked_by_other',
      lockInfo,
      error: undefined,
    });

    // Auto-remove sau khi hết hạn
    startLockCountdown(seatId, lockInfo.locked_until);
  }, [setSeatState, startLockCountdown]);

  /**
   * Set error cho seat
   */
  const setSeatError = useCallback((seatId: string, error: string) => {
    setSeatState(seatId, {
      status: 'available',
      error,
    });
  }, [setSeatState]);

  /**
   * Get seat state
   */
  const getSeatState = useCallback((seatId: string): SeatState | null => {
    return seatStates[seatId] || null;
  }, [seatStates]);

  /**
   * Get all locked seats by current user
   */
  const getLockedSeats = useCallback(() => {
    return Object.entries(seatStates)
      .filter(
        ([_, state]) =>
          state.status === 'locked' && state.lockInfo?.locked_by_user === true
      )
      .map(([seatId, state]) => ({
        seatId,
        lockInfo: state.lockInfo!,
      }));
  }, [seatStates]);

  /**
   * Get all sold seats
   */
  const getSoldSeats = useCallback(() => {
    return Object.keys(seatStates).filter(
      seatId => seatStates[seatId].status === 'sold'
    );
  }, [seatStates]);

  /**
   * Check if seat can be locked
   */
  const canLockSeat = useCallback((seatId: string): boolean => {
    const state = seatStates[seatId];
    return !state || state.status === 'available';
  }, [seatStates]);

  /**
   * Check if seat can be confirmed
   */
  const canConfirmSeat = useCallback((seatId: string): boolean => {
    const state = seatStates[seatId];
    return state?.status === 'locked' && state.lockInfo?.locked_by_user === true;
  }, [seatStates]);

  /**
   * Reset all seat states
   */
  const resetAll = useCallback(() => {
    // Clear all timers
    timersRef.current.forEach(timer => clearTimeout(timer));
    timersRef.current.clear();

    setSeatStates({});
  }, []);

  /**
   * Cleanup timers on unmount
   */
  useEffect(() => {
    return () => {
      timersRef.current.forEach(timer => clearTimeout(timer));
      timersRef.current.clear();
    };
  }, []);

  return {
    // State
    seatStates,

    // Actions
    lockSeat,
    confirmSeat,
    unlockSeat,
    setSeatLockedByOther,
    setSeatError,

    // Queries
    getSeatState,
    getLockedSeats,
    getSoldSeats,
    canLockSeat,
    canConfirmSeat,

    // Utilities
    resetAll,
  };
};
