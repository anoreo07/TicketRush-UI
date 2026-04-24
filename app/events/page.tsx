/**
 * Events List Page
 * Hiển thị danh sách sự kiện có sẵn
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useEventBooking } from '@/lib/context/EventBookingContext';
import { EventCard } from '@/app/components/events/EventCard';
import TopNavBar from '@/app/components/TopNavBar';

export default function EventsListPage() {
  const { events = [], fetchEvents, searchEvents, pagination, isLoading, error } = useEventBooking();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  /**
   * Load events on mount
   */
  useEffect(() => {
    const loadEvents = async () => {
      try {
        await fetchEvents(currentPage);
      } catch (err) {
        console.error('Failed to load events:', err);
      }
    };

    loadEvents();
  }, [currentPage, fetchEvents]);

  /**
   * Handle search
   */
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      await fetchEvents(1);
      return;
    }

    try {
      await searchEvents(searchQuery);
      setCurrentPage(1);
    } catch (err) {
      console.error('Search failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <TopNavBar />

      {/* Hero Section */}
      <section className="relative pt-20 pb-12 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            🎫 Khám Phá Sự Kiện
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl">
            Tìm và đặt vé cho những sự kiện yêu thích của bạn. Âm nhạc, thể thao, nghệ thuật...
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative mb-8">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm sự kiện, nghệ sĩ, địa điểm..."
                  className="w-full px-6 py-3 rounded-full border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-colors text-gray-900 placeholder-gray-500"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400">
                  search
                </span>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-3 bg-purple-600 text-white font-bold rounded-full hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
              >
                Tìm kiếm
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Error Message */}
      {error && (
        <div className="max-w-6xl mx-auto px-4 md:px-6 mb-8">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm font-medium text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Events Grid */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 pb-20">
        {isLoading && events.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-96 animate-pulse shadow-lg" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy sự kiện</h2>
            <p className="text-gray-600 mb-6">Vui lòng thử tìm kiếm với từ khóa khác</p>
            <button
              onClick={() => {
                setSearchQuery('');
                fetchEvents(1);
              }}
              className="px-6 py-2 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-colors"
            >
              Xem tất cả sự kiện
            </button>
          </div>
        ) : (
          <>
            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {events.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center items-center gap-2 mb-8">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1 || isLoading}
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  ← Trang trước
                </button>

                <div className="flex gap-1">
                  {[...Array(pagination.pages)].map((_, i) => {
                    const page = i + 1;
                    if (
                      page === 1 ||
                      page === pagination.pages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          disabled={isLoading}
                          className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                            page === currentPage
                              ? 'bg-purple-600 text-white'
                              : 'border border-gray-300 hover:bg-gray-100'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    }
                    if (page === currentPage - 2 || page === currentPage + 2) {
                      return (
                        <span key={page} className="px-2 py-2 text-gray-600">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(pagination.pages, prev + 1))}
                  disabled={currentPage === pagination.pages || isLoading}
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Trang sau →
                </button>
              </div>
            )}

            {/* Stats */}
            <div className="text-center text-sm text-gray-600">
              Hiển thị {(currentPage - 1) * pagination.limit + 1} -{' '}
              {Math.min(currentPage * pagination.limit, pagination.total)} trong{' '}
              {pagination.total} sự kiện
            </div>
          </>
        )}
      </section>
    </div>
  );
}
