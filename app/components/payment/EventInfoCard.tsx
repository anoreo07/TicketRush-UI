'use client';

import React from 'react';
import { Event } from '@/lib/api/events';
import { BookingResponse } from '@/lib/api/booking';
import { formatCurrency } from '@/lib/mock/booking-data';

interface EventInfoCardProps {
  event: Event | null;
  booking?: BookingResponse | null;
  seatNames?: string;
}

export const EventInfoCard = ({ event, booking, seatNames }: EventInfoCardProps) => {
  if (!event) return null;

  return (
    <section className="bg-white rounded-3xl p-8 shadow-md border border-gray-200 overflow-hidden animate-fade-in">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Event Image */}
        <div className="w-full md:w-40 h-40 rounded-xl overflow-hidden flex-shrink-0">
          <img
            alt={event.title}
            className="w-full h-full object-cover"
            src={event.image_url || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80"}
          />
        </div>

        {/* Event Details */}
        <div className="flex-grow">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-widest">
              Sắp diễn ra
            </span>
          </div>

          <h3 className="text-xl font-headline font-black text-gray-900 mb-4">
            {event.title}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            {/* Date & Time */}
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-indigo-600 mt-1 flex-shrink-0">calendar_today</span>
              <div>
                <p className="text-xs font-bold uppercase text-gray-500 mb-1">Thời gian</p>
                <p className="text-sm text-gray-800 font-bold">
                  {new Date(event.start_time).toLocaleString('vi-VN')}
                </p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-indigo-600 mt-1 flex-shrink-0">location_on</span>
              <div>
                <p className="text-xs font-bold uppercase text-gray-500 mb-1">Địa điểm</p>
                <p className="text-sm text-gray-800 font-bold">
                  {event.location}
                </p>
              </div>
            </div>

            {/* Seats */}
            {(booking || seatNames) && (
              <div className="flex items-start gap-3 sm:col-span-2">
                <span className="material-symbols-outlined text-indigo-600 mt-1 flex-shrink-0">event_seat</span>
                <div>
                  <p className="text-xs font-bold uppercase text-gray-500 mb-1">
                    Vị trí ghế ({booking?.seats?.length || 1} vé)
                  </p>
                  <p className="text-sm text-gray-800 font-bold">
                    {seatNames || "Đang xử lý..."}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
