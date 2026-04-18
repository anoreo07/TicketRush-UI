'use client';

import React, { useState } from 'react';
import { mockEventBooking, mockSelectedSeats, formatCurrency } from '@/lib/mock/booking-data';
import { useBookingContext } from '@/lib/context/BookingContext';

export const SeatSelection = () => {
  const { lockSeat, isLoading, error } = useBookingContext();
  const [selectedSeats, setSelectedSeats] = useState(mockSelectedSeats);
  const [lockedSeats, setLockedSeats] = useState<Set<string>>(new Set());
  const [lockingErrors, setLockingErrors] = useState<Map<string, string>>(new Map());
  const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

  const handleSeatClick = async (seatId: string) => {
    // If already locked, click again to unlock (toggle)
    if (lockedSeats.has(seatId)) {
      // Unlock immediately
      setLockedSeats(prev => {
        const newSet = new Set(prev);
        newSet.delete(seatId);
        return newSet;
      });
      setSelectedSeats(prev => prev.filter(seat => seat.id !== seatId));
      // Clear any errors for this seat
      setLockingErrors(prev => {
        const newErrors = new Map(prev);
        newErrors.delete(seatId);
        return newErrors;
      });
      return;
    }

    try {
      // Clear any previous errors for this seat
      setLockingErrors(prev => {
        const newErrors = new Map(prev);
        newErrors.delete(seatId);
        return newErrors;
      });

      // Lock seat optimistically (show immediately)
      setLockedSeats(prev => new Set([...prev, seatId]));

      // Confirm with API
      await lockSeat(seatId);
    } catch (err) {
      // If lock fails, remove from locked seats
      setLockedSeats(prev => {
        const newSet = new Set(prev);
        newSet.delete(seatId);
        return newSet;
      });
      
      const errorMsg = err instanceof Error ? err.message : 'Không thể khóa ghế này';
      setLockingErrors(prev => new Map(prev).set(seatId, errorMsg));
    }
  };

  return (
    <div className="space-y-8">
      {/* Seat Map */}
      <div className="bg-white p-8 rounded-3xl shadow-md border border-gray-200">
        {/* Stage Visualizer */}
        <div className="w-full mb-12 relative">
          <div className="h-6 w-2/3 mx-auto bg-gradient-to-r from-purple-400 via-purple-500 to-purple-400 rounded-full blur-lg mb-2 opacity-70"></div>
          <div className="h-1 w-1/3 mx-auto bg-purple-600 rounded-full shadow-lg"></div>
          <p className="text-center text-xs font-bold uppercase tracking-widest text-gray-500 mt-3">
            Sân Khấu Chính / Stage
          </p>
        </div>

        {/* Seat Legend */}
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
            <span className="text-gray-700 font-medium">Đang khóa (10 phút)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-sm bg-gray-400"></div>
            <span className="text-gray-700 font-medium">Đã khóa bởi người khác</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-sm bg-red-500"></div>
            <span className="text-gray-700 font-medium">Đã bán</span>
          </div>
        </div>

        {/* Seat Grid */}
        <div className="flex flex-col items-center gap-8">
          {/* VIP Zone */}
          <div className="w-full">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider text-center mb-5">
              Khu vực VIP - Gần Sân Khấu
            </h3>
            <div className="flex justify-center gap-2">
              <div className="grid grid-cols-12 gap-1.5 max-w-3xl">
                {[...Array(12)].map((_, i) => {
                  const seatId = `vip-${i}`;
                  const isLocked = lockedSeats.has(seatId);
                  const isPreSelected = i === 4 || i === 5;
                  const isSold = i === 2 || i === 7;
                  const hasError = lockingErrors.has(seatId);

                  return (
                    <button
                      key={seatId}
                      onClick={() => {
                        if (!isPreSelected && !isSold) {
                          handleSeatClick(seatId);
                        }
                      }}
                      disabled={isSold || (isLoading && !isLocked)}
                      className={`w-8 h-8 rounded-md transition-all flex items-center justify-center text-xs font-bold ${
                        isLocked
                          ? 'bg-yellow-500 text-white ring-2 ring-yellow-400 ring-offset-2 cursor-pointer hover:bg-yellow-600'
                          : isPreSelected
                            ? 'bg-purple-600 text-white ring-2 ring-purple-400 ring-offset-2 cursor-default'
                            : isSold
                              ? 'bg-red-500 text-white cursor-not-allowed opacity-50'
                              : 'bg-purple-600 text-white hover:bg-purple-700 cursor-pointer hover:shadow-lg'
                      }`}
                      title={isLocked ? `${seatId} - Click để bỏ chọn` : `A${i + 1}`}
                      type="button"
                    >
                      {i < 9 ? i + 1 : ''}
                    </button>
                  );
                })}
              </div>
            </div>
            {/* Error message for VIP zone */}
            {Array.from(lockingErrors.entries()).some(([id]) => id.startsWith('vip-')) && (
              <div className="mt-3 text-center">
                {Array.from(lockingErrors.entries()).map(
                  ([id, msg]) =>
                    id.startsWith('vip-') && (
                      <p key={id} className="text-xs text-red-600 font-medium">
                        {msg}
                      </p>
                    )
                )}
              </div>
            )}
          </div>

          {/* Standard Zone */}
          <div className="w-full">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider text-center mb-5">
              Khu vực Standard
            </h3>
            <div className="flex justify-center">
              <div className="grid gap-1.5 max-w-3xl" style={{ gridTemplateColumns: 'repeat(12, minmax(0, 1fr))' }}>
                {[...Array(36)].map((_, i) => {
                  const row = Math.floor(i / 12);
                  const col = i % 12;
                  const seatId = `std-${i}`;
                  const isLocked = lockedSeats.has(seatId);
                  const isSold = (row === 1 && (col === 3 || col === 4)) || (row === 2 && col === 5);
                  const hasError = lockingErrors.has(seatId);

                  return (
                    <button
                      key={seatId}
                      onClick={() => {
                        if (!isSold) {
                          handleSeatClick(seatId);
                        }
                      }}
                      disabled={isSold || (isLoading && !isLocked)}
                      className={`w-8 h-8 rounded-md transition-all ${
                        isLocked
                          ? 'bg-yellow-500 text-white ring-2 ring-yellow-400 ring-offset-1 cursor-pointer hover:bg-yellow-600'
                          : isSold
                            ? 'bg-red-500 text-white cursor-not-allowed opacity-50'
                            : 'bg-purple-300 hover:bg-purple-400 cursor-pointer'
                      }`}
                      type="button"
                      title={isLocked ? `${String.fromCharCode(66 + row)}${col + 1} - Click để bỏ chọn` : `${String.fromCharCode(66 + row)}${col + 1}`}
                    />
                  );
                })}
              </div>
            </div>
            {/* Error message for Standard zone */}
            {Array.from(lockingErrors.entries()).some(([id]) => id.startsWith('std-')) && (
              <div className="mt-3 text-center">
                {Array.from(lockingErrors.entries()).map(
                  ([id, msg]) =>
                    id.startsWith('std-') && (
                      <p key={id} className="text-xs text-red-600 font-medium">
                        {msg}
                      </p>
                    )
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Event Details Section */}
      <div className="bg-purple-50 p-8 rounded-3xl border-2 border-purple-300">
        <h3 className="text-xl font-headline font-bold mb-4 text-purple-900">Mô tả sự kiện</h3>
        <p className="text-purple-900 leading-relaxed mb-6 text-sm">
          {mockEventBooking.description}
        </p>
        <div className="flex gap-3 flex-wrap">
          <span className="px-4 py-2 bg-white rounded-lg text-sm font-medium border border-purple-300 text-purple-700">
            Bình luận Tiếng Việt
          </span>
          <span className="px-4 py-2 bg-white rounded-lg text-sm font-medium border border-purple-300 text-purple-700">
            Quà tặng Exclusive
          </span>
        </div>
      </div>

      {/* Organizer Banner */}
      <div className="bg-white p-8 rounded-3xl shadow-md border border-gray-200">
        <div className="flex items-center gap-6">
          {/* Organizer Logo/Icon */}
          <div className="flex-shrink-0">
            <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-purple-600 text-4xl">
                corporate_fare
              </span>
            </div>
          </div>

          {/* Organizer Info */}
          <div className="flex-grow">
            <p className="text-sm text-gray-600 font-medium mb-1">BAN TỔ CHỨC</p>
            <h4 className="text-2xl font-headline font-bold text-gray-900 mb-2">
              {mockEventBooking.organizer.name}
            </h4>
            <p className="text-sm text-gray-600">
              Tổ chức sự kiện uy tín hàng đầu, mang đến những trải nghiệm không quên cho khán giả.
            </p>
          </div>

          {/* Visit Button */}
          <div className="flex-shrink-0">
            <button className="px-6 py-3 bg-purple-600 text-white rounded-full font-bold text-sm hover:bg-purple-700 transition-colors active:scale-95">
              Xem Chi Tiết
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
