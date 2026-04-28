/**
 * EventCard Component
 * Hiển thị thông tin sự kiện dạng card
 */

'use client';

import React from 'react';
import { Event } from '@/lib/api/events';
import { useEventBooking } from '@/lib/context/EventBookingContext';
import { useRouter } from 'next/navigation';

interface EventCardProps {
  event: Event;
  onClick?: (eventId: string) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onClick }) => {
  const router = useRouter();
  const { selectEvent, isLoading } = useEventBooking();

  const handleClick = async () => {
    try {
      console.log('🎫 EventCard clicked - eventId:', event.id);
      await selectEvent(event.id);
      onClick?.(event.id);
      // Navigate to event detail page
      router.push(`/events/${event.id}`);
    } catch (err) {
      console.error('Failed to select event:', err);
    }
  };

  const eventDate = new Date(event.event_date);
  const formattedDate = eventDate.toLocaleDateString('vi-VN', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const formattedTime = eventDate.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const soldOut = event.available_seats === 0;

  return (
    <div
      onClick={handleClick}
      className="group cursor-pointer rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 bg-white hover:translate-y-[-4px] disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {/* Event Image */}
      <div className="relative overflow-hidden h-48 md:h-56 bg-gray-200">
        <img
          src={event.image_url}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          {soldOut ? (
            <span className="inline-block bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              Hết vé
            </span>
          ) : (
            <span className="inline-block bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              Còn vé
            </span>
          )}
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-purple-600 transition-colors">
          {event.title}
        </h3>

        {/* Date & Time */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="material-symbols-outlined text-base">calendar_today</span>
          <span>{formattedDate}</span>
          <span className="text-gray-400">•</span>
          <span>{formattedTime}</span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="material-symbols-outlined text-base">location_on</span>
          <span className="line-clamp-1">{event.location}</span>
        </div>

        {/* Price Range */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <div>
            <p className="text-xs text-gray-500 font-medium">Giá vé</p>
            <p className="text-lg font-bold text-purple-600">
              {event.price_range ? `${event.price_range.min.toLocaleString('vi-VN')} - ${event.price_range.max.toLocaleString('vi-VN')} ₫` : 'Chưa xác định'}
            </p>
          </div>

          {/* Available Seats */}
          <div className="text-right">
            <p className="text-xs text-gray-500 font-medium">Ghế trống</p>
            <p className="text-lg font-bold text-gray-900">{event.available_seats}</p>
          </div>
        </div>

        {/* Button */}
        <button
          onClick={handleClick}
          disabled={isLoading || soldOut}
          className="w-full mt-4 py-2 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
        >
          {soldOut ? 'Hết vé' : isLoading ? 'Đang tải...' : 'Đặt vé'}
        </button>
      </div>
    </div>
  );
};
