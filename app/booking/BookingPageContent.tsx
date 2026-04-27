'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { SeatSelection } from '@/app/components/booking/SeatSelection';
import { CheckoutSummary } from '@/app/components/booking/CheckoutSummary';
import { mockEventBooking } from '@/lib/mock/booking-data';
import { eventsApi, EventDetail, SeatMap } from '@/lib/api';
import { useBookingContext } from '@/lib/context/BookingContext';

export default function BookingPageContent() {
    const searchParams = useSearchParams();
    const eventId = searchParams.get('eventId');
    const { setEventId } = useBookingContext();
    
    const [event, setEvent] = useState<EventDetail | null>(null);
    const [seatMap, setSeatMap] = useState<SeatMap | null>(null);
    const [isLoading, setIsLoading] = useState(!!eventId);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (eventId) {
            setEventId(eventId);
        }
    }, [eventId, setEventId]);

    useEffect(() => {
        if (!eventId) {
            // Use mock data if no eventId
            setIsLoading(false);
            return;
        }

        const loadEvent = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const [eventData, seatMapData] = await Promise.all([
                    eventsApi.getById(eventId),
                    eventsApi.getSeats(eventId),
                ]);
                setEvent(eventData);
                setSeatMap(seatMapData);
            } catch (err: any) {
                console.error('Failed to load event:', err);
                setError(err?.message || 'Không thể tải sự kiện');
                // Fallback to mock data on error
            } finally {
                setIsLoading(false);
            }
        };

        loadEvent();
    }, [eventId]);

    // Use real event or fallback to mock
    const displayEvent = event || mockEventBooking;

    if (isLoading) {
        return (
            <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin h-12 w-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải sự kiện...</p>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center px-4">
                <div className="text-center">
                    <p className="text-red-500 mb-4">{error}</p>
                    <p className="text-gray-600">Sử dụng dữ liệu mặc định...</p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
            {/* Event Banner */}
            <div className="px-4 md:px-6 mt-6">
                <div
                    className="relative w-full max-w-7xl mx-auto h-80 md:h-96 overflow-hidden rounded-2xl"
                    style={{
                        backgroundImage: `url('${
                            (event && 'image_url' in event ? event.image_url : null) || 
                            (displayEvent && 'image' in displayEvent ? (displayEvent as any).image : mockEventBooking.image)
                        }')`,
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
                                    {(event && 'status' in event ? event.status : null) || 
                                     (displayEvent && 'category' in displayEvent ? (displayEvent as any).category : 'Event')}
                                </span>
                                <span className="px-3 py-1 bg-white/20 text-white text-xs font-medium rounded-lg">
                                    Sắp diễn ra
                                </span>
                            </div>

                            <h1 className="text-3xl md:text-5xl font-headline font-black text-white leading-tight">
                                {displayEvent.title}
                            </h1>

                            <div className="flex gap-6 mt-4 text-white text-sm md:text-base">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-lg">calendar_today</span>
                                    <span>
                                        {event && 'event_date' in event
                                            ? new Date(event.event_date).toLocaleString('vi-VN')
                                            : 'Sắp diễn ra'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-lg">location_on</span>
                                    <span>
                                        {event && 'location' in event
                                            ? event.location
                                            : (displayEvent && 'location' in displayEvent ? (displayEvent as any).location : 'Địa điểm')}
                                    </span>
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
