'use client';

import React, { useState, useEffect } from 'react';
import { useBookingContext } from '@/lib/context/BookingContext';
import { useRouter } from 'next/navigation';
import { formatCurrency } from '@/lib/mock/booking-data';

const SERVICE_FEE = 45000;

export const CheckoutSummary = () => {
  const { booking, selectedSeats, isLoading, error, timeLeft, confirmBooking: confirmBookingAPI } = useBookingContext();
  const router = useRouter();

  const formatTime = (seconds: number | null) => {
    if (seconds === null) return '--:--';
    const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
    const ss = String(seconds % 60).padStart(2, '0');
    return `${mm}:${ss}`;
  };

  const timeStr = formatTime(timeLeft);

  const subtotal = selectedSeats.reduce((sum, s) => sum + s.price, 0);
  const vat = Math.round((subtotal + SERVICE_FEE) * 0.1);
  const total = subtotal + SERVICE_FEE + vat;

  const handleConfirmBooking = () => {
    router.push('/checkout');
  };

  const hasSeats = selectedSeats.length > 0;

  return (
    <div className="bg-white p-6 rounded-3xl shadow-md border border-gray-200 sticky top-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
        <h2 className="text-lg font-bold text-slate-800">Tóm tắt đơn hàng</h2>
        <div className={`flex items-center gap-1.5 font-bold text-sm ${
          timeLeft !== null && timeLeft <= 120 ? 'text-red-500' : 'text-amber-500'
        }`}>
          <span className="material-symbols-outlined text-base">schedule</span>
          <span>{booking ? timeStr : '—'}</span>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-2">
          <span className="material-symbols-outlined text-base flex-shrink-0 mt-0.5">error</span>
          <span>{error}</span>
        </div>
      )}

      {/* Empty State */}
      {!hasSeats && (
        <div className="py-10 text-center space-y-2">
          <span className="material-symbols-outlined text-4xl text-slate-200">event_seat</span>
          <p className="text-slate-400 text-sm font-medium">Chọn ghế để bắt đầu</p>
        </div>
      )}

      {/* Selected Seats */}
      {hasSeats && (
        <div className="space-y-3 mb-6">
          {selectedSeats.map((seat, idx) => {
            const rowLabel = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[(seat as any).row_index ?? idx] ?? `R${idx + 1}`;
            const colLabel = seat.col_index + 1;
            return (
              <div key={seat.id} className="flex items-center justify-between p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs flex-shrink-0">
                    {rowLabel}{colLabel}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">Ghế {rowLabel}{colLabel}</p>
                    <p className="text-xs text-slate-500">Hàng {rowLabel} — Cột {colLabel}</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-slate-800 flex-shrink-0">
                  {formatCurrency(seat.price)}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Price Breakdown */}
      {hasSeats && (
        <div className="space-y-2 mb-6 pb-4 border-b border-dashed border-gray-200">
          <div className="flex justify-between text-slate-500 text-sm">
            <span>Tạm tính ({selectedSeats.length} ghế)</span>
            <span className="font-medium text-slate-700">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-slate-500 text-sm">
            <span>Phí dịch vụ</span>
            <span className="font-medium text-slate-700">{formatCurrency(SERVICE_FEE)}</span>
          </div>
          <div className="flex justify-between text-slate-500 text-sm">
            <span>VAT (10%)</span>
            <span className="font-medium text-slate-700">{formatCurrency(vat)}</span>
          </div>
        </div>
      )}

      {/* Total */}
      {hasSeats && (
        <div className="flex justify-between items-end mb-6">
          <span className="font-bold text-slate-700">Tổng tiền</span>
          <span className="text-2xl font-black text-indigo-600">
            {formatCurrency(total)}
          </span>
        </div>
      )}

      {/* CTA */}
      <button
        onClick={handleConfirmBooking}
        disabled={isLoading || !hasSeats}
        className="w-full py-4 bg-indigo-600 text-white rounded-full font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed disabled:shadow-none active:scale-95 transition-all flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            <span>Đang xử lý...</span>
          </>
        ) : !hasSeats ? (
          <span>Chọn ghế để tiếp tục</span>
        ) : (
          <>
            <span>Xác nhận đặt vé</span>
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </>
        )}
      </button>

      <p className="text-center text-xs text-slate-400 mt-3 px-2 leading-relaxed">
        Bằng cách xác nhận, bạn đồng ý với{' '}
        <span className="text-indigo-500 font-medium">Điều khoản</span> và{' '}
        <span className="text-indigo-500 font-medium">Chính sách bảo mật</span> của TicketRush.
      </p>
    </div>
  );
};
