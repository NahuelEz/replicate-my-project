import React, { useState, useMemo } from 'react';
import { useData } from '@/contexts/DataContext';
import PropertyCard from '@/components/PropertyCard';
import PropertyFilters, { PropertyFiltersState } from '@/components/PropertyFilters';
import { motion } from 'framer-motion';

const BuyProperties = () => {
  const { properties } = useData();
  const [filters, setFilters] = useState<PropertyFiltersState>({
    operation: 'venta',
    propertyType: '',
    location: '',
    priceMin: '',
    priceMax: '',
    rooms: '',
    areaMin: '',
    areaMax: '',
    amenities: [],
  });

  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
      // Operation filter (always venta for this page)
      if (p.operation?.toLowerCase() !== 'venta') return false;

      // Property type filter
      if (filters.propertyType && filters.propertyType !== 'all') {
        if (p.type?.toLowerCase() !== filters.propertyType.toLowerCase()) return false;
      }

      // Location filter
      if (filters.location) {
        if (!p.location?.toLowerCase().includes(filters.location.toLowerCase())) return false;
      }

      // Price filter
      const priceNum = parseFloat(p.price?.replace(/[^0-9.-]+/g, '') || '0');
      if (filters.priceMin && priceNum < parseFloat(filters.priceMin)) return false;
      if (filters.priceMax && priceNum > parseFloat(filters.priceMax)) return false;

      // Rooms filter
      if (filters.rooms && filters.rooms !== 'any') {
        const roomsFilter = filters.rooms === '5+' ? 5 : parseInt(filters.rooms);
        if (filters.rooms === '5+') {
          if ((p.bedrooms || 0) < roomsFilter) return false;
        } else {
          if ((p.bedrooms || 0) !== roomsFilter) return false;
        }
      }

      // Area filter
      if (filters.areaMin && (p.area || 0) < parseFloat(filters.areaMin)) return false;
      if (filters.areaMax && (p.area || 0) > parseFloat(filters.areaMax)) return false;

      return true;
    });
  }, [properties, filters]);

  const handleFiltersChange = (newFilters: PropertyFiltersState) => {
    setFilters(newFilters);
  };

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
            Encontrá tu próxima propiedad entre {filteredProperties.length} opciones disponibles
          </p>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <div className="w-full lg:w-80 flex-shrink-0">
              <PropertyFilters 
                onFiltersChange={handleFiltersChange} 
                defaultOperation="venta"
                showOperationFilter={false}
              />
            </div>

            {/* Properties Grid */}
            <div className="flex-1">
              {filteredProperties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProperties.map((property, index) => (
                    <motion.div
                      key={property.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                    >
                      <PropertyCard property={property} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-muted-foreground text-lg">
                    No se encontraron propiedades con los filtros seleccionados.
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BuyProperties;
