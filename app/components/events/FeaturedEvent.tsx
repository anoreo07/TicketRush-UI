/**
 * Featured Event Component
 * Hero banner full-width với gradient overlay
 * Pixel-perfect từ reference image
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { Event } from '@/lib/api/events';
import { MockEvent } from './mockData';

interface FeaturedEventProps {
  event: (Event & Partial<MockEvent>) | MockEvent | any;
}

export default function FeaturedEvent({ event }: FeaturedEventProps) {
  const eventId = event.id || event.eventId;
  const image = (event as any).image_url || (event as any).image || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&h=400&fit=crop';
  const description = (event as any).description || 'Khám phá trải nghiệm đẳng cấp';
  const dateStr = (event as any).event_date || (event as any).start_time || (event as any).date || new Date().toISOString();

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return `${d.getDate()} Tháng ${d.getMonth() + 1}, ${d.getFullYear()}`;
    } catch {
      return dateStr;
    }
  };

  return (
    <Link href={eventId ? `/events/${eventId}` : "#"}>
      <div className="relative overflow-hidden rounded-3xl h-80 md:h-96 group shadow-lg cursor-pointer">
      {/* Background Image */}
      <img
        src={image}
        alt={event.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
      />

      {/* Gradient Overlay - Dark at bottom, transparent at top */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent"></div>

      {/* Content - positioned at bottom */}
      <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
        {/* Badge */}
        <div className="mb-4 inline-flex w-fit">
          <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase">
            Sự kiện nổi bật
          </span>
        </div>

        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight max-w-2xl">
          {event.title}
        </h2>

        {/* Description */}
        <p className="text-white/90 text-base mb-6 max-w-2xl leading-relaxed line-clamp-3">
          {description}
        </p>

        {/* CTA Section */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Button */}
          <button className="bg-white text-indigo-600 px-6 py-2.5 rounded-full font-bold text-base hover:bg-indigo-600 hover:text-white transition-all active:scale-95 w-fit">
            Đặt vé ngay
          </button>

          {/* Info Section */}
          <div className="flex items-center gap-2 text-white">
            <span className="material-symbols-outlined text-xl">calendar_today</span>
            <span className="font-semibold">{formatDate(dateStr)}</span>
          </div>
        </div>
      </div>
      </div>
    </Link>
  );
}
