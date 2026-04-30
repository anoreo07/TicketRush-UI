/**
 * Events Page - Pixel Perfect with Real API
 * Matching reference image exactly + Real backend integration
 */

'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import TopNavBar from '@/app/components/TopNavBar';
import CategoryFilter from '@/app/components/events/CategoryFilter';
import FeaturedEvent from '@/app/components/events/FeaturedEvent';
import PersonalizedSection from '@/app/components/events/PersonalizedSection';
import DealsSection from '@/app/components/events/DealsSection';
import ExploreAll, { ExploreCard } from '@/app/components/events/ExploreAll';
import { eventsApi, Event } from '@/lib/api/events';

function EventsPageContent() {
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get('category') || 'all';
  const urlSearch = searchParams.get('search') || '';

  const [selectedCategory, setSelectedCategory] = useState(urlCategory);
  const [searchQuery, setSearchQuery] = useState(urlSearch);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sync with URL params if they change
  useEffect(() => {
    setSelectedCategory(urlCategory);
    setSearchQuery(urlSearch);
  }, [urlCategory, urlSearch]);

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await eventsApi.getAll({ 
          page: 1, 
          limit: 12,
          category: selectedCategory === 'all' ? undefined : selectedCategory,
          search: searchQuery || undefined
        });
        
        // Handle both cases: if response is array directly or has .data property
        const eventsList = Array.isArray(response) ? response : (response?.data || []);
        setEvents(eventsList);
      } catch (err) {
        console.error('Failed to fetch events:', err);
        setError('Không thể tải danh sách sự kiện');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [selectedCategory, searchQuery]);

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
              {searchQuery ? `Kết quả tìm kiếm cho "${searchQuery}"` : 'Khám phá những trải nghiệm đẳng cấp dành riêng cho bạn.'}
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
            {/* Featured Event - Hide if searching */}
            {!searchQuery && featuredEvent && <FeaturedEvent event={featuredEvent} />}

            {/* Main Content Grid */}
            <div className="space-y-16">
               {searchQuery ? (
                 <section className="space-y-8">
                    <h3 className="text-2xl font-bold text-gray-900">Tìm thấy {filteredEvents.length} sự kiện</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {filteredEvents.map((event) => (
                        <ExploreCard key={event.id} event={event} />
                      ))}
                    </div>
                 </section>
               ) : (
                 <>
                   <PersonalizedSection events={filteredEvents} />
                   <DealsSection events={filteredEvents} />
                   <ExploreAll events={filteredEvents} />
                 </>
               )}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-600 text-xl font-medium">Không tìm thấy sự kiện nào khớp với yêu cầu của bạn.</p>
            <button 
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                window.history.pushState({}, '', '/events');
              }}
              className="mt-4 text-indigo-600 font-bold hover:underline"
            >
              Xem tất cả sự kiện
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default function EventsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 animate-pulse" />}>
      <EventsPageContent />
    </Suspense>
  );
}
