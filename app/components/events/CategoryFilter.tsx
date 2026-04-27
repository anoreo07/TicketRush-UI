/**
 * Category Filter Component
 */

'use client';

import React from 'react';

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = [
  { id: 'all', label: 'Tất cả' },
  { id: 'music', label: 'Âm nhạc' },
  { id: 'art', label: 'Nghệ thuật' },
  { id: 'sports', label: 'Thể thao' },
  { id: 'tech', label: 'Công nghệ' },
];

export default function CategoryFilter({
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap text-sm transition-all ${
            selectedCategory === category.id
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
}
