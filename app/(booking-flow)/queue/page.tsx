"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TopNavBar from '@/app/components/TopNavBar';
import Footer from '@/app/components/Footer'; // Sử dụng component có sẵn

// Thông tin sự kiện mô phỏng
const EVENT_DATA = {
  title: "VCT Pacific Stage 1 Finals",
  location: "Nhà thi đấu Quân khu 7, TP. Hồ Chí Minh",
  date: "25 Th05, 2024",
  time: "18:00",
  category: "Esports",
  imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop"
};

export default function QueuePage() {
  const router = useRouter();

  // Logic Hàng chờ từ code cũ của bạn
  const [queuePosition, setQueuePosition] = useState(10);
  const [totalInQueue] = useState(2000);
  const [bookingStatus, setBookingStatus] = useState<'processing' | 'completed'>('processing');
  const [elapsedTime, setElapsedTime] = useState(0);

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

      <main className="flex-grow max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* CỘT TRÁI: TRẠNG THÁI HÀNG CHỜ */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white p-10 md:p-16 rounded-[2rem] shadow-[0_20px_40px_rgba(48,30,201,0.04)] text-center relative overflow-hidden border border-slate-100">

              {/* Decorative Background */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#301ec9]/5 rounded-full blur-3xl -mr-32 -mt-32"></div>

              <div className="relative z-10 space-y-6">
                <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider ${bookingStatus === 'completed' ? 'bg-green-100 text-green-700' : 'bg-[#e2dfff] text-[#0f0069]'
                  }`}>
                  <span className={`w-2 h-2 rounded-full ${bookingStatus === 'completed' ? 'bg-green-500' : 'bg-[#301ec9] animate-pulse'}`}></span>
                  {bookingStatus === 'completed' ? 'Đã đến lượt' : 'Trực tiếp'}
                </span>

                <h1 className="font-['Manrope'] text-2xl md:text-3xl text-[#484554] font-semibold">
                  {bookingStatus === 'completed' ? 'Sẵn sàng đặt vé!' : 'Vị trí của bạn'}
                </h1>

                <div className="flex flex-col items-center justify-center py-6">
                  <span className="font-['Manrope'] text-8xl md:text-9xl font-extrabold text-[#301ec9] tracking-tighter transition-all duration-700">
                    {bookingStatus === 'completed' ? 'GO!' : queuePosition.toLocaleString()}
                  </span>
                  <p className="text-lg text-[#484554]/70 font-medium mt-4">
                    {bookingStatus === 'completed'
                      ? 'Đang chuyển hướng bạn đến trang thanh toán...'
                      : 'Người đang xếp hàng trước bạn'}
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-4 max-w-md mx-auto">
                  <div className="w-full h-3 bg-[#eceef0] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#301ec9] to-[#5700bf] rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(87,0,191,0.3)]"
                      style={{ width: `${bookingStatus === 'completed' ? 100 : progress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-[#484554]">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">schedule</span>
                      {bookingStatus === 'completed' ? 'Ngay bây giờ' : `Còn khoảng ${estimatedMinutes} phút`}
                    </span>
                    <span>{Math.round(bookingStatus === 'completed' ? 100 : progress)}% Hoàn tất</span>
                  </div>
                </div>

                <div className="pt-8 border-t border-[#c9c4d7]/30">
                  <div className={`flex items-center justify-center gap-3 py-4 px-6 rounded-2xl transition-colors ${bookingStatus === 'completed' ? 'bg-green-50 text-green-700' : 'bg-[#301ec9]/5 text-[#301ec9]'
                    }`}>
                    <span className="material-symbols-outlined">{bookingStatus === 'completed' ? 'check_circle' : 'info'}</span>
                    <p className="text-sm md:text-base font-bold leading-relaxed">
                      {bookingStatus === 'completed'
                        ? 'Phiên làm việc đã sẵn sàng. Chúc bạn săn vé thành công!'
                        : 'Đừng tải lại trang, chúng tôi đang giữ chỗ cho bạn. Phiên đăng nhập sẽ tự động chuyển hướng.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Engagement Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#f2f4f6] p-6 rounded-2xl flex gap-4 border border-transparent hover:border-[#301ec9]/10 transition-all">
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-[#301ec9] shadow-sm shrink-0">
                  <span className="material-symbols-outlined">verified_user</span>
                </div>
                <div>
                  <h3 className="font-['Manrope'] font-bold text-[#191c1e] mb-1">Công bằng tuyệt đối</h3>
                  <p className="text-sm text-[#484554]">Hệ thống TicketRush đảm bảo thứ tự mua vé minh bạch cho tất cả mọi người.</p>
                </div>
              </div>
              <div className="bg-[#f2f4f6] p-6 rounded-2xl flex gap-4 border border-transparent hover:border-[#301ec9]/10 transition-all">
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-[#301ec9] shadow-sm shrink-0">
                  <span className="material-symbols-outlined">security</span>
                </div>
                <div>
                  <h3 className="font-['Manrope'] font-bold text-[#191c1e] mb-1">Bảo mật cao</h3>
                  <p className="text-sm text-[#484554]">Ngăn chặn bot để bảo vệ quyền lợi của người hâm mộ thực sự.</p>
                </div>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: CONTEXT SỰ KIỆN */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white rounded-[2rem] overflow-hidden shadow-[0_20px_40px_rgba(48,30,201,0.04)] border border-slate-100">
              <div className="relative h-56 w-full">
                <img
                  alt={EVENT_DATA.title}
                  className="w-full h-full object-cover"
                  src={EVENT_DATA.imageUrl}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-4 left-6">
                  <span className="bg-[#5700bf] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                    {EVENT_DATA.category}
                  </span>
                </div>
              </div>
              <div className="p-8 space-y-6">
                <div>
                  <h2 className="font-['Manrope'] text-2xl font-black text-[#191c1e] leading-tight mb-2">
                    {EVENT_DATA.title}
                  </h2>
                  <p className="text-[#484554] font-bold flex items-center gap-2 text-sm">
                    <span className="material-symbols-outlined text-[#301ec9] text-xl">location_on</span>
                    {EVENT_DATA.location}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-[#eceef0]">
                  <div>
                    <p className="text-[10px] text-[#484554]/60 uppercase font-black tracking-widest mb-1">Ngày diễn ra</p>
                    <p className="font-bold text-[#191c1e]">{EVENT_DATA.date}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#484554]/60 uppercase font-black tracking-widest mb-1">Giờ bắt đầu</p>
                    <p className="font-bold text-[#191c1e]">{EVENT_DATA.time}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#eceef0]/50 p-8 rounded-[2rem] space-y-6 border border-white">
              <h3 className="font-['Manrope'] text-xl font-black text-[#191c1e] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#5700bf]">lightbulb</span>
                Mẹo trong lúc chờ đợi
              </h3>
              <ul className="space-y-5">
                {[
                  "Chuẩn bị sẵn thông tin thanh toán để hoàn tất đặt vé nhanh nhất.",
                  "Kiểm tra kết nối mạng. Sử dụng Wifi ổn định thay vì 4G nếu có thể.",
                  "Mỗi tài khoản chỉ nên mở một trình duyệt duy nhất để tránh lỗi."
                ].map((tip, index) => (
                  <li key={index} className="flex gap-4 items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-[#301ec9] text-white rounded-full text-[10px] font-black flex items-center justify-center">
                      {index + 1}
                    </span>
                    <p className="text-sm text-[#484554] font-medium leading-relaxed">{tip}</p>
                  </li>
                ))}
              </ul>
              <div className="pt-4">
                <button className="w-full py-4 border-2 border-[#301ec9]/10 text-[#301ec9] font-black rounded-2xl hover:bg-[#301ec9] hover:text-white transition-all text-sm flex items-center justify-center gap-2">
                  Xem các câu hỏi thường gặp
                  <span className="material-symbols-outlined text-sm">open_in_new</span>
                </button>
              </div>
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