'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Listing } from '@/types';

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Map themes configuration
const mapThemes = {
  light: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  },
  dark: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
  }
};

// Demo data
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
    category: { id: 1, name: 'Ijara', slug: 'rent', created_at: '2024-01-01T00:00:00Z' },
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
    category: { id: 2, name: 'Sotish', slug: 'sale', created_at: '2024-01-01T00:00:00Z' },
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
    category: { id: 1, name: 'Ijara', slug: 'rent', created_at: '2024-01-01T00:00:00Z' },
    user: { id: '3', telegram_id: 555666777, first_name: 'Dilshod', last_name: 'Raximov', phone: '+998 90 555 12 34', email: 'owner3@example.com', is_verified: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' }
  }
];

interface DemoMapProps {
  selectedCategory?: string;
  onListingClick?: (listing: Listing) => void;
  center?: [number, number];
  zoom?: number;
}

function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);
  
  return null;
}

export default function DemoMap({ 
  selectedCategory, 
  onListingClick, 
  center = [40.9977, 71.2374], // Чуст координаты
  zoom = 13
}: DemoMapProps) {
  const [filteredListings, setFilteredListings] = useState<Listing[]>(demoListings);

  useEffect(() => {
    if (selectedCategory) {
      const filtered = demoListings.filter(listing => listing.category.slug === selectedCategory);
      setFilteredListings(filtered);
    } else {
      setFilteredListings(demoListings);
    }
  }, [selectedCategory]);

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="w-full h-full">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <MapController center={center} zoom={zoom} />
        
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {filteredListings.map((listing) => (
          <Marker
            key={listing.id}
            position={[listing.latitude, listing.longitude]}
            eventHandlers={{
              click: () => onListingClick?.(listing),
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-lg mb-2">{listing.title}</h3>
                <p className="text-gray-600 mb-2">{listing.description}</p>
                <div className="space-y-1 text-sm">
                  <p><strong>Narxi:</strong> {formatPrice(listing.price || 0, listing.currency)}</p>
                  <p><strong>Turi:</strong> {listing.property_type}</p>
                  <p><strong>Maydoni:</strong> {listing.area} m²</p>
                  <p><strong>Xonalar:</strong> {listing.rooms}</p>
                  <p><strong>Manzil:</strong> {listing.address}</p>
                </div>
                <button
                  onClick={() => onListingClick?.(listing)}
                  className="mt-3 w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                  Batafsil
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      <style jsx global>{`
        .leaflet-container {
          z-index: 1;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 8px;
        }
        .leaflet-popup-content {
          margin: 0;
          min-width: 200px;
        }
      `}</style>
    </div>
  );
} 