'use client';

import { Category } from '@/types';
import { Home, Building2 } from 'lucide-react';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory?: string;
  onCategoryChange: (categorySlug?: string) => void;
}

export default function CategoryFilter({ 
  categories, 
  selectedCategory, 
  onCategoryChange 
}: CategoryFilterProps) {
  return (
    <div className="absolute top-4 left-4 z-[1000] bg-white rounded-lg shadow-lg p-2">
      <div className="flex flex-col gap-2">
        <button
          onClick={() => onCategoryChange(undefined)}
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            !selectedCategory
              ? 'bg-blue-100 text-blue-800'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Home size={16} />
          Все объявления
        </button>
        
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.slug)}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedCategory === category.slug
                ? category.slug === 'rent'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.slug === 'rent' ? (
              <Home size={16} />
            ) : (
              <Building2 size={16} />
            )}
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
} 