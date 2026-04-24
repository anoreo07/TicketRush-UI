/**
 * EnhancedSeatSelection Component
 * 
 * Xử lý:
 * - Display seat state: available, locked, sold, locked_by_other
 * - Handle seat click: lock/unlock (toggle)
 * - Countdown timer visual
 * - Error messages rõ ràng
 * - Prevent double booking
 */

'use client';

import React, { useMemo } from 'react';
import { useEnhancedBooking } from '@/lib/context/EnhancedBookingContext';
import { mockEventBooking, mockSelectedSeats } from '@/lib/mock/booking-data';

interface SeatInfo {
  id: string;
  row: number;
  col: number;
  zone: 'vip' | 'standard';
  isPreSelected?: boolean;
  isSold?: boolean;
}

// Generate mock seats
const generateVIPSeats = (): SeatInfo[] => {
  return [...Array(12)].map((_, i) => ({
    id: `vip-${i}`,
    row: 0,
    col: i,
    zone: 'vip',
    isPreSelected: i === 4 || i === 5,
    isSold: i === 2 || i === 7,
  }));
};

const generateStandardSeats = (): SeatInfo[] => {
  return [...Array(36)].map((_, i) => ({
    id: `std-${i}`,
    row: Math.floor(i / 12),
    col: i % 12,
    zone: 'standard',
    isSold: (Math.floor(i / 12) === 1 && (i % 12 === 3 || i % 12 === 4)) ||
            (Math.floor(i / 12) === 2 && i % 12 === 5),
  }));
};

const vipSeats = generateVIPSeats();
const standardSeats = generateStandardSeats();

export const EnhancedSeatSelection = () => {
  const {
    eventId,
    isLoading,
    error,
    seatStates,
    lockSeat,
    getSeatState,
    canLockSeat,
  } = useEnhancedBooking();

  const totalPrice = useMemo(() => {
    return mockSelectedSeats.reduce((sum, seat) => sum + seat.price, 0);
  }, []);

  const handleSeatClick = async (seatId: string) => {
    try {
      const currentState = getSeatState(seatId);

      // Toggle: Nếu đã locked → unlock
      if (currentState?.status === 'locked' && currentState.lockInfo?.locked_by_user) {
        // Unlock logic sẽ được handle bởi flow
        await lockSeat(seatId);
        return;
      }

      // Lock seat
      await lockSeat(seatId);
    } catch (err) {
      console.error('Failed to handle seat click:', err);
    }
  };

  const renderSeatButton = (seat: SeatInfo) => {
    const state = getSeatState(seat.id);
    const status = state?.status || 'available';
    const lockInfo = state?.lockInfo;
    const timeRemaining = lockInfo?.time_remaining || 0;
    const minutes = Math.floor(timeRemaining / 60000);
    const seconds = Math.floor((timeRemaining % 60000) / 1000);

    // Determine button style
    let buttonClasses = 'w-8 h-8 rounded-md transition-all flex items-center justify-center text-xs font-bold ';
    let disabled = false;
    let title = '';
    let onClick: (() => void) | undefined = undefined;

    if (seat.isSold) {
      // Ghế đã bán
      buttonClasses +=
        'bg-red-500 text-white cursor-not-allowed opacity-50';
      disabled = true;
      title = `Ghế đã bán`;
    } else if (seat.isPreSelected) {
      // Pre-selected (demo)
      buttonClasses +=
        'bg-purple-600 text-white ring-2 ring-purple-400 ring-offset-2 cursor-default';
      disabled = true;
      title = `Demo seat`;
    } else if (status === 'locked') {
      if (lockInfo?.locked_by_user) {
        // Ghế locked bởi user hiện tại → cho phép unlock
        buttonClasses +=
          'bg-yellow-500 text-white ring-2 ring-yellow-400 ring-offset-2 cursor-pointer hover:bg-yellow-600 active:scale-95';
        title = `Locked (${minutes}:${seconds.toString().padStart(2, '0')}) - Click để bỏ chọn`;
        onClick = () => handleSeatClick(seat.id);
      } else {
        // Ghế locked bởi user khác
        buttonClasses +=
          'bg-gray-400 text-white cursor-not-allowed opacity-70';
        title = `Đã được giữ bởi người khác`;
        disabled = true;
      }
    } else if (status === 'locked_by_other') {
      // Ghế bị người khác giữ (auto-unlock sau)
      buttonClasses +=
        'bg-gray-400 text-white cursor-not-allowed opacity-70';
      title = `Ghế đã có người giữ - ${minutes}:${seconds.toString().padStart(2, '0')}`;
      disabled = true;
    } else if (status === 'sold') {
      // Ghế đã confirm bán
      buttonClasses +=
        'bg-red-500 text-white cursor-not-allowed opacity-50';
      title = `Ghế đã bán`;
      disabled = true;
    } else {
      // Available - có thể click để lock
      buttonClasses +=
        'bg-purple-600 text-white hover:bg-purple-700 cursor-pointer hover:shadow-lg active:scale-95';
      if (seat.zone === 'standard') {
        buttonClasses = buttonClasses.replace('bg-purple-600', 'bg-purple-300').replace('hover:bg-purple-700', 'hover:bg-purple-400');
      }
      title = `${seat.zone === 'vip' ? 'A' : String.fromCharCode(66 + seat.row)}${seat.col + 1}`;
      onClick = () => handleSeatClick(seat.id);
    }

    return (
      <button
        key={seat.id}
        onClick={onClick}
        disabled={disabled || isLoading}
        className={buttonClasses}
        title={title}
        type="button"
      >
        {seat.zone === 'vip' && seat.col < 9 ? seat.col + 1 : ''}
      </button>
    );
  };

  return (
    <div className="space-y-8">
      {/* Seat Map */}
      <div className="bg-white p-8 rounded-3xl shadow-md border border-gray-200">
        {/* Stage */}
        <div className="w-full mb-12 relative">
          <div className="h-6 w-2/3 mx-auto bg-gradient-to-r from-purple-400 via-purple-500 to-purple-400 rounded-full blur-lg mb-2 opacity-70"></div>
          <div className="h-1 w-1/3 mx-auto bg-purple-600 rounded-full shadow-lg"></div>
          <p className="text-center text-xs font-bold uppercase tracking-widest text-gray-500 mt-3">
            Sân Khấu Chính / Stage
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-8 mb-10 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-sm bg-purple-600"></div>
            <span className="text-gray-700 font-medium">Trống (VIP)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-sm bg-purple-300"></div>
            <span className="text-gray-700 font-medium">Trống (Standard)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-sm bg-yellow-500"></div>
            <span className="text-gray-700 font-medium">Đang giữ (10 phút)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-sm bg-gray-400"></div>
            <span className="text-gray-700 font-medium">Đã giữ bởi người khác</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-sm bg-red-500"></div>
            <span className="text-gray-700 font-medium">Đã bán</span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm font-medium text-red-700">{error}</p>
          </div>
        )}

        {/* VIP Zone */}
        <div className="flex flex-col items-center gap-8">
          <div className="w-full">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider text-center mb-5">
              Khu vực VIP - Gần Sân Khấu
            </h3>
            <div className="flex justify-center gap-2">
              <div className="grid grid-cols-12 gap-1.5 max-w-3xl">
                {vipSeats.map(seat => renderSeatButton(seat))}
              </div>
            </div>
          </div>

          {/* Standard Zone */}
          <div className="w-full">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider text-center mb-5">
              Khu vực Standard
            </h3>
            <div className="flex justify-center">
              <div className="grid gap-1.5 max-w-3xl" style={{ gridTemplateColumns: 'repeat(12, minmax(0, 1fr))' }}>
                {standardSeats.map(seat => renderSeatButton(seat))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-3xl shadow-md border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Tóm Tắt Đơn Hàng</h3>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-700">Sự kiện:</span>
            <span className="font-bold text-gray-900">{mockEventBooking.title}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-700">Vị trí:</span>
            <span className="font-bold text-gray-900">{mockEventBooking.location}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-700">Tổng giá:</span>
            <span className="font-bold text-2xl text-purple-600">
              {totalPrice.toLocaleString('vi-VN')} ₫
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
