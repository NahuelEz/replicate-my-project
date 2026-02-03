import { useState, useEffect } from 'react';
import { Megaphone } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useUserLocation, calculateDistance } from '@/hooks/useUserLocation';

interface AdPlaceholderProps {
  className?: string;
  location?: 'home' | 'sidebar' | 'property-detail' | 'footer';
}

interface Advertisement {
  id: string;
  title: string;
  image_url: string | null;
  link_url: string | null;
  latitude: number | null;
  longitude: number | null;
  radius_km: number | null;
}

const AdPlaceholder = ({ className = '', location = 'sidebar' }: AdPlaceholderProps) => {
  const [ad, setAd] = useState<Advertisement | null>(null);
  const [loading, setLoading] = useState(true);
  const { location: userLocation } = useUserLocation();

  useEffect(() => {
    fetchAd();
  }, [location, userLocation]);

  const fetchAd = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('advertisements')
        .select('id, title, image_url, link_url, latitude, longitude, radius_km')
        .eq('is_active', true)
        .eq('location', location)
        .or(`start_date.is.null,start_date.lte.${today}`)
        .or(`end_date.is.null,end_date.gte.${today}`);

      if (error) throw error;

      if (data && data.length > 0) {
        // Filter by geolocation if user location is available
        let eligibleAds = data as Advertisement[];
        
        if (userLocation) {
          eligibleAds = data.filter(ad => {
            // If ad has no geolocation, show to everyone
            if (!ad.latitude || !ad.longitude) return true;
            
            // Calculate distance
            const distance = calculateDistance(
              userLocation.latitude,
              userLocation.longitude,
              ad.latitude,
              ad.longitude
            );
            
            return distance <= (ad.radius_km || 50);
          });
        }

        // Pick a random ad from eligible ones
        if (eligibleAds.length > 0) {
          const randomAd = eligibleAds[Math.floor(Math.random() * eligibleAds.length)];
          setAd(randomAd);
          
          // Track impression
          trackImpression(randomAd.id);
        }
      }
    } catch (error) {
      console.error('Error fetching ad:', error);
    } finally {
      setLoading(false);
    }
  };

  const trackImpression = async (adId: string) => {
    try {
      // Get current impressions and increment
      const { data } = await supabase
        .from('advertisements')
        .select('impressions')
        .eq('id', adId)
        .single();
      
      if (data) {
        await supabase
          .from('advertisements')
          .update({ impressions: (data.impressions || 0) + 1 })
          .eq('id', adId);
      }
    } catch (error) {
      // Silently fail
    }
  };

  const handleClick = async () => {
    if (!ad) return;
    
    try {
      const { data } = await supabase
        .from('advertisements')
        .select('clicks')
        .eq('id', ad.id)
        .single();
      
      if (data) {
        await supabase
          .from('advertisements')
          .update({ clicks: (data.clicks || 0) + 1 })
          .eq('id', ad.id);
      }
    } catch (error) {
      // Silently fail
    }

    if (ad.link_url) {
      window.open(ad.link_url, '_blank', 'noopener,noreferrer');
    }
  };

  if (loading) {
    return (
      <div className={`animate-pulse bg-muted rounded-lg h-40 ${className}`} />
    );
  }

  // Show actual ad if available
  if (ad && ad.image_url) {
    return (
      <div
        className={`relative rounded-lg overflow-hidden cursor-pointer group ${className}`}
        onClick={handleClick}
      >
        <img
          src={ad.image_url}
          alt={ad.title}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
          <p className="text-white text-sm font-medium">{ad.title}</p>
          <span className="text-white/70 text-xs">Anuncio</span>
        </div>
      </div>
    );
  }

  // Fallback placeholder
  return (
    <div
      className={`flex flex-col items-center justify-center bg-muted border-2 border-dashed border-border rounded-lg p-8 text-center text-muted-foreground ${className}`}
    >
      <Megaphone className="w-12 h-12 mb-4" />
      <h3 className="text-lg font-bold">Lugar publicitario disponible</h3>
      <p className="text-sm mt-1">Contactate para anunciar aquí.</p>
    </div>
  );
};

export default AdPlaceholder;