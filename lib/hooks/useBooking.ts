/**
 * useBooking Hook
 * Custom hook để quản lý trạng thái booking
 */

'use client';

import { useState, useCallback, useEffect } from 'react';
import { Seat, SelectedSeat, BookingSummary } from '@/lib/types/booking';

interface UseBookingOptions {
  timerDuration?: number;
}

export const useBooking = ({ timerDuration = 10 * 60 }: UseBookingOptions = {}) => {
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(timerDuration);
  const [isExpired, setIsExpired] = useState(false);

  // Timer countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsExpired(true);
          setSelectedSeatIds([]);
          return timerDuration;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerDuration]);

  const toggleSeat = useCallback((seatId: string) => {
    setSelectedSeatIds((prev) => {
      if (prev.includes(seatId)) {
        return prev.filter((id) => id !== seatId);
      }
      return [...prev, seatId];
    });
  }, []);

  const addSeat = useCallback((seatId: string) => {
    setSelectedSeatIds((prev) => {
      if (!prev.includes(seatId)) {
        return [...prev, seatId];
      }
      return prev;
    });
  }, []);

  const removeSeat = useCallback((seatId: string) => {
    setSelectedSeatIds((prev) => prev.filter((id) => id !== seatId));
  }, []);

  const clearSeats = useCallback(() => {
    setSelectedSeatIds([]);
  }, []);

  const resetTimer = useCallback(() => {
    setTimeRemaining(timerDuration);
    setIsExpired(false);
  }, [timerDuration]);

  return {
    selectedSeatIds,
    timeRemaining,
    isExpired,
    toggleSeat,
    addSeat,
    removeSeat,
    clearSeats,
    resetTimer,
  };
};

/**
 * Hook to calculate booking summary
 */
export const useBookingSummary = (
  selectedSeats: SelectedSeat[],
  serviceFee: number
) => {
  const subtotal = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
  const total = subtotal + serviceFee;

  return {
    subtotal,
    serviceFee,
    total,
    seatCount: selectedSeats.length,
  };
};
