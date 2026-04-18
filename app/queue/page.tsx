"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TopNavBar from '@/app/components/TopNavBar';

export default function QueuePage() {
  const router = useRouter();
  
  // Queue simulation state
  const [queuePosition, setQueuePosition] = useState(45);
  const [totalInQueue, setTotalInQueue] = useState(128);
  const [bookingStatus, setBookingStatus] = useState<'processing' | 'completed'>('processing');
  const [elapsedTime, setElapsedTime] = useState(0);

  // Simulate queue movement
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(prev => prev + 1);

      // Simulate moving up queue every 6 seconds
      if (elapsedTime % 6 === 0 && queuePosition > 1) {
        setQueuePosition(prev => Math.max(1, prev - 1));
      }

      // Simulate completion at position 1
      if (queuePosition === 1 && bookingStatus === 'processing') {
        setTimeout(() => {
          setBookingStatus('completed');
        }, 2000);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [elapsedTime, queuePosition, bookingStatus]);

  const estimatedWaitTime = Math.max(0, Math.ceil(queuePosition * 0.3)); // ~5.6 seconds per person
  const progress = ((totalInQueue - queuePosition) / totalInQueue) * 100;

  const handleViewTickets = () => {
    router.push('/tickets');
  };

  const handleBackHome = () => {
    router.push('/');
  };

  return (
    <>
      <TopNavBar />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 pt-6 pb-12">
        <div className="max-w-2xl mx-auto px-4 md:px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-headline font-black text-gray-900 mb-3">
              Bạn đang chờ lượt
            </h1>
            <p className="text-gray-600 text-lg">
              Vé của bạn đang được xử lý. Vui lòng chờ trong hàng đợi
            </p>
          </div>

          {/* Queue Card */}
          <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-8 md:p-12 mb-8">
            {/* Position Badge */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-purple-100 to-purple-50 mb-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-transparent to-purple-400/20 animate-pulse"></div>
                <div className="relative text-center">
                  <p className="text-xs uppercase tracking-widest text-purple-600 font-bold mb-1">
                    Vị trí
                  </p>
                  <p className="text-5xl font-black text-purple-600">
                    #{queuePosition}
                  </p>
                </div>
              </div>

              <p className="text-2xl font-bold text-gray-900 mb-2">
                {queuePosition === 1
                  ? '🎉 Đến lượt bạn rồi!'
                  : `Có ${queuePosition - 1} người trước bạn`}
              </p>
              <p className="text-gray-600">
                Tổng cộng {totalInQueue} người trong hàng
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <p className="text-sm font-bold text-gray-700">Tiến độ xử lý</p>
                <p className="text-sm text-gray-600">
                  {Math.round(progress)}%
                </p>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            {/* Timing Information */}
            <div className="grid grid-cols-2 gap-4 mb-8 bg-purple-50 p-6 rounded-2xl">
              <div>
                <p className="text-xs uppercase tracking-widest text-purple-600 font-bold mb-2">
                  Thời gian chờ
                </p>
                <p className="text-3xl font-black text-purple-600">
                  {estimatedWaitTime}
                </p>
                <p className="text-xs text-gray-600">phút</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-purple-600 font-bold mb-2">
                  Tốc độ xử lý
                </p>
                <p className="text-3xl font-black text-purple-600">
                  5.6
                </p>
                <p className="text-xs text-gray-600">giây/người</p>
              </div>
            </div>

            {/* Status Badge */}
            <div className="flex items-center justify-center mb-8">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                bookingStatus === 'completed' 
                  ? 'bg-green-100'
                  : 'bg-yellow-100'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  bookingStatus === 'completed'
                    ? 'bg-green-500'
                    : 'bg-yellow-500 animate-pulse'
                }`}></div>
                <span className={`text-sm font-bold ${
                  bookingStatus === 'completed'
                    ? 'text-green-700'
                    : 'text-yellow-700'
                }`}>
                  {bookingStatus === 'processing'
                    ? 'Đang xử lý đơn hàng'
                    : '✓ Xác nhận thành công'}
                </span>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-8">
              <p className="text-xs uppercase tracking-widest text-blue-600 font-bold mb-2">
                💡 Mẹo hữu ích
              </p>
              <p className="text-sm text-blue-900">
                {queuePosition === 1
                  ? 'Vé của bạn đang được xác nhận cuối cùng. Bạn sẽ nhận được thông báo trong giây lát!'
                  : 'Hãy giữ tab này mở. Bạn sẽ được chuyển hướng tự động khi đến lượt.'}
              </p>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 my-8"></div>

            {/* Booking Summary */}
            <div className="bg-gray-50 p-6 rounded-2xl mb-8">
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">
                Thông tin đơn hàng
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Tên sự kiện</span>
                  <span className="text-sm font-bold text-gray-900">Concert 2024</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Số lượng vé</span>
                  <span className="text-sm font-bold text-gray-900">2 vé</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Tổng tiền</span>
                  <span className="text-sm font-bold text-gray-900">500,000 ₫</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {bookingStatus === 'completed' ? (
              <>
                <button
                  onClick={handleViewTickets}
                  className="w-full py-4 bg-purple-600 text-white font-bold rounded-full hover:bg-purple-700 transition-colors active:scale-95 text-lg shadow-lg"
                >
                  🎫 Xem Vé Của Tôi
                </button>
                <button
                  onClick={handleBackHome}
                  className="w-full py-3 bg-white text-purple-600 font-bold rounded-full border-2 border-purple-600 hover:bg-purple-50 transition-colors active:scale-95"
                >
                  Quay Về Trang Chủ
                </button>
              </>
            ) : (
              <>
                <button
                  disabled
                  className="w-full py-4 bg-gray-400 text-white font-bold rounded-full cursor-not-allowed opacity-60 text-lg"
                >
                  ⏳ Chờ Lượt Xử Lý...
                </button>
                <button
                  onClick={handleBackHome}
                  className="w-full py-3 bg-white text-gray-600 font-bold rounded-full border-2 border-gray-300 hover:bg-gray-50 transition-colors active:scale-95"
                >
                  Quay Về Trang Chủ
                </button>
              </>
            )}
          </div>

          {/* Help Text */}
          <p className="text-center text-xs text-gray-500 mt-6">
            Không đóng tab này. Chúng tôi sẽ thông báo cho bạn khi vé đã sẵn sàng
          </p>
        </div>
      </main>
    </>
  );
}
