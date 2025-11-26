import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import PropertyCard from '@/components/PropertyCard';

interface Property {
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
}

interface FeaturedPropertiesProps {
  properties: Property[];
  onSeeMore: () => void;
  title?: string;
  subtitle?: string;
}

const FeaturedProperties = ({ 
  properties, 
  onSeeMore, 
  title = "Propiedades Destacadas",
  subtitle = "Una selección de las mejores oportunidades del mercado, elegidas para vos."
}: FeaturedPropertiesProps) => {
  return (
    <section className="py-16 bg-muted">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex justify-between items-center mb-12"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-2">
              {title}
            </h2>
            <p className="text-lg text-muted-foreground">
              {subtitle}
            </p>
          </div>
          <button 
            onClick={onSeeMore}
            className="text-brand-celeste hover:underline font-bold hidden md:block"
          >
            Destacar mi publicación
          </button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {properties.slice(0, 4).map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <PropertyCard property={property} />
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button 
            onClick={onSeeMore} 
            variant="outline" 
            className="font-bold border-brand-celeste text-brand-celeste hover:bg-brand-celeste hover:text-white rounded-lg px-8 py-6 text-base transition-all duration-300"
          >
            Ver más propiedades
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
