'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTelegramApp } from '@/hooks/useTelegramApp';
import { ArrowLeft, MapPin } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamic import of the location picker to avoid SSR issues
const LocationPicker = dynamic(() => import('@/components/LocationPicker'), {
  ssr: false,
  loading: () => (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="h-64 w-full rounded-lg bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Xarita yuklanmoqda...</p>
      </div>
    </div>
  ),
});

interface FormData {
  title: string;
  description: string;
  price: string;
  currency: 'USD' | 'UZS';
  property_type: 'Kvartira' | 'Uy' | 'Ofis' | 'Do\'kon';
  area: string;
  rooms: string;
  floor: string;
  total_floors: string;
  latitude: number;
  longitude: number;
  contact_phone: string;
  category: 'rent' | 'sale';
}

export default function AddListingPage() {
  const router = useRouter();
  const { showAlert } = useTelegramApp();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    price: '',
    currency: 'USD',
    property_type: 'Kvartira',
    area: '',
    rooms: '',
    floor: '',
    total_floors: '',
    latitude: 40.9977, // Default Chust coordinates
    longitude: 71.2374,
    contact_phone: '',
    category: 'rent'
  });

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    console.log(`Updating field ${field} with value:`, value);
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setFormData(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form data:', formData);
    
    if (!formData.title || !formData.price || !formData.contact_phone) {
      console.log('Validation failed:', { title: !!formData.title, price: !!formData.price, phone: !!formData.contact_phone });
      showAlert('Iltimos, barcha majburiy maydonlarni to\'ldiring');
      return;
    }

    setLoading(true);
    
    try {
      console.log('Sending request to API...');
      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('Response status:', response.status);
      const result = await response.json();
      console.log('Response data:', result);

      if (!response.ok) {
        throw new Error(result.error || 'Xatolik yuz berdi');
      }

      showAlert('E\'lon muvaffaqiyatli qo\'shildi!');
      router.push('/map');
    } catch (error) {
      console.error('Error saving listing:', error);
      showAlert('Xatolik yuz berdi. Iltimos, qaytadan urinib ko\'ring');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="flex items-center p-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-gray-100 mr-3"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              Yangi e&apos;lon qo&apos;shish
            </h1>
            <p className="text-sm text-gray-600">
              Ko&apos;chmas mulk e&apos;lonini qo&apos;shing
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="p-4">
        {/* Debug info */}
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="font-semibold text-yellow-800 mb-2">Debug Info:</h3>
          <div className="text-sm text-yellow-700">
            <p>Title: "{formData.title}"</p>
            <p>Price: "{formData.price}"</p>
            <p>Phone: "{formData.contact_phone}"</p>
            <p>Category: "{formData.category}"</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Selection */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Kategoriya</h2>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleInputChange('category', 'rent')}
                className={`p-3 rounded-lg border-2 text-center transition-colors ${
                  formData.category === 'rent'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-1">🏠</div>
                <div className="font-medium">Ijara</div>
              </button>
              <button
                type="button"
                onClick={() => handleInputChange('category', 'sale')}
                className={`p-3 rounded-lg border-2 text-center transition-colors ${
                  formData.category === 'sale'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-1">💰</div>
                <div className="font-medium">Sotish</div>
              </button>
            </div>
          </div>

          {/* Basic Information */}
          <div className="bg-white rounded-lg p-4 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Asosiy ma&apos;lumotlar</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sarlavha *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Masalan: Markazdagi 2 xonali kvartira"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tavsif
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ko&apos;chmas mulk haqida batafsil ma&apos;lumot..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Narxi *
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valyuta
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) => handleInputChange('currency', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="USD">USD</option>
                  <option value="UZS">UZS</option>
                </select>
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="bg-white rounded-lg p-4 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Ko&apos;chmas mulk xususiyatlari</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Turi
              </label>
              <select
                value={formData.property_type}
                onChange={(e) => handleInputChange('property_type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Kvartira">Kvartira</option>
                <option value="Uy">Uy</option>
                <option value="Ofis">Ofis</option>
                <option value="Do&apos;kon">Do&apos;kon</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maydoni (m²)
                </label>
                <input
                  type="number"
                  value={formData.area}
                  onChange={(e) => handleInputChange('area', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="65"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Xonalar soni
                </label>
                <input
                  type="number"
                  value={formData.rooms}
                  onChange={(e) => handleInputChange('rooms', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="2"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Qavat
                </label>
                <input
                  type="number"
                  value={formData.floor}
                  onChange={(e) => handleInputChange('floor', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jami qavatlar
                </label>
                <input
                  type="number"
                  value={formData.total_floors}
                  onChange={(e) => handleInputChange('total_floors', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="5"
                />
              </div>
            </div>
          </div>

          {/* Location Picker */}
          <LocationPicker
            onLocationSelect={handleLocationSelect}
            initialLat={formData.latitude}
            initialLng={formData.longitude}
          />

          {/* Contact Information */}
          <div className="bg-white rounded-lg p-4 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Aloqa ma&apos;lumotlari</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefon raqam *
              </label>
              <input
                type="tel"
                value={formData.contact_phone}
                onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+998 90 123 45 67"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Saqlanmoqda...' : 'E&apos;lonni qo&apos;shish'}
          </button>
        </form>
      </div>
    </div>
  );
} 