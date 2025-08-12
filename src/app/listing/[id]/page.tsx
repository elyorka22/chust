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

// Demo data
const demoListings: Listing[] = [
  {
    id: 1,
    user_id: '1',
    category_id: 1,
    title: 'Уютная 2-комнатная квартира в центре',
    description: 'Современная квартира с ремонтом, мебелью и техникой. Идеально подходит для семьи или молодой пары. Квартира находится в тихом районе, но в шаговой доступности от центра города. Рядом есть магазины, школы, детские сады и остановки общественного транспорта.',
    price: 500,
    currency: 'USD',
    property_type: 'Квартира',
    area: 65,
    rooms: 2,
    floor: 3,
    total_floors: 5,
    address: 'ул. Навои, 15, Чуст, Наманганская область',
    latitude: 40.9977,
    longitude: 71.2374,
    contact_phone: '+998 90 123 45 67',
    contact_email: 'owner1@example.com',
    is_active: true,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    category: { id: 1, name: 'Аренда', slug: 'rent', created_at: '2024-01-01T00:00:00Z' },
    user: { id: '1', telegram_id: 123456789, first_name: 'Алишер', last_name: 'Каримов', phone: '+998 90 123 45 67', email: 'owner1@example.com', is_verified: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' }
  },
  {
    id: 2,
    user_id: '2',
    category_id: 2,
    title: 'Дом с участком в тихом районе',
    description: 'Просторный дом с большим участком, гаражом и садом. Отличный вариант для большой семьи. Дом построен из качественных материалов, имеет все необходимые коммуникации. На участке есть фруктовые деревья и место для огорода.',
    price: 85000,
    currency: 'USD',
    property_type: 'Дом',
    area: 120,
    rooms: 4,
    floor: 1,
    total_floors: 1,
    address: 'ул. Мирзо Улугбека, 45, Чуст, Наманганская область',
    latitude: 40.9985,
    longitude: 71.2360,
    contact_phone: '+998 90 987 65 43',
    contact_email: 'owner2@example.com',
    is_active: true,
    created_at: '2024-01-14T14:30:00Z',
    updated_at: '2024-01-14T14:30:00Z',
    category: { id: 2, name: 'Продажа', slug: 'sale', created_at: '2024-01-01T00:00:00Z' },
    user: { id: '2', telegram_id: 987654321, first_name: 'Мадина', last_name: 'Ахмедова', phone: '+998 90 987 65 43', email: 'owner2@example.com', is_verified: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' }
  },
  {
    id: 3,
    user_id: '3',
    category_id: 1,
    title: '1-комнатная квартира для студентов',
    description: 'Компактная квартира рядом с университетом. Идеально подходит для студентов или молодых специалистов. Квартира меблирована, есть вся необходимая техника. Рядом университет, библиотека, кафе и магазины.',
    price: 300,
    currency: 'USD',
    property_type: 'Квартира',
    area: 35,
    rooms: 1,
    floor: 2,
    total_floors: 4,
    address: 'ул. Алишера Навои, 78, Чуст, Наманганская область',
    latitude: 40.9965,
    longitude: 71.2385,
    contact_phone: '+998 90 555 12 34',
    contact_email: 'owner3@example.com',
    is_active: true,
    created_at: '2024-01-13T09:15:00Z',
    updated_at: '2024-01-13T09:15:00Z',
    category: { id: 1, name: 'Аренда', slug: 'rent', created_at: '2024-01-01T00:00:00Z' },
    user: { id: '3', telegram_id: 555666777, first_name: 'Дилшод', last_name: 'Рахимов', phone: '+998 90 555 12 34', email: 'owner3@example.com', is_verified: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' }
  }
];

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isReady, expand, isTelegramApp } = useTelegramApp();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);

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
        
        // Try to fetch from API first
        const response = await fetch(`/api/listings/${params.id}`);
        const data = await response.json();
        
        if (response.ok && data.listing) {
          setListing(data.listing);
        } else {
          // Fallback to demo data if API fails
          const foundListing = demoListings.find(l => l.id.toString() === params.id);
          if (foundListing) {
            setListing(foundListing);
          } else {
            setListing(null);
          }
        }
      } catch (error) {
        console.error('Error fetching listing:', error);
        // Fallback to demo data
        const foundListing = demoListings.find(l => l.id.toString() === params.id);
        if (foundListing) {
          setListing(foundListing);
        } else {
          setListing(null);
        }
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchListing();
    }
  }, [params.id]);

  const formatPrice = (price?: number, currency: string = 'USD') => {
    if (!price) return 'Narx ko\'rsatilmagan';
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: currency === 'USD' ? 'USD' : 'UZS',
    }).format(price);
  };

  const handleCall = () => {
    if (listing?.contact_phone) {
      window.open(`tel:${listing.contact_phone}`, '_blank');
    }
  };

  const handleEmail = () => {
    if (listing?.contact_email) {
      window.open(`mailto:${listing.contact_email}`, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">E&apos;lon yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">E&apos;lon topilmadi</p>
        </div>
      </div>
    );
  }

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
              {listing.title}
            </h1>
            <p className="text-sm text-gray-600">
              {listing.category?.name}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 space-y-6">
        {/* Demo Image */}
        <div className="bg-white rounded-lg overflow-hidden shadow-sm">
          <div className="w-full h-64 bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
            <div className="text-center">
              <Home size={48} className="text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">Obyekt rasmi</p>
            </div>
          </div>
        </div>

        {/* Price */}
        {listing.price && (
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="text-green-600" size={20} />
              <span className="text-2xl font-bold text-green-600">
                {formatPrice(listing.price, listing.currency)}
              </span>
            </div>
            <span className="text-sm text-gray-600">
              {listing.category?.slug === 'rent' ? 'oyiga' : 'obyekt uchun'}
            </span>
          </div>
        )}

        {/* Details */}
        <div className="bg-white rounded-lg p-4 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Xususiyatlar</h2>
          
          <div className="grid grid-cols-2 gap-4">
            {listing.property_type && (
              <div className="flex items-center gap-2">
                <Home size={16} className="text-gray-500" />
                <span className="text-sm text-gray-700">{listing.property_type}</span>
              </div>
            )}
            
            {listing.area && (
              <div className="flex items-center gap-2">
                <Ruler size={16} className="text-gray-500" />
                <span className="text-sm text-gray-700">{listing.area} m²</span>
              </div>
            )}
            
            {listing.rooms && (
              <div className="flex items-center gap-2">
                <Users size={16} className="text-gray-500" />
                <span className="text-sm text-gray-700">{listing.rooms} xona</span>
              </div>
            )}
            
            {listing.floor && (
              <div className="flex items-center gap-2">
                <Building2 size={16} className="text-gray-500" />
                <span className="text-sm text-gray-700">
                  {listing.floor}{listing.total_floors ? `/${listing.total_floors}` : ''} qavat
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        {listing.description && (
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Tavsif</h2>
            <p className="text-gray-700 leading-relaxed">{listing.description}</p>
          </div>
        )}

        {/* Address */}
        {listing.address && (
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-start gap-2">
              <MapPin size={16} className="text-gray-500 mt-0.5" />
              <span className="text-sm text-gray-700">{listing.address}</span>
            </div>
          </div>
        )}

        {/* Contact Information */}
        <div className="bg-white rounded-lg p-4 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Aloqa</h2>
          
          {listing.user && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Sotuvchi:</span>
                <span className="text-sm font-medium text-gray-900">
                  {listing.user.first_name} {listing.user.last_name}
                </span>
              </div>
              
              {listing.contact_phone && (
                <button
                  onClick={handleCall}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Phone size={16} />
                  Qo&apos;ng&apos;iroq qilish: {listing.contact_phone}
                </button>
              )}
              
              {listing.contact_email && (
                <button
                  onClick={handleEmail}
                  className="w-full flex items-center justify-center gap-2 bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Mail size={16} />
                  Xabar yozish
                </button>
              )}
            </div>
          )}
        </div>

        {/* Date */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar size={16} />
            <span>E&apos;lon berildi: {new Date(listing.created_at).toLocaleDateString('ru-RU')}</span>
          </div>
        </div>
      </div>
    </div>
  );
} 