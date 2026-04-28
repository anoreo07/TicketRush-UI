/**
 * Deals Section
 * Horizontal scroll 3 cards với discount badge
 * Pixel-perfect từ reference image
 */

'use client';

import React from 'react';
import { Event } from '@/lib/api/events';
import { MockEvent } from './mockData';

interface DealsSectionProps {
  events: (Event & Partial<MockEvent>) [] | MockEvent[] | any[];
}

export default function DealsSection({ events }: DealsSectionProps) {
  // Lọc events có discount
  const dealsEvents = events.filter((e) => e.discount && e.discount > 0).slice(0, 3);

  if (dealsEvents.length === 0) return null;

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-red-500 text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
          local_fire_department
        </span>
        <h3 className="text-2xl font-bold text-slate-900">Ưu đãi giới hạn</h3>
      </div>

      {/* Horizontal Scroll */}
      <div className="flex overflow-x-auto gap-6 hide-scrollbar pb-4 -mx-4 md:-mx-8 px-4 md:px-8 scroll-smooth">
        {dealsEvents.map((event) => (
          <DealCard key={event.id} event={event} />
        ))}
      </div>
    </section>
  );
}

function DealCard({ event }: { event: any }) {
  const originalPrice = (event as any).price?.original || (event as any).price_range?.max || (event as any).price?.max || 0;
  const currentPrice = (event as any).price_range?.max || (event as any).price?.max || 0;
  const discount = (event as any).discount || 0;
  const image = (event as any).image_url || (event as any).image || 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&h=400&fit=crop';
  const dateStr = (event as any).event_date || (event as any).start_time || (event as any).date;

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return `${d.getDate()} Tháng ${d.getMonth() + 1}`;
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="min-w-[360px] md:min-w-[380px] bg-white rounded-2xl flex overflow-hidden shadow-md hover:shadow-lg transition-shadow group">
      {/* Image Section - 1/3 */}
      <div className="w-1/3 relative overflow-hidden bg-gray-200 flex-shrink-0">
        <img
          src={image}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Discount Badge */}
        {discount && discount > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
            -{discount}%
          </div>
        )}
      </div>

      {/* Content Section - 2/3 */}
      <div className="w-2/3 p-5 flex flex-col justify-between">
        {/* Title & Info */}
        <div>
          <h4 className="font-bold text-base leading-tight mb-2 line-clamp-2 text-gray-900">
            {event.title}
          </h4>
          <p className="text-gray-600 text-sm mb-1">{formatDate(dateStr)}</p>
          <p className="text-gray-500 text-xs">{event.location}</p>
        </div>

        {/* Price Section */}
        <div className="mt-3">
          {originalPrice > currentPrice && (
            <span className="text-gray-400 line-through text-xs">
              {(originalPrice / 1000000).toFixed(0)}.000đ
            </span>
          )}
          <div className="text-red-500 font-black text-lg">
            {(currentPrice / 1000000).toFixed(0)}.000đ
          </div>
        </div>
      </div>
    </div>
  );
}
