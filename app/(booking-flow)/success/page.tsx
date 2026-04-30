'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import TopNavBar from '@/app/components/TopNavBar';
import Footer from '@/app/components/Footer';
import { bookingApi, TicketResponse, eventsApi } from '@/lib/api';

const SuccessContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');

  const [tickets, setTickets] = useState<TicketResponse[]>([]);
  const [event, setEvent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        if (!bookingId) return;

        // Fetch tickets for this booking
        const allTickets = await bookingApi.getMyTickets();
        const recentTickets = allTickets.filter(t =>
          bookingId ? (t as any).booking_id === bookingId : true
        );

        const ticketsToDisplay = recentTickets.length > 0 ? recentTickets : allTickets.slice(0, 1);
        setTickets(ticketsToDisplay);

        // Fetch event details from the first ticket's booking
        const firstTicket = ticketsToDisplay[0] as any;
        const eventData = firstTicket?.bookings?.events;
        
        if (eventData) {
          setEvent(eventData);

          // Add to notifications
          const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
          if (!notifications.find((n: any) => n.bookingId === bookingId)) {
            const newNotification = {
              id: Date.now(),
              bookingId: bookingId,
              message: `Thanh toán thành công vé sự kiện ${eventData.title}!`,
              read: false,
              date: new Date().toISOString()
            };
            notifications.unshift(newNotification);
            localStorage.setItem('notifications', JSON.stringify(notifications));
            window.dispatchEvent(new Event('storage'));
          }
        }
      } catch (error) {
        console.error('Failed to fetch booking details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookingDetails();

    // Logic đếm ngược
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    
    return () => clearInterval(timer);
  }, [bookingId]);

  // Logic chuyển hướng khi countdown về 0
  useEffect(() => {
    if (countdown === 0) {
      router.push('/profile');
    }
  }, [countdown, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const bookingCode = bookingId ? `#TR-${bookingId.slice(0, 8).toUpperCase()}` : "#TR-8829104";

  return (
    <div className="bg-surface font-body text-on-surface antialiased min-h-screen flex flex-col">
      <TopNavBar />

      <main className="flex-grow py-16 px-4 flex flex-col items-center pt-24" style={{ zoom: 0.85 }}>
        {/* Success Animation Wrapper */}
        <div className="flex flex-col items-center text-center max-w-2xl mb-12 animate-fade-in-up">
          <div className="w-24 h-24 mb-6 rounded-full bg-gradient-to-tr from-primary to-tertiary flex items-center justify-center shadow-xl shadow-primary/20 relative">
            <div className="absolute inset-0 rounded-full animate-ping bg-primary/20"></div>
            <span className="material-symbols-outlined text-white text-5xl relative z-10" style={{ fontVariationSettings: "'FILL' 0, 'wght' 600" }}>
              check_circle
            </span>
          </div>
          <h1 className="font-headline text-4xl md:text-5xl font-extrabold text-on-surface tracking-tight mb-4">
            Đặt vé thành công!
          </h1>
          <p className="text-on-surface-variant text-lg leading-relaxed max-w-md font-medium">
            Cảm ơn bạn đã tin tưởng TicketRush. Vé của bạn đã được hệ thống ghi nhận.
          </p>
          <p className="mt-4 text-sm text-primary font-bold bg-primary/5 px-4 py-1.5 rounded-full">
            Tự động chuyển hướng sau {countdown} giây...
          </p>
        </div>

        {/* Tickets List */}
        <div className="w-full max-w-4xl space-y-6">
          {tickets.map((ticket, index) => (
            <div
              key={ticket.id}
              className="grid md:grid-cols-5 gap-0 rounded-[32px] overflow-hidden shadow-[0_20px_60px_rgba(48,30,201,0.08)] bg-white border border-slate-50 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Event Visual */}
              <div className="md:col-span-2 relative h-64 md:h-full min-h-[300px]">
                <img
                  className="absolute inset-0 w-full h-full object-cover"
                  src={event?.image_url || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80"}
                  alt="Event cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent"></div>
                <div className="absolute bottom-8 left-8 text-white">
                  <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-3 inline-block border border-white/30">
                    Vé Điện Tử
                  </span>
                  <h3 className="font-headline text-xl font-black tracking-tight">{bookingCode}</h3>
                </div>
              </div>

              {/* Ticket Details */}
              <div className="md:col-span-3 p-10 flex flex-col md:flex-row gap-10">
                <div className="flex-1 space-y-8">
                  <div>
                    <h2 className="font-headline text-2xl font-black text-primary mb-4 leading-tight">
                      {event?.title || "Đêm Nhạc Hội Velvet Horizon 2024"}
                    </h2>
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-3 text-slate-500 font-medium text-sm">
                        <span className="material-symbols-outlined text-primary/60 text-xl">calendar_today</span>
                        <span>{event?.start_time ? new Date(event.start_time).toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' }) : "24 Tháng 12, 2024"}</span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-500 font-medium text-sm">
                        <span className="material-symbols-outlined text-primary/60 text-xl">schedule</span>
                        <span>19:30 - 22:30</span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-500 font-medium text-sm">
                        <span className="material-symbols-outlined text-primary/60 text-xl">location_on</span>
                        <span className="truncate">{event?.location || "Nhà hát Lớn Hà Nội"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-slate-100">
                    <p className="text-[10px] text-slate-400 mb-2 uppercase tracking-[0.2em] font-black">Vị trí chỗ ngồi</p>
                    <p className="font-headline text-xl font-black text-slate-800">
                      {(ticket as any).seats?.zone_name || "Khu vực A1"} - Hàng {(ticket as any).seats?.row_index + 1} - Ghế {(ticket as any).seats?.col_index + 1}
                    </p>
                  </div>
                </div>

                {/* QR Code */}
                <div className="flex flex-col items-center justify-center gap-6 border-l-0 md:border-l border-slate-100 md:pl-10">
                  <div className="p-4 bg-white rounded-3xl border border-slate-100 shadow-sm group hover:scale-105 transition-transform duration-500">
                    <img
                      className="w-32 h-32 opacity-90"
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticket.id}`}
                      alt="QR Code"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 text-center font-bold uppercase tracking-widest leading-relaxed">
                    Quét mã tại<br />cổng kiểm soát
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <button
            onClick={() => router.push('/profile')}
            className="flex-1 bg-primary text-white font-headline font-black py-5 px-8 rounded-full shadow-xl shadow-primary/20 hover:opacity-90 transition-all flex items-center justify-center gap-3 active:scale-95"
          >
            <span>Xem vé của tôi</span>
            <span className="material-symbols-outlined text-xl">confirmation_number</span>
          </button>
          <button className="flex-1 border-2 border-slate-200 text-slate-600 font-headline font-black py-5 px-8 rounded-full hover:bg-slate-50 transition-all flex items-center justify-center gap-3 active:scale-95">
            <span className="material-symbols-outlined text-xl">download</span>
            <span>Tải vé PDF</span>
          </button>
        </div>

        {/* Assistance Note */}
        <p className="mt-12 text-sm text-slate-400 font-medium">
          Gặp vấn đề? <a className="text-primary font-black hover:underline" href="#">Liên hệ bộ phận hỗ trợ TicketRush</a> (24/7)
        </p>
      </main>

      <Footer />
    </div>
  );
};

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>}>
      <SuccessContent />
    </Suspense>
  );
}
