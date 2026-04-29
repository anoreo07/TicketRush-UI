"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TopNavBar from '@/app/components/TopNavBar';
import Footer from '@/app/components/Footer'; // Sử dụng component có sẵn

import { eventsApi, Event } from '@/lib/api/events';

export default function QueuePage() {
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);

  // Logic Hàng chờ từ code cũ của bạn
  const [queuePosition, setQueuePosition] = useState(10);
  const [totalInQueue] = useState(2000);
  const [bookingStatus, setBookingStatus] = useState<'processing' | 'completed'>('processing');
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const eventId = sessionStorage.getItem('bookingEventId');
    if (eventId) {
      eventsApi.getById(eventId).then(setEvent).catch(console.error);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(prev => prev + 1);

      // Mô phỏng di chuyển hàng chờ mỗi 5 giây
      if (elapsedTime % 5 === 0 && queuePosition > 1) {
        setQueuePosition(prev => Math.max(1, prev - Math.floor(Math.random() * 5 + 1)));
      }

      // Xử lý khi đến lượt
      if (queuePosition === 1 && bookingStatus === 'processing') {
        setBookingStatus('completed');
        const timeout = setTimeout(() => {
          const eventId = sessionStorage.getItem('bookingEventId');
          router.push(eventId ? `/booking` : '/events');
        }, 3000);
        return () => clearTimeout(timeout);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [elapsedTime, queuePosition, bookingStatus, router]);

  const progress = ((totalInQueue - queuePosition) / totalInQueue) * 100;
  const estimatedMinutes = Math.max(1, Math.ceil(queuePosition * 0.005));

  return (
    <div className="flex flex-col min-h-screen bg-[#f7f9fb] text-[#191c1e] font-['Be_Vietnam_Pro'] antialiased">
      <TopNavBar />

      <main className="flex-grow max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* CỘT TRÁI: TRẠNG THÁI HÀNG CHỜ */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="flex-grow bg-white p-6 md:p-10 rounded-[2rem] shadow-[0_20px_40px_rgba(48,30,201,0.04)] text-center relative overflow-hidden border border-slate-100 flex flex-col justify-center">

              {/* Decorative Background */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#301ec9]/5 rounded-full blur-3xl -mr-32 -mt-32"></div>

              <div className="relative z-10 space-y-4">
                <div className="flex justify-center">
                  <span className={`inline-flex items-center gap-2 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${bookingStatus === 'completed' ? 'bg-green-100 text-green-700' : 'bg-[#e2dfff] text-[#0f0069]'
                    }`}>
                    <span className={`w-2 h-2 rounded-full ${bookingStatus === 'completed' ? 'bg-green-500' : 'bg-[#301ec9] animate-pulse'}`}></span>
                    {bookingStatus === 'completed' ? 'Đã đến lượt' : 'Trực tiếp'}
                  </span>
                </div>

                <h1 className="font-['Manrope'] text-xl md:text-2xl text-[#484554] font-semibold">
                  {bookingStatus === 'completed' ? 'Sẵn sàng đặt vé!' : 'Vị trí của bạn'}
                </h1>

                <div className="flex flex-col items-center justify-center py-2">
                  <span className="font-['Manrope'] text-7xl md:text-8xl font-extrabold text-[#301ec9] tracking-tighter transition-all duration-700">
                    {bookingStatus === 'completed' ? 'GO!' : queuePosition.toLocaleString()}
                  </span>
                  <p className="text-base text-[#484554]/70 font-medium mt-2">
                    {bookingStatus === 'completed'
                      ? 'Đang chuyển hướng bạn đến trang thanh toán...'
                      : 'Người đang xếp hàng trước bạn'}
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-3 max-w-sm mx-auto">
                  <div className="w-full h-2.5 bg-[#eceef0] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#301ec9] to-[#5700bf] rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(87,0,191,0.3)]"
                      style={{ width: `${bookingStatus === 'completed' ? 100 : progress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[11px] font-bold text-[#484554]">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">schedule</span>
                      {bookingStatus === 'completed' ? 'Ngay bây giờ' : `Còn khoảng ${estimatedMinutes} phút`}
                    </span>
                    <span>{Math.round(bookingStatus === 'completed' ? 100 : progress)}% Hoàn tất</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-[#c9c4d7]/30">
                  <div className={`flex items-center justify-center gap-3 py-3 px-5 rounded-xl transition-colors ${bookingStatus === 'completed' ? 'bg-green-50 text-green-700' : 'bg-[#301ec9]/5 text-[#301ec9]'
                    }`}>
                    <span className="material-symbols-outlined text-xl">{bookingStatus === 'completed' ? 'check_circle' : 'info'}</span>
                    <p className="text-xs md:text-sm font-bold leading-relaxed">
                      {bookingStatus === 'completed'
                        ? 'Phiên làm việc đã sẵn sàng. Chúc bạn săn vé thành công!'
                        : 'Đừng tải lại trang, chúng tôi đang giữ chỗ cho bạn.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Engagement Info - Simplified for No-Scroll */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/60 p-4 rounded-2xl flex items-center gap-3 border border-white">
                <span className="material-symbols-outlined text-[#301ec9] bg-white p-2 rounded-lg shadow-sm">verified_user</span>
                <span className="text-[11px] font-bold text-[#191c1e]">Công bằng tuyệt đối</span>
              </div>
              <div className="bg-white/60 p-4 rounded-2xl flex items-center gap-3 border border-white">
                <span className="material-symbols-outlined text-[#301ec9] bg-white p-2 rounded-lg shadow-sm">security</span>
                <span className="text-[11px] font-bold text-[#191c1e]">Bảo mật TicketRush</span>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: CONTEXT SỰ KIỆN */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-white rounded-[2rem] overflow-hidden shadow-[0_20px_40px_rgba(48,30,201,0.04)] border border-slate-100 flex flex-col">
              <div className="relative h-40 w-full shrink-0 bg-slate-100">
                {event ? (
                  <>
                    <img
                      alt={event.title}
                      className="w-full h-full object-cover"
                      src={event.image_url || "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop"}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div className="absolute bottom-3 left-4">
                      <span className="bg-[#5700bf] text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest">
                        Sắp diễn ra
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full animate-pulse flex items-center justify-center">
                    <span className="material-symbols-outlined text-slate-300">image</span>
                  </div>
                )}
              </div>
              <div className="p-6 space-y-4 flex-grow flex flex-col justify-center">
                <div>
                  <h2 className="font-['Manrope'] text-xl font-black text-[#191c1e] leading-tight mb-1">
                    {event?.title || "Đang tải thông tin..."}
                  </h2>
                  <p className="text-[#484554] font-bold flex items-center gap-1.5 text-xs">
                    <span className="material-symbols-outlined text-[#301ec9] text-base">location_on</span>
                    {event?.location || "Địa điểm tổ chức"}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#eceef0]">
                  <div>
                    <p className="text-[9px] text-[#484554]/60 uppercase font-black tracking-widest mb-0.5">Ngày</p>
                    <p className="font-bold text-[#191c1e] text-xs">
                      {event ? new Date(event.start_time).toLocaleDateString('vi-VN') : "--/--/----"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] text-[#484554]/60 uppercase font-black tracking-widest mb-0.5">Giờ</p>
                    <p className="font-bold text-[#191c1e] text-xs">
                      {event ? new Date(event.start_time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : "--:--"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#eceef0]/50 p-6 rounded-[2rem] border border-white flex-grow flex flex-col justify-center">
              <h3 className="font-['Manrope'] text-base font-black text-[#191c1e] flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-[#5700bf] text-xl">lightbulb</span>
                Mẹo quan trọng
              </h3>
              <ul className="space-y-3">
                {[
                  "Chuẩn bị sẵn thông tin thanh toán.",
                  "Kiểm tra kết nối mạng ổn định.",
                  "Không mở nhiều trình duyệt."
                ].map((tip, index) => (
                  <li key={index} className="flex gap-3 items-center">
                    <span className="flex-shrink-0 w-5 h-5 bg-[#301ec9] text-white rounded-full text-[9px] font-black flex items-center justify-center">
                      {index + 1}
                    </span>
                    <p className="text-xs text-[#484554] font-medium">{tip}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@600;700;800&family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap');
        
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
      `}</style>
    </div>
  );
}