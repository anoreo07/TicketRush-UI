"use client";

import { useEffect, useState } from "react";
import EventCard from "./EventCard";
import { ChevronRight } from "lucide-react";
import { eventsApi, Event } from "@/lib/api";

export default function EventSection() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await eventsApi.getAll({
          page: 1,
          limit: 4,
          status: 'published',
        });
        setEvents(response.data || []);
      } catch (err: any) {
        console.error('Failed to fetch events:', err);
        setError(err?.message || 'Không thể tải sự kiện');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (isLoading) {
    return (
      <section className="max-w-7xl mx-auto px-8">
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-2xl font-black tracking-tight text-gray-900">Sự kiện nổi bật</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-lg h-64 animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="max-w-7xl mx-auto px-8">
        <p className="text-red-500">{error}</p>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-8">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-gray-900">
            Sự kiện nổi bật
          </h2>
          <div className="h-1 w-10 bg-[#5700bf] mt-2 rounded-full"></div>
        </div>
        <a
          className="flex items-center gap-1 text-[#301ec9] font-bold text-sm hover:underline"
          href="/events"
        >
          Xem tất cả <ChevronRight className="h-4 w-4" />
        </a>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {events.map((event) => (
          <EventCard
            key={event.id}
            eventId={event.id}
            category={event.status}
            title={event.title}
            date={new Date(event.event_date).toLocaleString('vi-VN')}
            location={event.venue || event.location}
            price={event.price_range ? `Từ ${event.price_range.min.toLocaleString()}đ` : 'Chưa xác định'}
            image={event.image_url}
          />
        ))}
      </div>
    </section>
  );
}
