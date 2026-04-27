/**
 * Explore All Section
 * Grid 4 columns, 4 cards, "Tải thêm" button
 * Pixel-perfect từ reference image
 */

'use client';

import React from 'react';
import { MockEvent } from './mockData';

interface ExploreAllProps {
  events: MockEvent[];
}

export default function ExploreAll({ events }: ExploreAllProps) {
  const exploreEvents = events.slice(0, 4);

  return (
    <section className="space-y-8">
      {/* Title */}
      <h3 className="text-2xl font-bold text-gray-900">Khám phá tất cả</h3>

      {/* Grid 4 columns - responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {exploreEvents.map((event) => (
          <ExploreCard key={event.id} event={event} />
        ))}
      </div>

      {/* Load More Button */}
      <div className="flex justify-center pt-4">
        <button className="px-8 py-2.5 rounded-full border-2 border-gray-300 text-gray-700 font-semibold hover:border-indigo-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
          Tải thêm sự kiện
        </button>
      </div>
    </section>
  );
}

function ExploreCard({ event }: { event: MockEvent }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="h-40 overflow-hidden bg-gray-200">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        {/* Category Tag */}
        <p className="text-indigo-600 text-xs font-bold uppercase tracking-wider">
          {event.categoryLabel}
        </p>

        {/* Title */}
        <h5 className="font-bold text-base text-slate-900 line-clamp-2">
          {event.title}
        </h5>

        {/* Footer with Date & Price */}
        <div className="flex items-center justify-between text-xs font-medium pt-2 border-t border-gray-200">
          <span className="text-gray-600">{event.date}</span>
          <span className="text-slate-900 font-bold">
            {event.price.min > 0 ? `${(event.price.min / 1000000).toFixed(0)}k` : 'Miễn phí'}
          </span>
        </div>
      </div>
    </div>
  );
}
