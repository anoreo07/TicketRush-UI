'use client';

import { useEffect, useRef } from 'react';
import { useEventBooking } from '@/lib/context/EventBookingContext';
import TopNavBar from '@/app/components/TopNavBar';
import { useRouter } from 'next/navigation';

interface EventDetailContentProps {
  eventId: string;
}

export const EventDetailContent: React.FC<EventDetailContentProps> = ({ eventId }) => {
  const router = useRouter();
  const { currentEvent, isLoading, selectEvent } = useEventBooking();
  const selectEventRef = useRef(selectEvent);
  const loadedEventIdRef = useRef<string | null>(null);

  useEffect(() => {
    selectEventRef.current = selectEvent;
  }, [selectEvent]);

  useEffect(() => {
    if (!eventId) return;
    if (loadedEventIdRef.current === eventId) return;
    loadedEventIdRef.current = eventId;

    const loadEvent = async () => {
      try {
        await selectEventRef.current(eventId);
      } catch (err) {
        console.error('❌ Failed to load event:', err);
      }
    };
    loadEvent();
  }, [eventId]);

  if (isLoading || !currentEvent) {
    return (
      <div className="min-h-screen bg-white">
        <TopNavBar />
        <main className="pt-28 pb-20 px-4 md:px-8 max-w-7xl mx-auto animate-pulse">
          <div className="h-96 bg-slate-100 rounded-[2rem]" />
        </main>
      </div>
    );
  }

  const eventDate = new Date(currentEvent.event_date);
  const formattedDate = eventDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const formattedTime = eventDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  const weekday = eventDate.toLocaleDateString('vi-VN', { weekday: 'long' });

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-100">
      <TopNavBar />

      <main className="pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
        {/* --- HERO SECTION --- */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          <div className="lg:col-span-5 space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></span>
              Đang mở bán
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight">
              {currentEvent.title.includes('TicketRush') ? (
                <>
                  {currentEvent.title.split('TicketRush')[0]}
                  <span className="text-indigo-600">TicketRush</span>
                  {currentEvent.title.split('TicketRush')[1]}
                </>
              ) : currentEvent.title}
              <span className="text-slate-900"> 2024</span>
            </h1>

            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0">
                  <span className="material-symbols-outlined text-[22px]">calendar_today</span>
                </div>
                <div>
                  <p className="font-bold text-lg text-slate-800">{formattedDate}</p>
                  <p className="text-slate-500 text-sm">{formattedTime} ({weekday})</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0">
                  <span className="material-symbols-outlined text-[22px]">location_on</span>
                </div>
                <div>
                  <p className="font-bold text-lg text-slate-800">{currentEvent.venue}</p>
                  <p className="text-slate-500 text-sm">{currentEvent.location}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-8 pt-8 border-t border-slate-100">
              <div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Giá vé chỉ từ</p>
                <p className="text-3xl font-black text-[#2ECC71]">
                  {currentEvent.price_range?.min?.toLocaleString('vi-VN') || '0'}đ
                </p>
              </div>
              <button
                onClick={() => {
                  sessionStorage.setItem('bookingEventId', eventId);
                  router.push('/queue');
                }}
                className="px-10 py-4 bg-[#2ECC71] text-white rounded-full font-bold text-lg 
             transition-all active:scale-95
             /* Hiệu ứng phát sáng mặc định */
             shadow-[0_0_15px_rgba(46,204,113,0.4)] 
             /* Hiệu ứng khi hover: sáng mạnh hơn và đổi màu theo ý bạn */
             hover:bg-[#27ae60] 
             hover:shadow-[0_0_25px_rgba(46,204,113,0.6)] 
             hover:shadow-green-200"
              >
                Mua vé ngay
              </button>
            </div>
          </div>

          {/* Event Image */}
          <div className="lg:col-span-7">
            <div className="relative rounded-[2.5rem] overflow-hidden aspect-[16/10] shadow-2xl shadow-indigo-100 group">
              <img
                alt={currentEvent.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                src={currentEvent.image_url}
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-[2.5rem]"></div>
            </div>
          </div>
        </section>

        {/* --- MAIN CONTENT AREA --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-16">
            {/* Introduction */}
            <section>
              <h2 className="text-xl font-black mb-6 flex items-center gap-3">
                <span className="w-8 h-[2px] bg-indigo-600"></span>
                Giới thiệu sự kiện
              </h2>
              <div className="text-slate-600 leading-relaxed text-base space-y-4">
                <p>{currentEvent.description}</p>
              </div>
            </section>

            {/* Details */}
            <section>
              <h2 className="text-xl font-black mb-8 flex items-center gap-3">
                <span className="w-8 h-[2px] bg-indigo-600"></span>
                Thông tin chi tiết
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                  <h3 className="font-bold text-indigo-600 mb-5 uppercase text-xs tracking-widest">Quy định check-in</h3>
                  <ul className="space-y-4">
                    {['Vui lòng mang theo vé điện tử (QR Code)', 'Cổng sẽ mở từ 17:00', 'Mang theo CCCD/Hộ chiếu để xác minh'].map((text, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                        <span className="material-symbols-outlined text-slate-400 text-lg">check_circle</span>
                        {text}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                  <h3 className="font-bold text-indigo-600 mb-5 uppercase text-xs tracking-widest">Vật dụng bị cấm</h3>
                  <ul className="space-y-4">
                    {['Các loại chất cấm, chất gây cháy nổ', 'Vũ khí hoặc vật dụng sắc nhọn', 'Máy quay phim chuyên nghiệp'].map((text, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                        <span className="material-symbols-outlined text-slate-400 text-lg">block</span>
                        {text}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          </div>

          {/* --- SIDEBAR --- */}
          <aside className="space-y-10">
            {/* Summary Card */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
              <h3 className="text-lg font-black mb-8">Tóm tắt sự kiện</h3>
              <div className="space-y-8">
                {[
                  { icon: 'person', label: 'Đối tượng', value: 'Mọi lứa tuổi (Dưới 12 tuổi cần người giám hộ)' },
                  { icon: 'confirmation_number', label: 'Loại vé', value: 'GA, VIP, VVIP (Limited Edition)' },
                  { icon: 'language', label: 'Ngôn ngữ', value: 'Tiếng Việt & Tiếng Anh' }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <span className="material-symbols-outlined text-indigo-600">{item.icon}</span>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{item.label}</p>
                      <p className="text-sm font-bold text-slate-800">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-all active:scale-[0.98]">
                Tải Sơ đồ Sân khấu
              </button>
            </div>

            {/* Partner Offers */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-black">Ưu đãi đối tác</h3>
                <span className="material-symbols-outlined text-indigo-600">featured_seasonal_and_gifts</span>
              </div>

              <div className="space-y-3">
                {[
                  { name: 'MB Bank', desc: 'Giảm 15% tối đa 200k', code: 'MB', color: 'text-blue-700 bg-blue-50' },
                  { name: 'ShopeePay', desc: 'Hoàn xu 10% khi đặt vé', code: 'SP', color: 'text-orange-600 bg-orange-50' }
                ].map((partner, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-transparent hover:border-indigo-100 hover:bg-white transition-all cursor-pointer group">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-xs italic flex-shrink-0 ${partner.color}`}>
                      {partner.code}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-sm text-slate-800">{partner.name}</p>
                      <p className="text-xs text-slate-500 font-medium">{partner.desc}</p>
                    </div>
                    <span className="material-symbols-outlined text-slate-300 group-hover:translate-x-1 transition-transform text-sm">arrow_forward_ios</span>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-[10px] text-center text-slate-400 uppercase tracking-[0.2em] font-bold">Chương trình có hạn</p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};