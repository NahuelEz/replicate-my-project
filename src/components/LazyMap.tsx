import React from 'react';

interface Coordinates {
  lat: number;
  lng: number;
}

interface LazyMapProps {
  coordinates?: Coordinates;
  location: string;
}

const LazyMap = ({ coordinates, location }: LazyMapProps) => {
  if (!coordinates) {
    return (
      <div className="h-[400px] flex items-center justify-center bg-muted text-center p-8">
        <p className="text-muted-foreground">Ubicación no disponible.</p>
      </div>
    );
  }

  // Para implementar correctamente, necesitarías instalar react-leaflet y leaflet
  // Por ahora, mostramos un placeholder que puede ser reemplazado
  return (
    <div className="h-[400px] bg-muted flex items-center justify-center">
      <div className="text-center p-8">
        <p className="text-lg font-medium mb-2">{location}</p>
        <p className="text-sm text-muted-foreground">
          Lat: {coordinates.lat.toFixed(6)}, Lng: {coordinates.lng.toFixed(6)}
        </p>
        <p className="text-xs text-muted-foreground mt-4">
          Mapa interactivo disponible con integración de Leaflet
        </p>
      </div>
    </div>
  );
};

export default LazyMap;
