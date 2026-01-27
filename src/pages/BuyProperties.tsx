import React from 'react';
import { useData } from '@/contexts/DataContext';
import PropertyCard from '@/components/PropertyCard';
import { motion } from 'framer-motion';

const BuyProperties = () => {
  const { properties } = useData();
  const buyProperties = properties.filter(p => p.operation?.toLowerCase() === 'venta');

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
            Propiedades en Venta
          </h1>
          <p className="text-muted-foreground text-lg mb-8">
            Encontrá tu próxima propiedad entre {buyProperties.length} opciones disponibles
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {buyProperties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <PropertyCard property={property} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BuyProperties;
