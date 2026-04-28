/**
 * Featured Event Section
 * Hiển thị sự kiện nổi bật
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useEventBooking } from '@/lib/context/EventBookingContext';
import { Ticket } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function FeaturedEventSection() {
  const router = useRouter();
  const { events = [] } = useEventBooking();
  const [featuredEvent, setFeaturedEvent] = useState(events[0] || null);

  useEffect(() => {
    if (events.length > 0) {
      setFeaturedEvent(events[0]);
    }
  }, [events]);

  const handleBooking = () => {
    if (featuredEvent?.id) {
      router.push(`/events/${featuredEvent.id}`);
    }
  };

  if (!featuredEvent) return null;

  const eventDate = new Date(featuredEvent.event_date);
  const formattedDate = eventDate.toLocaleDateString('vi-VN', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <section className="animate-content">
      <div className="relative overflow-hidden rounded-xl h-[500px] group shadow-2xl">
        {/* Background Image */}
        <img
          src={featuredEvent.image_url}
          alt={featuredEvent.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#181445]/90 via-[#181445]/40 to-transparent"></div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 p-12 text-white max-w-2xl">
          {/* Badge */}
          <span className="bg-tertiary text-on-tertiary px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-4 inline-block">
            Sự kiện nổi bật
          </span>

          {/* Title */}
          <h2 className="text-4xl font-black mb-4 leading-tight">
            {featuredEvent.title}
          </h2>

          {/* Description */}
          <p className="text-lg text-slate-200 mb-8 font-light leading-relaxed line-clamp-2">
            {featuredEvent.description || 'Trải nghiệm không gian âm thanh vòm thế hệ mới kết hợp cùng trình diễn nghệ thuật thị giác đỉnh cao.'}
          </p>

          {/* CTA */}
          <div className="flex items-center gap-6 flex-wrap">
            <button 
              onClick={handleBooking}
              className="bg-white text-primary px-8 py-4 rounded-full font-bold text-lg hover:bg-primary hover:text-white transition-all active:scale-95 flex items-center gap-2"
            >
              Đặt vé ngay
              <Ticket className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined">calendar_today</span>
              <span className="font-medium">{formattedDate}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined">location_on</span>
              <span className="font-medium line-clamp-1">{featuredEvent.location}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
