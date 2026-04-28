/**
 * Success Page
 * Shows booking success message and auto-redirects to dashboard
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TopNavBar from '@/app/components/TopNavBar';

export default function SuccessPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  // Auto-redirect after 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          router.push('/dashboard');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [router]);

  // Get booking details from sessionStorage (if available)
  const bookingDetails = sessionStorage.getItem('bookingDetails')
    ? JSON.parse(sessionStorage.getItem('bookingDetails') || '{}')
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <TopNavBar />

      <main className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
        <div className="w-full max-w-2xl">
          {/* Success Container */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-16 text-center space-y-8">
            {/* Success Icon */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-green-400 rounded-full blur-2xl opacity-20 animate-pulse"></div>
                <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center animate-bounce">
                  <svg
                    className="w-12 h-12 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Success Message */}
            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl font-black text-gray-900">
                Thanh toán thành công! 🎉
              </h1>
              <p className="text-gray-600 text-lg">
                Vé của bạn đã được xác nhận và sẵn sàng sử dụng.
              </p>
            </div>

            {/* Booking Summary */}
            {bookingDetails && (
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border border-green-200 space-y-4">
                <h2 className="text-lg font-bold text-gray-900 text-left">
                  📋 Chi tiết đơn hàng
                </h2>

                <div className="space-y-3 text-left">
                  {bookingDetails.eventTitle && (
                    <div className="flex justify-between items-center pb-3 border-b border-green-200">
                      <span className="text-gray-600 font-medium">Sự kiện</span>
                      <span className="text-gray-900 font-bold">
                        {bookingDetails.eventTitle}
                      </span>
                    </div>
                  )}

                  {bookingDetails.bookingId && (
                    <div className="flex justify-between items-center pb-3 border-b border-green-200">
                      <span className="text-gray-600 font-medium">Mã đặt vé</span>
                      <span className="text-gray-900 font-bold font-mono text-sm">
                        {bookingDetails.bookingId}
                      </span>
                    </div>
                  )}

                  {bookingDetails.totalAmount && (
                    <div className="flex justify-between items-center pb-3 border-b border-green-200">
                      <span className="text-gray-600 font-medium">Tổng thanh toán</span>
                      <span className="text-2xl font-black text-green-600">
                        {bookingDetails.totalAmount.toLocaleString('vi-VN')}₫
                      </span>
                    </div>
                  )}

                  {bookingDetails.seatCount && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">Số lượng vé</span>
                      <span className="text-gray-900 font-bold">
                        {bookingDetails.seatCount} vé
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Next Steps */}
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200 space-y-3">
              <h3 className="font-bold text-gray-900 text-left">
                ✨ Bước tiếp theo
              </h3>
              <ul className="space-y-2 text-left text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold mt-1">1</span>
                  <span>Kiểm tra email để nhận vé (QR Code) của bạn</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold mt-1">2</span>
                  <span>Lưu hoặc in vé trước khi đến sự kiện</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold mt-1">3</span>
                  <span>Mang theo CCCD/Hộ chiếu khi check-in</span>
                </li>
              </ul>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200"></div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => router.push('/tickets')}
                className="w-full py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-lg hover:shadow-lg transition-all duration-200 text-lg"
              >
                🎫 Xem vé của tôi
              </button>

              <button
                onClick={() => router.push('/dashboard')}
                className="w-full py-3 bg-white text-gray-900 font-bold rounded-lg border-2 border-gray-200 hover:bg-gray-50 transition-all duration-200"
              >
                Quay về dashboard
              </button>
            </div>

            {/* Auto-redirect Timer */}
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                ⏱️ Tự động chuyển hướng về dashboard sau{' '}
                <span className="font-bold text-gray-900">{countdown}</span>{' '}
                giây...
              </p>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="mt-12 space-y-4">
            <div className="flex justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="w-2 h-2 rounded-full bg-green-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 rounded-full bg-green-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
