'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { mockPriceBreakdown, formatCurrency } from '@/lib/mock/booking-data';
import { useBookingContext } from '@/lib/context/BookingContext';

export const PaymentSummary = () => {
  const router = useRouter();
  const { booking, isLoading, error, confirmBooking } = useBookingContext();
  const [selectedPayment, setSelectedPayment] = useState('credit_card');

  const handlePayment = async () => {
    try {
      await confirmBooking(selectedPayment);
      router.push('/tickets');
    } catch (err) {
      console.error('Payment failed:', err);
    }
  };

  return (
    <aside className="lg:col-span-4 space-y-6">
      <div className="bg-white rounded-3xl p-8 shadow-md border border-gray-200">
        <h3 className="text-lg font-headline font-bold text-gray-800 mb-6">Tóm tắt chi phí</h3>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-3 mb-6 pb-4 border-b border-dashed border-gray-300">
          <div className="flex justify-between items-center text-gray-600">
            <span className="text-sm">Giá vé (x{booking?.seats?.length || 0})</span>
            <span className="font-medium text-gray-800">{formatCurrency(mockPriceBreakdown.subtotal)}</span>
          </div>
          <div className="flex justify-between items-center text-gray-600">
            <span className="text-sm">Phí dịch vụ</span>
            <span className="font-medium text-gray-800">{formatCurrency(mockPriceBreakdown.service_fee)}</span>
          </div>
          <div className="flex justify-between items-center text-gray-600">
            <span className="text-sm">Phí VAT (10%)</span>
            <span className="font-medium text-gray-800">{formatCurrency(mockPriceBreakdown.vat)}</span>
          </div>
          <div className="flex justify-between items-end pt-3">
            <span className="text-gray-800 font-bold">Tổng cộng</span>
            <span className="text-2xl font-headline font-extrabold text-purple-600">
              {formatCurrency(mockPriceBreakdown.total)}
            </span>
          </div>
        </div>

        {/* Discount Input */}
        <div className="space-y-2 mb-6">
          <label className="text-xs font-bold text-gray-600 uppercase">Mã giảm giá</label>
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-grow bg-gray-50 px-4 py-3 rounded-lg border border-gray-300 focus:border-purple-500 focus:outline-none text-gray-800 text-sm"
              placeholder="Nhập mã ưu đãi"
            />
            <button className="bg-purple-100 text-purple-600 px-5 py-3 rounded-lg font-bold text-sm active:scale-95 transition-transform hover:bg-purple-200">
              Áp dụng
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <button 
            onClick={handlePayment}
            disabled={isLoading}
            className="w-full bg-purple-600 text-white font-headline font-bold py-4 rounded-full shadow-lg shadow-purple-600/30 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="material-symbols-outlined animate-spin">loading</span>
                <span>Đang xử lý...</span>
              </>
            ) : (
              <>
                <span>Thanh toán ngay</span>
                <span className="opacity-70 text-sm font-medium">| {formatCurrency(mockPriceBreakdown.total)}</span>
              </>
            )}
          </button>
          <p className="text-xs text-center text-gray-500 leading-relaxed px-4">
            Bằng việc nhấn thanh toán, bạn đồng ý với các{' '}
            <a className="text-purple-600 underline hover:text-purple-700" href="#">
              Điều khoản & Điều kiện
            </a>{' '}
            của TicketRush.
          </p>
        </div>

        {/* Security Badge */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <span className="material-symbols-outlined text-purple-600 text-sm">verified_user</span>
            <span>
              <span className="font-bold text-gray-800">Giao dịch an toàn</span> - Mã hóa AES-256 bit
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
