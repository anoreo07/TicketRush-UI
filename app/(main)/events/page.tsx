/**
 * Events Page - Pixel Perfect with Real API
 * Matching reference image exactly + Real backend integration
 */

'use client';

import React, { useState, useEffect } from 'react';
import TopNavBar from '@/app/components/TopNavBar';
import CategoryFilter from '@/app/components/events/CategoryFilter';
import FeaturedEvent from '@/app/components/events/FeaturedEvent';
import PersonalizedSection from '@/app/components/events/PersonalizedSection';
import DealsSection from '@/app/components/events/DealsSection';
import ExploreAll from '@/app/components/events/ExploreAll';
import { eventsApi, Event } from '@/lib/api/events';

export default function EventsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await eventsApi.getAll({ page: 1, limit: 12 });
        console.log('📡 API Response:', response);
        console.log('📡 response.data:', response.data);
        console.log('📡 typeof response:', typeof response);
        console.log('📡 Array.isArray(response):', Array.isArray(response));
        
        // Handle both cases: if response is array directly or has .data property
        const eventsList = Array.isArray(response) ? response : (response?.data || []);
        console.log('📡 Setting events to:', eventsList);
        setEvents(eventsList);
      } catch (err) {
        console.error('Failed to fetch events:', err);
        setError('Không thể tải danh sách sự kiện');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = events.length > 0 ? events : [];
  const featuredEvent = filteredEvents[0];

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TopNavBar />
        <main className="max-w-[1200px] mx-auto px-8 py-16">
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Lỗi</h2>
            <p className="text-gray-600">{error}</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <TopNavBar />

      <main className="max-w-[1200px] mx-auto px-8 py-16 space-y-16">
        {/* Header */}
        <section className="space-y-6">
          <div>
            <h1 className="text-5xl font-black text-indigo-600 mb-2">Sự kiện</h1>
            <p className="text-gray-600 text-base">
              Khám phá những trải nghiệm đẳng cấp dành riêng cho bạn.
            </p>
          </div>

          {/* Category Filter */}
          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </section>

        {/* Loading State */}
        {loading ? (
          <div className="space-y-16">
            <div className="h-80 md:h-96 bg-gray-200 rounded-3xl animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-2xl animate-pulse" />
              ))}
            </div>
          </div>
        ) : filteredEvents.length > 0 ? (
          <>
            {/* Featured Event */}
            <FeaturedEvent event={featuredEvent} />

            {/* Personalized */}
            <PersonalizedSection events={filteredEvents} />

            {/* Deals */}
            <DealsSection events={filteredEvents} />

            {/* Explore All */}
            <ExploreAll events={filteredEvents} />
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-600">Không có sự kiện nào</p>
          </div>
        )}
      </main>
    </div>
  );
}
