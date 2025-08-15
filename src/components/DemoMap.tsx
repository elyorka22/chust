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
  const [listings, setListings] = useState<Listing[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load listings from API
  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/listings');
        if (!response.ok) {
          throw new Error('Failed to fetch listings');
        }
        
        const data = await response.json();
        
        if (data.listings) {
          setListings(data.listings);
        } else {
          setListings([]);
        }
      } catch (error) {
        console.error('Error fetching listings:', error);
        setError('Failed to load listings');
        setListings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  // Filter listings based on selected category
  useEffect(() => {
    if (selectedCategory) {
      const filtered = listings.filter(listing => listing.category.slug === selectedCategory);
      setFilteredListings(filtered);
    } else {
      setFilteredListings(listings);
    }
  }, [selectedCategory, listings]);

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-gray-600">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-2">Xatolik yuz berdi</p>
          <p className="text-gray-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

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