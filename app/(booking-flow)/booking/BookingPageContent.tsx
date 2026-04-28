'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { SeatSelection } from '@/app/components/booking/SeatSelection';
import { CheckoutSummary } from '@/app/components/booking/CheckoutSummary';
import { eventsApi, EventDetail, SeatMap } from '@/lib/api';
import { useBookingContext } from '@/lib/context/BookingContext';
import { useAuth } from '@/lib/useAuth';
import TopNavBar from '@/app/components/TopNavBar';
import { useRouter } from 'next/navigation';

export default function BookingPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { token, isLoading: authLoading } = useAuth();
  const [eventId, setEventId] = useState<string | null>(null);
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [seatMap, setSeatMapLocal] = useState<SeatMap | null>(null);
  const [isLoadingEvent, setIsLoadingEvent] = useState(false);
  const [isLoadingSeats, setIsLoadingSeats] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { setEventId: setEventIdContext, setSeatMap: setSeatMapContext } = useBookingContext();

  // Step 0: Check authentication
  useEffect(() => {
    if (!authLoading && !token) {
      router.push(`/login?redirect=/booking${eventId ? `?eventId=${eventId}` : ''}`);
    }
  }, [token, authLoading, router, eventId]);

  // Step 1: Resolve eventId from URL params or sessionStorage
  useEffect(() => {
    const id = searchParams.get('eventId') || sessionStorage.getItem('bookingEventId');
    if (id) {
      setEventId(id);
      setEventIdContext(id);
    }
  }, [searchParams, setEventIdContext]);

  // Step 2: Fetch event details
  useEffect(() => {
    if (!eventId) return;
    const fetchEvent = async () => {
      setIsLoadingEvent(true);
      try {
        const data = await eventsApi.getById(eventId);
        setEvent(data);
      } catch (err: any) {
        console.error('Failed to load event:', err);
        setError(err?.message || 'Không thể tải thông tin sự kiện');
      } finally {
        setIsLoadingEvent(false);
      }
    };
    fetchEvent();
  }, [eventId]);

  // Step 3: Fetch seat map
  const fetchSeatMap = useCallback(async () => {
    if (!eventId) return;
    setIsLoadingSeats(true);
    setError(null);
    try {
      const data = await eventsApi.getSeats(eventId);
      setSeatMapLocal(data);
      setSeatMapContext(data);
    } catch (err: any) {
      console.error('Failed to load seats:', err);
      setError(err?.message || 'Không thể tải sơ đồ ghế');
    } finally {
      setIsLoadingSeats(false);
    }
  }, [eventId, setSeatMapContext]);

  useEffect(() => {
    fetchSeatMap();
  }, [fetchSeatMap]);

  // Loading event info skeleton
  if (isLoadingEvent) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <TopNavBar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="animate-spin h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-slate-500 font-medium">Đang tải thông tin sự kiện...</p>
          </div>
        </main>
      </div>
    );
  }

  const eventImageUrl =
    event?.image_url ||
    'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=2070';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <TopNavBar />

      {/* Event Banner */}
      <div className="px-4 md:px-6 pt-24">
        <div
          className="relative w-full max-w-7xl mx-auto h-64 md:h-80 overflow-hidden rounded-2xl bg-slate-800"
          style={{
            backgroundImage: `url('${eventImageUrl}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/30 to-black/70"></div>

          <div className="absolute inset-0 flex items-end px-6 md:px-12 py-8">
            <div className="space-y-3">
              <div className="flex items-center gap-3 flex-wrap">
                {event?.status && (
                  <span className="px-3 py-1 bg-indigo-600 text-white text-xs font-bold uppercase rounded-lg">
                    {event.status}
                  </span>
                )}
                <span className="px-3 py-1 bg-white/20 backdrop-blur text-white text-xs font-medium rounded-lg">
                  Đặt vé
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-black text-white leading-tight drop-shadow-lg">
                {event?.title || 'Đang tải sự kiện...'}
              </h1>

              <div className="flex gap-6 text-white/90 text-sm flex-wrap">
                {event?.event_date && (
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">calendar_today</span>
                    <span>{new Date(event.event_date).toLocaleString('vi-VN')}</span>
                  </div>
                )}
                {event?.location && (
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">location_on</span>
                    <span>{event.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 md:px-6 py-10 pb-32">

        {/* Global error with retry */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-red-500 flex-shrink-0">error</span>
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
            <button
              onClick={fetchSeatMap}
              className="px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-full hover:bg-red-700 transition-colors flex-shrink-0"
            >
              Thử lại
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Seat Map — 8 cols */}
          <div className="lg:col-span-8">
            <SeatSelection seatMap={seatMap} isLoadingSeats={isLoadingSeats} />
          </div>

          {/* Right: Checkout Summary — 4 cols, sticky */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 self-start">
            <CheckoutSummary />
          </div>
        </div>
      </main>
    </div>
  );
}
