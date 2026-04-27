/**
 * Events Page - Pixel Perfect
 * Matching reference image exactly
 */

'use client';

import React, { useState } from 'react';
import TopNavBar from '@/app/components/TopNavBar';
import CategoryFilter from '@/app/components/events/CategoryFilter';
import FeaturedEvent from '@/app/components/events/FeaturedEvent';
import PersonalizedSection from '@/app/components/events/PersonalizedSection';
import DealsSection from '@/app/components/events/DealsSection';
import ExploreAll from '@/app/components/events/ExploreAll';
import { mockEvents } from '@/app/components/events/mockData';

export default function EventsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredEvents =
    selectedCategory === 'all'
      ? mockEvents
      : mockEvents.filter((e) => e.category === selectedCategory);

  const featuredEvent = filteredEvents[0] || mockEvents[0];

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

        {/* Featured Event */}
        <FeaturedEvent event={featuredEvent} />

        {/* Personalized */}
        <PersonalizedSection events={filteredEvents} />

        {/* Deals */}
        <DealsSection events={filteredEvents} />

        {/* Explore All */}
        <ExploreAll events={filteredEvents} />
      </main>
    </div>
  );
}
