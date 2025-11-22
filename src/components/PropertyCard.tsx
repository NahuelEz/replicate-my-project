import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bed, Bath, Maximize, MapPin, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface PropertyCardProps {
  property: {
    id: number;
    title: string;
    slug: string;
    price: string;
    location: string;
    bedrooms: number;
    bathrooms: number;
    area: number;
    type: string;
    operation: string;
    images: string[];
  };
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer group"
      onClick={() => navigate(`/propiedad/${property.slug}`)}
    >
      <div className="relative h-56 overflow-hidden">
        <img
          src={property.images[0]}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
          {property.operation}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="absolute top-3 right-3 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
        >
          <Heart className="w-5 h-5 text-gray-600" />
        </button>
      </div>
      
      <div className="p-5">
        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
          <MapPin className="w-4 h-4" />
          <span>{property.location}</span>
        </div>
        
        <h3 className="font-heading font-bold text-lg text-foreground mb-3 line-clamp-2 min-h-[3.5rem]">
          {property.title}
        </h3>
        
        <div className="flex gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Bed className="w-4 h-4" />
            <span>{property.bedrooms}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="w-4 h-4" />
            <span>{property.bathrooms}</span>
          </div>
          <div className="flex items-center gap-1">
            <Maximize className="w-4 h-4" />
            <span>{property.area}m²</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <p className="text-2xl font-bold text-primary">{property.price}</p>
          <Button size="sm" className="btn-primary">Ver más</Button>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;
