'use client';
import { useEffect } from 'react';
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

// Component for controlling map view
function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);
  
  return null;
}

interface MapProps {
  listings: Listing[];
  selectedCategory?: string;
  onListingClick?: (listing: Listing) => void;
  center?: [number, number];
  zoom?: number;
}

export default function Map({ 
  listings, 
  selectedCategory, 
  onListingClick, 
  center = [40.9977, 71.2374], // Чуст координаты
  zoom = 13 
}: MapProps) {
  const filteredListings = selectedCategory 
    ? listings.filter(listing => listing.category?.slug === selectedCategory)
    : listings;

  const formatPrice = (price?: number, currency: string = 'USD') => {
    if (!price) return 'Цена не указана';
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: currency === 'USD' ? 'USD' : 'UZS',
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
              <div className="p-2 min-w-[200px]">
                <h3 className="font-semibold text-sm mb-1">{listing.title}</h3>
                {listing.price && (
                  <p className="text-green-600 font-medium text-sm mb-1">
                    {formatPrice(listing.price, listing.currency)}
                  </p>
                )}
                {listing.property_type && (
                  <p className="text-gray-600 text-xs mb-1">
                    {listing.property_type}
                  </p>
                )}
                {listing.area && (
                  <p className="text-gray-600 text-xs mb-1">
                    Площадь: {listing.area} м²
                  </p>
                )}
                {listing.rooms && (
                  <p className="text-gray-600 text-xs mb-1">
                    Комнат: {listing.rooms}
                  </p>
                )}
                <div className="flex items-center gap-1 mt-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    listing.category?.slug === 'rent' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {listing.category?.name}
                  </span>
                </div>
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
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .leaflet-popup-content {
          margin: 0;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
} 