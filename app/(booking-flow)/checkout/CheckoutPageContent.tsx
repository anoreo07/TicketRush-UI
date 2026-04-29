'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { EventInfoCard } from '@/app/components/payment/EventInfoCard';
import { PaymentMethods } from '@/app/components/payment/PaymentMethods';
import { PaymentSummary } from '@/app/components/payment/PaymentSummary';
import ProgressStepper from '@/app/components/checkout/ProgressStepper';
import { useBookingContext } from '@/lib/context/BookingContext';

export default function CheckoutPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  const { booking, event, isLoading, error, confirmBooking, loadBooking } = useBookingContext();
  const [selectedPayment, setSelectedPayment] = useState('credit_card');

  const seatNames = booking?.seats 
    ? booking.seats.map(s => `Dãy ${s.row} - Ghế ${s.number}`).join(', ')
    : '';

  const lastLoadedId = useRef<string | null>(null);

  useEffect(() => {
    console.log(`[DEBUG] CheckoutPageContent: useEffect triggered. bookingId=${bookingId}, hasBooking=${!!booking}, isLoading=${isLoading}, error=${error}`);
    
    // If we already tried to load this ID, don't try again
    if (bookingId === lastLoadedId.current) {
      console.log(`[DEBUG] CheckoutPageContent: Skipping loadBooking (already tried or loading)`);
      return;
    }
    
    // If bookingId is in URL but no booking in context, load it
    if (bookingId && !booking && !isLoading && !error) {
      console.log(`[DEBUG] CheckoutPageContent: Triggering loadBooking(${bookingId})`);
      lastLoadedId.current = bookingId;
      loadBooking(bookingId);
    }
    // Redirect to events if no booking and no bookingId
    else if (!bookingId && !booking && !isLoading && !error) {
      console.log(`[DEBUG] CheckoutPageContent: No ID and no booking, redirecting to events`);
      router.push('/events');
    }
  }, [booking, bookingId, isLoading, loadBooking, router, error]);

  const handleConfirmPayment = async () => {
    try {
      await confirmBooking(selectedPayment);
      
      // Store booking details in sessionStorage for success page
      if (booking) {
        sessionStorage.setItem('bookingDetails', JSON.stringify({
          bookingId: booking.id,
          eventTitle: booking.event_id,
          seatCount: booking.seats?.length || 0,
          totalAmount: booking.total_amount || 0,
        }));
      }
      
      // Redirect to success page
      router.push('/success');
    } catch (err) {
      console.error('Payment confirmation failed:', err);
    }
  };

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <span className="material-symbols-outlined text-red-500 text-6xl mb-4">
            error
          </span>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Đã xảy ra lỗi</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => router.push('/drafts')}
            className="px-6 py-3 bg-purple-600 text-white rounded-full font-bold hover:bg-purple-700 transition-colors"
          >
            Quay lại trang nháp
          </button>
        </div>
      </main>
    );
  }

  if (!booking || isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin thanh toán...</p>
          {bookingId && <p className="text-xs text-gray-400 mt-2">ID: {bookingId}</p>}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        {/* Progress Stepper */}
        <ProgressStepper currentStep={2} steps={['Chọn vé', 'Thanh toán', 'Hoàn tất']} />

        {/* Header Section */}
        <div className="mb-12">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-headline font-black text-gray-900 mb-2">
              Xác nhận thanh toán
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl">
              Vui lòng kiểm tra lại thông tin vé và chọn phương thức thanh toán để hoàn tất đơn hàng.
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Side: Event Info & Payment Methods */}
          <div className="lg:col-span-8 space-y-8">
            {/* Event Information Card */}
            <EventInfoCard event={event} booking={booking} seatNames={seatNames} />

            {/* Payment Methods */}
            <PaymentMethods />

            {/* Terms & Conditions Note */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
              <div className="flex gap-3">
                <span className="material-symbols-outlined text-purple-600 flex-shrink-0">
                  shield
                </span>
                <div className="text-sm text-gray-600 leading-relaxed">
                  <p className="font-bold text-gray-800 mb-1">Thanh toán an toàn</p>
                  <p>
                    Thông tin thanh toán của bạn được bảo mật bằng mã hóa AES-256. TicketRush tuân thủ các tiêu chuẩn bảo mật quốc tế.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Payment Summary */}
          <PaymentSummary />
        </div>
      </div>
    </main>
  );
}
