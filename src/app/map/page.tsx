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

// Demo data
const demoCategories: Category[] = [
  { id: 1, name: 'Ijara', slug: 'rent', created_at: '2024-01-01T00:00:00Z' },
  { id: 2, name: 'Sotish', slug: 'sale', created_at: '2024-01-01T00:00:00Z' }
];

const demoListings: Listing[] = [
  {
    id: 1,
    user_id: '1',
    category_id: 1,
    title: 'Markazdagi 2 xonali kvartira',
    description: 'Zamonaviy jihozlangan va mebellangan kvartira',
    price: 500,
    currency: 'USD',
    property_type: 'Kvartira',
    area: 65,
    rooms: 2,
    floor: 3,
    total_floors: 5,
    address: 'Navoiy ko\'chasi, 15',
    latitude: 40.9977,
    longitude: 71.2374,
    contact_phone: '+998 90 123 45 67',
    contact_email: 'owner1@example.com',
    is_active: true,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    category: demoCategories[0],
    user: { id: '1', telegram_id: 123456789, first_name: 'Alisher', last_name: 'Karimov', phone: '+998 90 123 45 67', email: 'owner1@example.com', is_verified: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' }
  },
  {
    id: 2,
    user_id: '2',
    category_id: 2,
    title: 'Hovli va bog\'li uy',
    description: 'Katta hovli va garajli uy, bog\' bilan',
    price: 85000,
    currency: 'USD',
    property_type: 'Uy',
    area: 120,
    rooms: 4,
    floor: 1,
    total_floors: 1,
    address: 'Mirzo Ulug\'bek ko\'chasi, 45',
    latitude: 40.9985,
    longitude: 71.2360,
    contact_phone: '+998 90 987 65 43',
    contact_email: 'owner2@example.com',
    is_active: true,
    created_at: '2024-01-14T14:30:00Z',
    updated_at: '2024-01-14T14:30:00Z',
    category: demoCategories[1],
    user: { id: '2', telegram_id: 987654321, first_name: 'Madina', last_name: 'Axmedova', phone: '+998 90 987 65 43', email: 'owner2@example.com', is_verified: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' }
  },
  {
    id: 3,
    user_id: '3',
    category_id: 1,
    title: 'Talabalar uchun 1 xonali kvartira',
    description: 'Universitet yonida joylashgan ixcham kvartira',
    price: 300,
    currency: 'USD',
    property_type: 'Kvartira',
    area: 35,
    rooms: 1,
    floor: 2,
    total_floors: 4,
    address: 'Alisher Navoiy ko\'chasi, 78',
    latitude: 40.9965,
    longitude: 71.2385,
    contact_phone: '+998 90 555 12 34',
    contact_email: 'owner3@example.com',
    is_active: true,
    created_at: '2024-01-13T09:15:00Z',
    updated_at: '2024-01-13T09:15:00Z',
    category: demoCategories[0],
    user: { id: '3', telegram_id: 555666777, first_name: 'Dilshod', last_name: 'Raximov', phone: '+998 90 555 12 34', email: 'owner3@example.com', is_verified: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' }
  }
];

export default function MapPage() {
  const router = useRouter();
  const { isReady, expand, isTelegramApp } = useTelegramApp();
  const [selectedCategory, setSelectedCategory] = useState<string>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isReady && isTelegramApp) {
      expand();
    }
  }, [isReady, isTelegramApp, expand]);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
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

  return (
    <div className="relative w-full h-screen">
      <DemoMap
        selectedCategory={selectedCategory}
        onListingClick={handleListingClick}
        center={[40.9977, 71.2374]} // Чуст координаты
        zoom={13}
      />
      
      <CategoryFilter
        categories={demoCategories}
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
              Xaritada {demoListings.length} ta e&apos;lon
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