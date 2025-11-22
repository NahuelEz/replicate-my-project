import React from 'react';
import { motion } from 'framer-motion';

interface PropertyAmenitiesProps {
  amenities: string[];
}

const PropertyAmenities = ({ amenities }: PropertyAmenitiesProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="bg-card rounded-lg p-6 shadow-sm border"
    >
      <h2 className="text-xl font-semibold mb-4">Comodidades</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {amenities.map((amenity, index) => (
          <div key={index} className="flex items-center text-foreground">
            <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
            <span>{amenity}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default PropertyAmenities;
