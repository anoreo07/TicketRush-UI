'use client';

import { EventInfoCard } from '@/app/components/payment/EventInfoCard';
import { PaymentMethods } from '@/app/components/payment/PaymentMethods';
import { PaymentSummary } from '@/app/components/payment/PaymentSummary';
import ProgressStepper from '@/app/components/checkout/ProgressStepper';

export default function CheckoutPageContent() {
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
            <EventInfoCard />

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
