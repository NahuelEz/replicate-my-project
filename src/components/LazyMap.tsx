import React, { useEffect, useState } from 'react';
import { MapPin, Loader2 } from 'lucide-react';

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
      <div className="h-[400px] flex items-center justify-center bg-muted rounded-lg">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary mx-auto mb-2 animate-spin" />
          <p className="text-muted-foreground font-medium">Buscando ubicación...</p>
        </div>
      </div>
    );
  }

  if (error || !coordinates) {
    return (
      <div className="h-[400px] flex items-center justify-center bg-muted text-center p-8 rounded-lg">
        <div>
          <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">No se pudo encontrar la ubicación en el mapa.</p>
          <p className="text-sm text-muted-foreground mt-1">{location}</p>
        </div>
      </div>
    );
  }

  // Use OpenStreetMap embed iframe for reliable map display
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${coordinates.lng - 0.01},${coordinates.lat - 0.01},${coordinates.lng + 0.01},${coordinates.lat + 0.01}&layer=mapnik&marker=${coordinates.lat},${coordinates.lng}`;

  return (
    <div className="relative h-[400px] w-full rounded-lg overflow-hidden">
      <iframe
        title={`Mapa de ${location}`}
        src={mapUrl}
        className="w-full h-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <a 
        href={`https://www.openstreetmap.org/?mlat=${coordinates.lat}&mlon=${coordinates.lng}#map=16/${coordinates.lat}/${coordinates.lng}`}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-2 right-2 bg-white/90 text-xs px-2 py-1 rounded shadow hover:bg-white transition-colors"
      >
        Ver mapa más grande
      </a>
    </div>
  );
};

export default LazyMap;
