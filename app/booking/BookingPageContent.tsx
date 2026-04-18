'use client';

import { SeatSelection } from '@/app/components/booking/SeatSelection';
import { CheckoutSummary } from '@/app/components/booking/CheckoutSummary';
import { mockEventBooking } from '@/lib/mock/booking-data';

export default function BookingPageContent() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
            {/* Event Banner */}
            <div className="px-4 md:px-6 mt-6">
                <div
                    className="relative w-full max-w-7xl mx-auto h-80 md:h-96 overflow-hidden rounded-2xl"
                    style={{
                        backgroundImage: `url('${mockEventBooking.image}')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50"></div>

                    {/* Banner Content */}
                    <div className="absolute inset-0 flex items-end px-6 md:px-12 py-8">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="px-3 py-1 bg-purple-600 text-white text-xs font-bold uppercase rounded-lg">
                                    {mockEventBooking.category}
                                </span>
                                <span className="px-3 py-1 bg-white/20 text-white text-xs font-medium rounded-lg">
                                    Sắp diễn ra
                                </span>
                            </div>

                            <h1 className="text-3xl md:text-5xl font-headline font-black text-white leading-tight">
                                {mockEventBooking.title}
                            </h1>

                            <div className="flex gap-6 mt-4 text-white text-sm md:text-base">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-lg">calendar_today</span>
                                    <span>15 Tháng 05, 2024</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-lg">location_on</span>
                                    <span>Nhà thi đấu Quân khu 7</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 pb-32">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Side: Seat Selection - Takes 8 columns on desktop */}
                    <div className="lg:col-span-8">
                        <SeatSelection />
                    </div>

                    {/* Right Sidebar: Checkout Summary - Takes 4 columns, sticky on desktop */}
                    <div className="lg:col-span-4 lg:sticky lg:top-24">
                        <CheckoutSummary />
                    </div>
                </div>
            </div>
        </main>
    );
}
