import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Bed, Bath, Square, Car, Calendar, Eye } from 'lucide-react';

interface Property {
  title: string;
  fullAddress: string;
  views: number;
  publishDate: string;
  code: string;
  price: string;
  pricePerM2?: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  parking?: number;
}

interface PropertyHeaderProps {
  property: Property;
}

const PropertyHeader = ({ property }: PropertyHeaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {property.title}
          </h1>
          <div className="flex items-center text-muted-foreground mb-2">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{property.fullAddress}</span>
          </div>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Eye className="w-4 h-4 mr-1" />
              <span>{property.views} visualizaciones</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              <span>Publicado el {new Date(property.publishDate).toLocaleDateString('es-AR')}</span>
            </div>
            <span>Código: {property.code}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-primary mb-1">
            {property.price}
          </div>
          {property.pricePerM2 && (
            <div className="text-sm text-muted-foreground">
              {property.pricePerM2}
            </div>
          )}
        </div>
      </div>

      {/* Property Features */}
      <div className="flex flex-wrap gap-6 p-4 bg-card rounded-lg shadow-sm border">
        <div className="flex items-center">
          <Bed className="w-5 h-5 text-muted-foreground mr-2" />
          <span className="font-medium">{property.bedrooms}</span>
          <span className="text-muted-foreground ml-1">dormitorios</span>
        </div>
        <div className="flex items-center">
          <Bath className="w-5 h-5 text-muted-foreground mr-2" />
          <span className="font-medium">{property.bathrooms}</span>
          <span className="text-muted-foreground ml-1">baños</span>
        </div>
        <div className="flex items-center">
          <Square className="w-5 h-5 text-muted-foreground mr-2" />
          <span className="font-medium">{property.area}m²</span>
          <span className="text-muted-foreground ml-1">totales</span>
        </div>
        {property.parking && property.parking > 0 && (
          <div className="flex items-center">
            <Car className="w-5 h-5 text-muted-foreground mr-2" />
            <span className="font-medium">{property.parking}</span>
            <span className="text-muted-foreground ml-1">cochera</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PropertyHeader;
