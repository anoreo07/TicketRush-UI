/**
 * Personalized Events Section
 * Hiển thị các sự kiện được gợi ý dành cho bạn
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { EventCard } from './EventCard';
import { useEventBooking } from '@/lib/context/EventBookingContext';

export default function PersonalizedEventsSection() {
  const { events = [] } = useEventBooking();
  const personalizedEvents = events.slice(0, 3);

  if (personalizedEvents.length === 0) return null;

  return (
    <section className="space-y-6 animate-content">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-on-surface">Dành cho bạn</h3>
        <Link
          href="/events"
          className="text-tertiary font-bold flex items-center gap-1 hover:gap-2 transition-all group"
        >
          Xem thêm
          <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {personalizedEvents.map((event, index) => (
          <div
            key={event.id}
            className="animate-content"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <EventCard event={event} />
          </div>
        ))}
      </div>
    </section>
  );
}
