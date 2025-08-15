'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTelegramApp } from '@/hooks/useTelegramApp';
import { Listing } from '@/types';
import { 
  ArrowLeft, 
  Phone, 
  Mail, 
  MapPin, 
  Home, 
  Building2, 
  Ruler, 
  Users,
  Calendar,
  DollarSign
} from 'lucide-react';

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isReady, expand, isTelegramApp } = useTelegramApp();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isReady && isTelegramApp) {
      expand();
    }
  }, [isReady, isTelegramApp, expand]);

  useEffect(() => {
    const fetchListing = async () => {
      if (!params.id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/listings/${params.id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Объявление не найдено');
          }
          throw new Error('Ошибка загрузки объявления');
        }
        
        const data = await response.json();
        
        if (data.data) {
          setListing(data.data);
        } else {
          setListing(null);
        }
      } catch (error) {
        console.error('Error fetching listing:', error);
        setError(error instanceof Error ? error.message : 'Ошибка загрузки');
        setListing(null);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchListing();
    }
  }, [params.id]);

  const formatPrice = (price?: number, currency: string = 'USD') => {
    if (!price) return 'Цена не указана';
    
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-2">Xatolik yuz berdi</p>
          <p className="text-gray-600 text-sm mb-4">{error || 'Объявление не найдено'}</p>
          <button
            onClick={() => router.back()}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Orqaga qaytish
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900 line-clamp-1">
                {listing.title}
              </h1>
              <p className="text-sm text-gray-600">
                {listing.category?.name} • {listing.property_type}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Placeholder */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="aspect-video bg-gray-200 flex items-center justify-center">
                <div className="text-center">
                  <Home className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Rasm mavjud emas</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Tavsif
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {listing.description || 'Tavsif mavjud emas'}
              </p>
            </div>

            {/* Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Xususiyatlar
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {listing.area && (
                  <div className="flex items-center gap-2">
                    <Ruler className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Maydoni: {listing.area} m²
                    </span>
                  </div>
                )}
                {listing.rooms && (
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Xonalar: {listing.rooms}
                    </span>
                  </div>
                )}
                {listing.floor && (
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Qavat: {listing.floor}
                      {listing.total_floors && `/${listing.total_floors}`}
                    </span>
                  </div>
                )}
                {listing.address && (
                  <div className="flex items-center gap-2 col-span-2 md:col-span-3">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Manzil: {listing.address}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-600">Narxi</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-2">
                {formatPrice(listing.price, listing.currency)}
              </div>
              <p className="text-sm text-gray-600">
                {listing.category?.name === 'rent' ? 'oyiga' : 'umumiy'}
              </p>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Bog&apos;lanish
              </h3>
              <div className="space-y-3">
                {listing.contact_phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <a
                      href={`tel:${listing.contact_phone}`}
                      className="text-blue-600 hover:text-blue-700 text-sm"
                    >
                      {listing.contact_phone}
                    </a>
                  </div>
                )}
                {listing.contact_email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <a
                      href={`mailto:${listing.contact_email}`}
                      className="text-blue-600 hover:text-blue-700 text-sm"
                    >
                      {listing.contact_email}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Owner Info */}
            {listing.user && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Egasi
                </h3>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    {listing.user.first_name} {listing.user.last_name}
                  </p>
                  {listing.user.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3 h-3 text-gray-400" />
                      <a
                        href={`tel:${listing.user.phone}`}
                        className="text-blue-600 hover:text-blue-700 text-sm"
                      >
                        {listing.user.phone}
                      </a>
                    </div>
                  )}
                  {listing.user.is_verified && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-green-600">Tasdiqlangan</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Listing Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                E&apos;lon ma&apos;lumotlari
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>Qo&apos;shilgan: {formatDate(listing.created_at)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Home className="w-4 h-4 text-gray-400" />
                  <span>Turi: {listing.property_type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  <span>Kategoriya: {listing.category?.name}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 