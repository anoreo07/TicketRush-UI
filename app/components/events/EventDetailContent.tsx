/**
 * EventDetailContent
 * Client component hiển thị chi tiết sự kiện
 */

'use client';

import { useEffect, useState } from 'react';
import { useEventBooking } from '@/lib/context/EventBookingContext';
import TopNavBar from '@/app/components/TopNavBar';
import { useRouter } from 'next/navigation';

interface EventDetailContentProps {
  eventId: string;
}

export const EventDetailContent: React.FC<EventDetailContentProps> = ({ eventId }) => {
  const router = useRouter();
  const { currentEvent, isLoading, error, selectEvent } = useEventBooking();
  const [isSelected, setIsSelected] = useState(false);

  /**
   * Load event on mount
   */
  useEffect(() => {
    const loadEvent = async () => {
      try {
        await selectEvent(eventId);
        setIsSelected(true);
      } catch (err) {
        console.error('Failed to load event:', err);
      }
    };

    loadEvent();
  }, [eventId, selectEvent]);

  if (isLoading || !currentEvent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <TopNavBar />
        <main className="pt-28 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-96 bg-gray-200 rounded-2xl" />
            <div className="h-40 bg-gray-200 rounded-2xl" />
          </div>
        </main>
      </div>
    );
  }

  const eventDate = new Date(currentEvent.event_date);
  const formattedDate = eventDate.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const formattedTime = eventDate.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  });
  const weekday = eventDate.toLocaleDateString('vi-VN', { weekday: 'long' });

  const handleBuyTickets = async () => {
    router.push(`/booking/${eventId}`);
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <TopNavBar />

      <main className="pt-28 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
        {/* Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16">
          <div className="lg:col-span-5 space-y-6">
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-fixed-dim text-on-primary-fixed rounded-full text-xs font-semibold uppercase tracking-wider">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
              Đang mở bán
            </div>

            {/* Title */}
            <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-extrabold text-on-surface leading-[1.1] tracking-tight">
              {currentEvent.title}
              <span className="text-primary"> 2024</span>
            </h1>

            {/* Date & Location */}
            <div className="space-y-4 py-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary flex-shrink-0">
                  <span className="material-symbols-outlined">calendar_today</span>
                </div>
                <div>
                  <p className="font-headline font-bold text-lg">
                    {formattedDate}
                  </p>
                  <p className="text-on-surface-variant text-sm">
                    {formattedTime} ({weekday})
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary flex-shrink-0">
                  <span className="material-symbols-outlined">location_on</span>
                </div>
                <div>
                  <p className="font-headline font-bold text-lg">{currentEvent.venue}</p>
                  <p className="text-on-surface-variant text-sm">{currentEvent.location}</p>
                </div>
              </div>
            </div>

            {/* Price & CTA */}
            <div className="flex flex-col sm:flex-row items-center gap-6 pt-4 border-t border-outline-variant/30">
              <div>
                <p className="text-on-surface-variant text-sm mb-1 font-medium">Giá vé chỉ từ</p>
                <p className="text-3xl font-headline font-black text-primary">
                  {currentEvent.price_range.min.toLocaleString('vi-VN')}đ
                </p>
              </div>
              <button
                onClick={handleBuyTickets}
                className="w-full sm:w-auto px-10 py-4 bg-tertiary text-white rounded-full font-headline font-bold text-lg hover:bg-tertiary-container transition-all active:scale-95 shadow-lg shadow-tertiary/20"
              >
                Mua vé ngay
              </button>
            </div>
          </div>

          {/* Event Image */}
          <div className="lg:col-span-7">
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-tr from-primary/10 to-tertiary/10 rounded-[2.5rem] blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
              <div className="relative rounded-[2rem] overflow-hidden aspect-[16/10] shadow-[0_20px_40px_rgba(48,30,201,0.06)]">
                <img
                  alt={currentEvent.title}
                  className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                  src={currentEvent.image_url}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-12">
            {/* Introduction Section */}
            <section>
              <h2 className="font-headline text-2xl font-extrabold mb-6 flex items-center gap-3">
                <span className="w-8 h-[2px] bg-primary"></span>
                Giới thiệu sự kiện
              </h2>
              <div className="space-y-4 text-on-surface-variant leading-relaxed text-lg">
                <p>{currentEvent.description}</p>
                {currentEvent.rules && currentEvent.rules.length > 0 && (
                  <div>
                    <h3 className="font-bold text-on-surface mb-3">Quy tắc sự kiện:</h3>
                    <ul className="space-y-2">
                      {currentEvent.rules.map((rule, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>

            {/* Details Section */}
            <section>
              <h2 className="font-headline text-2xl font-extrabold mb-6 flex items-center gap-3">
                <span className="w-8 h-[2px] bg-primary"></span>
                Thông tin chi tiết
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Check-in Rules */}
                <div className="p-6 bg-surface-container-low rounded-xl">
                  <h3 className="font-headline font-bold text-primary mb-4">Quy định check-in</h3>
                  <ul className="text-on-surface-variant space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">verified</span>
                      Vui lòng mang theo vé điện tử (QR Code)
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">verified</span>
                      Cổng sẽ mở từ 17:00
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">verified</span>
                      Mang theo CCCD/Hộ chiếu để xác minh
                    </li>
                  </ul>
                </div>

                {/* Prohibited Items */}
                <div className="p-6 bg-surface-container-low rounded-xl">
                  <h3 className="font-headline font-bold text-primary mb-4">Vật dụng bị cấm</h3>
                  <ul className="text-on-surface-variant space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">block</span>
                      Các loại chất cấm, chất gây cháy nổ
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">block</span>
                      Vũ khí hoặc vật dụng sắc nhọn
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">block</span>
                      Máy quay phim chuyên nghiệp
                    </li>
                  </ul>
                </div>
              </div>
            </section>
          </div>

          {/* Right Sidebar */}
          <aside className="space-y-8">
            {/* Summary Card */}
            <div className="bg-surface-container-lowest rounded-[1.5rem] p-8 shadow-sm border border-outline-variant/10">
              <h3 className="font-headline text-xl font-bold mb-6">Tóm tắt sự kiện</h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="text-primary flex-shrink-0">
                    <span className="material-symbols-outlined">person</span>
                  </div>
                  <div>
                    <p className="text-xs text-on-surface-variant font-medium uppercase tracking-tighter">
                      Đối tượng
                    </p>
                    <p className="font-medium">Mọi lứa tuổi</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="text-primary flex-shrink-0">
                    <span className="material-symbols-outlined">confirmation_number</span>
                  </div>
                  <div>
                    <p className="text-xs text-on-surface-variant font-medium uppercase tracking-tighter">
                      Loại vé
                    </p>
                    <p className="font-medium">GA, VIP, VVIP</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="text-primary flex-shrink-0">
                    <span className="material-symbols-outlined">language</span>
                  </div>
                  <div>
                    <p className="text-xs text-on-surface-variant font-medium uppercase tracking-tighter">
                      Ngôn ngữ
                    </p>
                    <p className="font-medium">Tiếng Việt &amp; Tiếng Anh</p>
                  </div>
                </div>
              </div>

              <button className="w-full mt-8 py-3 bg-primary text-white rounded-full font-headline font-bold hover:bg-primary-container transition-all active:scale-95">
                Tải Sơ đồ Sân khấu
              </button>
            </div>

            {/* Partner Offers */}
            <div className="bg-gradient-to-br from-primary to-tertiary p-[1px] rounded-[1.5rem] overflow-hidden">
              <div className="bg-surface-container-lowest h-full p-8 rounded-[1.45rem]">
                <h3 className="font-headline text-xl font-bold mb-6 flex items-center justify-between">
                  Ưu đãi đối tác
                  <span className="material-symbols-outlined text-tertiary">featured_seasonal_and_gifts</span>
                </h3>

                <div className="space-y-4">
                  {/* MB Bank */}
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors cursor-pointer group">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm font-black text-blue-800 text-xs italic flex-shrink-0">
                      MB
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-sm">MB Bank</p>
                      <p className="text-xs text-on-surface-variant">Giảm 15% tối đa 200k</p>
                    </div>
                    <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                      arrow_forward_ios
                    </span>
                  </div>

                  {/* ShopeePay */}
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors cursor-pointer group">
                    <div className="w-12 h-12 bg-[#ee4d2d] rounded-full flex items-center justify-center shadow-sm text-white font-black text-xs italic flex-shrink-0">
                      SP
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-sm">ShopeePay</p>
                      <p className="text-xs text-on-surface-variant">Hoàn xu 10% khi đặt vé</p>
                    </div>
                    <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                      arrow_forward_ios
                    </span>
                  </div>
                </div>

                <p className="mt-6 text-[10px] text-center text-on-surface-variant uppercase tracking-widest font-bold">
                  Chương trình có hạn
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-t border-slate-100 dark:border-slate-800 flex justify-around items-center py-3 z-50">
        <a
          className="flex flex-col items-center text-primary font-bold"
          href="/events"
        >
          <span className="material-symbols-outlined">explore</span>
          <span className="text-[10px]">Khám phá</span>
        </a>
        <a
          className="flex flex-col items-center text-slate-400 dark:text-slate-500"
          href="/tickets"
        >
          <span className="material-symbols-outlined">confirmation_number</span>
          <span className="text-[10px]">Vé của tôi</span>
        </a>
        <a
          className="flex flex-col items-center text-slate-400 dark:text-slate-500"
          href="#"
        >
          <span className="material-symbols-outlined">person</span>
          <span className="text-[10px]">Cá nhân</span>
        </a>
      </nav>
    </div>
  );
};
