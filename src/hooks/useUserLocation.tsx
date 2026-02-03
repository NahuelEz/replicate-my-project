import { useState, useEffect } from 'react';

interface UserLocation {
  latitude: number;
  longitude: number;
}

export const useUserLocation = () => {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if we have cached location
    const cached = localStorage.getItem('user_location');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        const cacheTime = parsed.timestamp || 0;
        // Cache for 1 hour
        if (Date.now() - cacheTime < 3600000) {
          setLocation({ latitude: parsed.latitude, longitude: parsed.longitude });
          setLoading(false);
          return;
        }
      } catch (e) {
        localStorage.removeItem('user_location');
      }
    }

    if (!navigator.geolocation) {
      setError('Geolocalización no soportada');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const loc = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        setLocation(loc);
        // Cache the location
        localStorage.setItem('user_location', JSON.stringify({
          ...loc,
          timestamp: Date.now()
        }));
        setLoading(false);
      },
      (err) => {
        console.error('Geolocation error:', err);
        setError('No se pudo obtener la ubicación');
        setLoading(false);
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  }, []);

  return { location, loading, error };
};

// Calculate distance between two points using Haversine formula
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};