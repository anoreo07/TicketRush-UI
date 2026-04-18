'use client';

import React, { useState } from 'react';
import { mockSelectedSeats, formatCurrency } from '@/lib/mock/booking-data';
import { useBookingContext } from '@/lib/context/BookingContext';
import { useRouter } from 'next/navigation';

export const CheckoutSummary = () => {
  const { booking, isLoading, error, confirmBooking: confirmBookingAPI } = useBookingContext();
  const router = useRouter();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('credit_card');

  const subtotal = mockSelectedSeats.reduce((sum, seat) => sum + seat.price, 0);
  const service_fee = 45000;
  const vat = Math.round((subtotal + service_fee) * 0.1);
  const total = subtotal + service_fee + vat;

  const handleConfirmBooking = async () => {
    try {
      // Just navigate to checkout - don't call confirmBooking yet
      // The checkout page will handle the actual confirmation
      router.push('/checkout');
    } catch (err) {
      console.error('Navigation failed:', err);
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-md border border-gray-200">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <h2 className="text-lg font-headline font-bold text-gray-800">Tóm tắt đơn hàng</h2>
        <div className="flex items-center gap-2 text-red-500 font-bold text-sm">
          <span className="material-symbols-outlined text-base">schedule</span>
          <span>09:45</span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Selected Seats List */}
      <div className="space-y-3 mb-6">
        {mockSelectedSeats.map((seat) => (
          <div key={seat.id} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-purple-200 flex items-center justify-center text-purple-600 font-bold text-xs">
                {seat.row}
                {seat.number}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">Ghế {seat.type === 'vip' ? 'VIP' : 'Standard'}</p>
                <p className="text-xs text-gray-500">
                  Dãy {seat.row}, Hàng {seat.number}
                </p>
              </div>
            </div>
            <span className="text-sm font-bold text-gray-800">{formatCurrency(seat.price)}</span>
          </div>
        ))}
      </div>

      {/* Price Breakdown */}
      <div className="space-y-2 mb-6 pb-4 border-b border-dashed border-gray-300">
        <div className="flex justify-between text-gray-600 text-sm">
          <span>Tạm tính</span>
          <span className="font-medium text-gray-800">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between text-gray-600 text-sm">
          <span>Phí dịch vụ</span>
          <span className="font-medium text-gray-800">{formatCurrency(service_fee)}</span>
        </div>
        <div className="flex justify-between text-gray-600 text-sm">
          <span>Phí VAT (10%)</span>
          <span className="font-medium text-gray-800">{formatCurrency(vat)}</span>
        </div>
      </div>

      {/* Total */}
      <div className="flex justify-between items-end mb-6">
        <span className="font-bold text-gray-800">Tổng tiền</span>
        <span className="text-2xl font-headline font-extrabold text-purple-600">
          {formatCurrency(total)}
        </span>
      </div>

      {/* CTA Button */}
      <button
        onClick={handleConfirmBooking}
        disabled={isLoading}
        className="w-full py-4 bg-purple-600 text-white rounded-full font-bold shadow-lg shadow-purple-600/30 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed active:scale-95 transition-all flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <span className="material-symbols-outlined animate-spin">loading</span>
            <span>Đang xác nhận...</span>
          </>
        ) : (
          <>
            <span>Xác nhận đặt vé</span>
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </>
        )}
      </button>

      <p className="text-center text-xs text-gray-500 mt-3 px-3 leading-relaxed">
        Bằng cách xác nhận, bạn đồng ý với Điều khoản sử dụng và Chính sách bảo mật của TicketRush.
      </p>
    </div>
  );
};
