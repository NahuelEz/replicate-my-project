import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { MapPin, Loader2 } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in Leaflet with React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Coordinates {
  lat: number;
  lng: number;
}

interface LazyMapProps {
  coordinates?: Coordinates;
  location: string;
}

const LazyMap = ({ coordinates: initialCoordinates, location }: LazyMapProps) => {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(initialCoordinates || null);
  const [loading, setLoading] = useState(!initialCoordinates);
  const [error, setError] = useState(false);

  useEffect(() => {
    // If we already have coordinates, don't geocode
    if (initialCoordinates) {
      setCoordinates(initialCoordinates);
      setLoading(false);
      return;
    }

    // Geocode the address using Nominatim (OpenStreetMap)
    const geocodeAddress = async () => {
      if (!location) {
        setError(true);
        setLoading(false);
        return;
      }

      try {
        // Add "Argentina" to improve geocoding accuracy
        const searchQuery = location.includes('Argentina') 
          ? location 
          : `${location}, Argentina`;
        
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`,
          {
            headers: {
              'Accept-Language': 'es',
            },
          }
        );

        const data = await response.json();

        if (data && data.length > 0) {
          setCoordinates({
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon),
          });
          setError(false);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Error geocoding address:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    geocodeAddress();
  }, [location, initialCoordinates]);

  if (loading) {
    return (
      <div className="h-[400px] flex items-center justify-center bg-muted">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary mx-auto mb-2 animate-spin" />
          <p className="text-muted-foreground font-medium">Buscando ubicación...</p>
        </div>
      </div>
    );
  }

  if (error || !coordinates) {
    return (
      <div className="h-[400px] flex items-center justify-center bg-muted text-center p-8">
        <div>
          <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">No se pudo encontrar la ubicación en el mapa.</p>
          <p className="text-sm text-muted-foreground mt-1">{location}</p>
        </div>
      </div>
    );
  }

  return (
    <MapContainer
      center={[coordinates.lat, coordinates.lng]}
      zoom={15}
      scrollWheelZoom={false}
      className="h-[400px] w-full rounded-lg z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[coordinates.lat, coordinates.lng]}>
        <Popup>
          <div className="text-center">
            <p className="font-medium">{location}</p>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default LazyMap;
