/**
 * Personalized Events Section
 * Grid 3 cards với "Xem thêm" link
 * Pixel-perfect từ reference image
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { Event } from '@/lib/api/events';
import { MockEvent } from './mockData';

interface PersonalizedSectionProps {
  events: (Event & Partial<MockEvent>) [] | MockEvent[] | any[];
}

export default function PersonalizedSection({
  events,
}: PersonalizedSectionProps) {
  const personalizedEvents = events.slice(0, 3);

  if (personalizedEvents.length === 0) return null;

  return (
    <section className="space-y-6">
      {/* Header with "Xem thêm" link */}
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900">Dành cho bạn</h3>
        <Link
          href="/events"
          className="text-indigo-600 font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all"
        >
          Xem thêm
          <span className="material-symbols-outlined text-lg">arrow_forward</span>
        </Link>
      </div>

      {/* Grid 3 columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {personalizedEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </section>
  );
}

function EventCard({ event }: { event: any }) {
  const eventId = event.id || event.eventId;
  console.log('🎫 PersonalizedSection EventCard - event:', event);
  console.log('🎫 PersonalizedSection EventCard - eventId:', eventId);
  const price = (event as any).price_range?.min || (event as any).price?.min || 0;
  const priceDisplay = price > 0 ? `${(price / 1000000).toFixed(0)}.000đ` : 'Miễn phí';
  const actionLabel = price === 0 ? 'Đăng ký' : 'Mua vé';
  const image = (event as any).image_url || (event as any).image || 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&h=400&fit=crop';
  const categoryLabel = (event as any).categoryLabel || (event as any).category || 'Sự kiện';

  return (
    <Link href={eventId ? `/events/${eventId}` : "#"}>
      <div className="bg-white rounded-2xl overflow-hidden hover:-translate-y-2 transition-transform duration-300 group shadow-sm hover:shadow-md cursor-pointer">
        {/* Image */}
        <div className="relative h-48 overflow-hidden bg-gray-200">
          <img
            src={image}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {/* Category Badge */}
          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-slate-700 px-3 py-1 rounded-lg text-xs font-semibold">
            {categoryLabel}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          {/* Title */}
          <h4 className="text-base font-bold text-gray-900 line-clamp-2 group-hover:text-indigo-600 transition-colors">
            {event.title}
          </h4>

          {/* Location */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="material-symbols-outlined text-base">location_on</span>
            <span className="line-clamp-1">{event.location}</span>
          </div>

          {/* Footer with price and button */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            <span className="text-indigo-600 font-bold text-base">{priceDisplay}</span>
            <button 
              type="button"
              onClick={(e) => e.preventDefault()}
              className="text-indigo-600 font-semibold text-sm px-3 py-1.5 rounded-full border border-indigo-600 hover:bg-indigo-600 hover:text-white transition-all"
            >
              {actionLabel}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
