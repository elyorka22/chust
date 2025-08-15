'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useTelegramApp } from '@/hooks/useTelegramApp';
import { Listing, Category } from '@/types';
import CategoryFilter from '@/components/CategoryFilter';
import { Loader2 } from 'lucide-react';

// Dynamic import of the map to avoid SSR issues
const DemoMap = dynamic(() => import('@/components/DemoMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin" />
    </div>
  ),
});

export default function MapPage() {
  const router = useRouter();
  const { isReady, expand, isTelegramApp } = useTelegramApp();
  const [selectedCategory, setSelectedCategory] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState<Listing[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isReady && isTelegramApp) {
      expand();
    }
  }, [isReady, isTelegramApp, expand]);

  useEffect(() => {
    // Load listings and categories from API
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch listings
        const listingsResponse = await fetch('/api/listings');
        if (!listingsResponse.ok) {
          if (listingsResponse.status === 500) {
            throw new Error('Database configuration not found. Please configure Supabase environment variables.');
          }
          throw new Error('Failed to fetch listings');
        }
        const listingsData = await listingsResponse.json();
        
        if (listingsData.listings) {
          setListings(listingsData.listings);
        }
        
        // Fetch categories (you might need to create this API endpoint)
        // For now, we'll use default categories
        setCategories([
          { id: 1, name: 'Ijara', slug: 'rent', created_at: '2024-01-01T00:00:00Z' },
          { id: 2, name: 'Sotish', slug: 'sale', created_at: '2024-01-01T00:00:00Z' }
        ]);
        
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error instanceof Error ? error.message : 'Failed to load data');
        setListings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleListingClick = (listing: Listing) => {
    router.push(`/listing/${listing.id}`);
  };

  const handleCategoryChange = (categorySlug?: string) => {
    setSelectedCategory(categorySlug);
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">E&apos;lonlar yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="text-yellow-800 font-medium mb-2">Database Configuration Required</h3>
            <p className="text-yellow-700 text-sm mb-3">
              {error.includes('Database configuration not found') 
                ? 'To view listings, please configure your Supabase database connection.'
                : error
              }
            </p>
            <div className="text-xs text-yellow-600 bg-yellow-100 p-2 rounded">
              <p className="font-medium mb-1">Setup instructions:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Create a .env file in the project root</li>
                <li>Add your Supabase URL and API key</li>
                <li>Restart the development server</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen">
      <DemoMap
        selectedCategory={selectedCategory}
        onListingClick={handleListingClick}
        center={[40.9977, 71.2374]} // Чуст координаты
        zoom={13}
      />
      
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />
      
      {/* Information Panel */}
      <div className="absolute bottom-4 left-4 right-4 z-[1000] bg-white rounded-lg shadow-lg p-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              Chust shahri ko&apos;chmas mulk
            </h2>
            <p className="text-xs text-gray-600">
              Xaritada {listings.length} ta e&apos;lon
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span className="text-xs text-gray-600">Ijara</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-xs text-gray-600">Sotish</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 