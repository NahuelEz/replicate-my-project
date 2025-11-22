import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, MapPin, Bed, Bath, ArrowRightLeft } from 'lucide-react';
import { useData } from '@/contexts/DataContext';

interface PropertyCardProps {
  property: {
    id: number;
    title: string;
    price: string;
    location: string;
    bedrooms: number;
    bathrooms: number;
    area: number;
    operation: string;
    rentalType?: string;
    image?: string;
    images?: string[];
  };
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const { favorites, toggleFavorite } = useData();
  const isFavorite = favorites.some((fav: any) => fav.id === property.id);


  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(property as any);
  };

  let operationLabel = property.operation.toUpperCase();
  if (property.operation === 'Alquiler' && property.rentalType === 'temporal') {
    operationLabel = 'ALQ. TEMPORAL';
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
      className="bg-card rounded-lg overflow-hidden border transition-shadow duration-300 flex flex-col h-full"
    >
      <Link to={`/propiedad/${property.id}`} className="block flex flex-col h-full">
        <div className="relative aspect-w-16 aspect-h-9">
          <img  
            className="w-full h-48 object-cover" 
            alt={property.title} 
            src={property.image || property.images?.[0] || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800"}
          />
          <div className={`absolute top-2 left-2 text-white px-2 py-1 rounded text-xs font-bold ${
            operationLabel === 'VENTA' ? 'bg-brand-celeste' : 
            operationLabel === 'ALQUILER' ? 'bg-green-600' : 
            'bg-purple-600'
          }`}>
            {operationLabel}
          </div>
          <button
            onClick={handleFavoriteClick}
            className={`absolute top-2 right-2 p-2 rounded-full transition-all duration-200 ${
              isFavorite 
                ? 'bg-red-500 text-white' 
                : 'bg-white/80 text-foreground hover:bg-white hover:text-red-500'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        <div className="p-3 flex flex-col flex-grow">
          <div className="flex-grow">
            <p className="text-xl font-bold font-heading text-brand-celeste mb-1">{property.price}</p>
            <h3 className="text-base font-bold font-heading text-foreground mb-1 h-12 line-clamp-2">
              {property.title}
            </h3>
            <div className="flex items-center text-muted-foreground mb-2">
              <MapPin className="w-3 h-3 mr-1" />
              <span className="text-xs font-bold">{property.location}</span>
            </div>
          </div>
          
          <div className="border-t pt-2 mt-auto">
            <div className="flex justify-between text-muted-foreground text-xs">
              <div className="flex items-center space-x-1">
                <Bed className="w-4 h-4" />
                <span className="font-bold">{property.bedrooms} amb.</span>
              </div>
              <div className="flex items-center space-x-1">
                <Bath className="w-4 h-4" />
                <span className="font-bold">{property.bathrooms} baños</span>
              </div>
              <div className="flex items-center space-x-1">
                <ArrowRightLeft className="w-4 h-4" />
                <span className="font-bold">{property.area} m²</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default PropertyCard;
