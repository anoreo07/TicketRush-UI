'use client';

import React from 'react';
import { mockPaymentEvent } from '@/lib/mock/booking-data';

export const EventInfoCard = () => {
  return (
    <section className="bg-white rounded-3xl p-8 shadow-md border border-gray-200 overflow-hidden">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Event Image */}
        <div className="w-full md:w-40 h-40 rounded-xl overflow-hidden flex-shrink-0">
          <img
            alt="Event Poster"
            className="w-full h-full object-cover"
            src={mockPaymentEvent.image}
          />
        </div>

        {/* Event Details */}
        <div className="flex-grow">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full bg-purple-600 text-white text-[10px] font-bold uppercase tracking-widest">
              {mockPaymentEvent.category}
            </span>
            <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-[10px] font-medium">
              Sắp diễn ra
            </span>
          </div>

          <h3 className="text-xl font-headline font-bold text-gray-800 mb-4">
            {mockPaymentEvent.title}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            {/* Date & Time */}
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-purple-600 mt-1 flex-shrink-0">calendar_today</span>
              <div>
                <p className="text-xs font-bold uppercase text-gray-500 mb-1">Thời gian</p>
                <p className="text-sm text-gray-800 font-medium">
                  19:00, Thứ Bảy - 25/05/2024
                </p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-purple-600 mt-1 flex-shrink-0">location_on</span>
              <div>
                <p className="text-xs font-bold uppercase text-gray-500 mb-1">Địa điểm</p>
                <p className="text-sm text-gray-800 font-medium">
                  {mockPaymentEvent.location}
                </p>
              </div>
            </div>

            {/* Seats */}
            <div className="flex items-start gap-3 sm:col-span-2">
              <span className="material-symbols-outlined text-purple-600 mt-1 flex-shrink-0">event_seat</span>
              <div>
                <p className="text-xs font-bold uppercase text-gray-500 mb-1">Vị trí ghế (2 vé)</p>
                <p className="text-sm text-gray-800 font-medium">
                  Khu vực GA - Dãy F - Ghế 12, Ghế 13
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
