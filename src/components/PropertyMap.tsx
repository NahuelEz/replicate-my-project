import React, { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

const LazyMap = lazy(() => import('./LazyMap'));

interface Coordinates {
  lat: number;
  lng: number;
}

interface PropertyMapProps {
  location: string;
  coordinates?: Coordinates;
}

const PropertyMap = ({ location, coordinates }: PropertyMapProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="bg-card rounded-lg p-6 shadow-sm border"
    >
      <h2 className="text-xl font-semibold mb-4">Ubicación</h2>
      <div className="map-container rounded-lg overflow-hidden">
        <Suspense fallback={
          <div className="h-[400px] w-full bg-muted flex items-center justify-center">
             <div className="text-center">
              <MapPin className="w-12 h-12 text-primary mx-auto mb-2 animate-pulse" />
              <p className="text-muted-foreground font-medium">Cargando mapa...</p>
            </div>
          </div>
        }>
          <LazyMap coordinates={coordinates} location={location} />
        </Suspense>
      </div>
       <p className="text-xs text-muted-foreground mt-2">
        La ubicación es aproximada para proteger la privacidad del propietario.
      </p>
    </motion.div>
  );
};

export default PropertyMap;
