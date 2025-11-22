import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, MapPin, DollarSign, Bed, Bath, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface Filters {
  operation: string;
  propertyType: string;
  location: string;
  priceRange: number[];
  bedrooms: string;
  bathrooms: string;
  areaRange: number[];
  amenities: string[];
}

interface SearchFiltersProps {
  onFiltersChange?: (filters: Filters) => void;
  initialFilters?: Partial<Filters>;
}

const SearchFilters = ({ onFiltersChange, initialFilters = {} }: SearchFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    operation: initialFilters.operation || '',
    propertyType: initialFilters.propertyType || '',
    location: initialFilters.location || '',
    priceRange: initialFilters.priceRange || [0, 1000000],
    bedrooms: initialFilters.bedrooms || '',
    bathrooms: initialFilters.bathrooms || '',
    areaRange: initialFilters.areaRange || [0, 500],
    amenities: initialFilters.amenities || [],
  });

  const { toast } = useToast();

  const handleFilterChange = (key: keyof Filters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    if (onFiltersChange) {
      onFiltersChange(newFilters);
    }
  };

  const clearFilters = () => {
    const clearedFilters: Filters = {
      operation: '',
      propertyType: '',
      location: '',
      priceRange: [0, 1000000],
      bedrooms: '',
      bathrooms: '',
      areaRange: [0, 500],
      amenities: []
    };
    setFilters(clearedFilters);
    if (onFiltersChange) {
      onFiltersChange(clearedFilters);
    }
    toast({
      title: "Filtros limpiados",
      description: "Todos los filtros han sido removidos",
      duration: 2000,
    });
  };

  const amenitiesList = [
    'Piscina', 'Gimnasio', 'Parrilla', 'Jardín', 'Balcón', 'Terraza',
    'Cochera', 'Portero', 'Seguridad 24hs', 'Ascensor', 'Aire acondicionado',
    'Calefacción', 'Amoblado', 'Mascotas permitidas'
  ];

  const toggleAmenity = (amenity: string) => {
    const newAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter(a => a !== amenity)
      : [...filters.amenities, amenity];
    handleFilterChange('amenities', newAmenities);
  };

  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (Array.isArray(value)) {
      if (key === 'priceRange') return value[0] !== 0 || value[1] !== 1000000;
      if (key === 'areaRange') return value[0] !== 0 || value[1] !== 500;
      return value.length > 0;
    }
    return value !== '';
  }).length;

  return (
    <div className="relative">
      {/* Filter Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        className="flex items-center space-x-2"
      >
        <Filter className="w-4 h-4" />
        <span>Filtros</span>
        {activeFiltersCount > 0 && (
          <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-1 ml-2">
            {activeFiltersCount}
          </span>
        )}
      </Button>

      {/* Filters Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 mt-2 w-96 bg-card rounded-lg shadow-xl border z-50 p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Filtros de búsqueda</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Operation Type */}
              <div>
                <Label className="mb-2 block">Operación</Label>
                <Select
                  value={filters.operation}
                  onValueChange={(value) => handleFilterChange('operation', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas</SelectItem>
                    <SelectItem value="venta">Venta</SelectItem>
                    <SelectItem value="alquiler">Alquiler</SelectItem>
                    <SelectItem value="alquiler-temporal">Alquiler Temporal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Property Type */}
              <div>
                <Label className="mb-2 block">Tipo de propiedad</Label>
                <Select
                  value={filters.propertyType}
                  onValueChange={(value) => handleFilterChange('propertyType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos</SelectItem>
                    <SelectItem value="departamento">Departamento</SelectItem>
                    <SelectItem value="casa">Casa</SelectItem>
                    <SelectItem value="ph">PH</SelectItem>
                    <SelectItem value="loft">Loft</SelectItem>
                    <SelectItem value="estudio">Estudio</SelectItem>
                    <SelectItem value="terreno">Terreno</SelectItem>
                    <SelectItem value="local">Local</SelectItem>
                    <SelectItem value="oficina">Oficina</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Location */}
              <div>
                <Label className="mb-2 flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  Ubicación
                </Label>
                <Input
                  type="text"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  placeholder="Barrio, ciudad, zona..."
                />
              </div>

              {/* Price Range */}
              <div>
                <Label className="mb-2 flex items-center">
                  <DollarSign className="w-4 h-4 mr-1" />
                  Rango de precio
                </Label>
                <div className="px-2">
                  <Slider
                    value={filters.priceRange}
                    onValueChange={(value) => handleFilterChange('priceRange', value)}
                    max={1000000}
                    min={0}
                    step={10000}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-1">
                    <span>${filters.priceRange[0].toLocaleString()}</span>
                    <span>${filters.priceRange[1].toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Bedrooms */}
              <div>
                <Label className="mb-2 flex items-center">
                  <Bed className="w-4 h-4 mr-1" />
                  Dormitorios
                </Label>
                <Select
                  value={filters.bedrooms}
                  onValueChange={(value) => handleFilterChange('bedrooms', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Cualquiera" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Cualquiera</SelectItem>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5+">5+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Bathrooms */}
              <div>
                <Label className="mb-2 flex items-center">
                  <Bath className="w-4 h-4 mr-1" />
                  Baños
                </Label>
                <Select
                  value={filters.bathrooms}
                  onValueChange={(value) => handleFilterChange('bathrooms', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Cualquiera" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Cualquiera</SelectItem>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4+">4+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Area Range */}
              <div>
                <Label className="mb-2 flex items-center">
                  <Square className="w-4 h-4 mr-1" />
                  Superficie (m²)
                </Label>
                <div className="px-2">
                  <Slider
                    value={filters.areaRange}
                    onValueChange={(value) => handleFilterChange('areaRange', value)}
                    max={500}
                    min={0}
                    step={10}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-1">
                    <span>{filters.areaRange[0]}m²</span>
                    <span>{filters.areaRange[1]}m²</span>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div>
                <Label className="mb-2 block">Comodidades</Label>
                <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                  {amenitiesList.map((amenity) => (
                    <div key={amenity} className="flex items-center space-x-2">
                      <Checkbox
                        id={amenity}
                        checked={filters.amenities.includes(amenity)}
                        onCheckedChange={() => toggleAmenity(amenity)}
                      />
                      <label
                        htmlFor={amenity}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {amenity}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4 border-t">
                <Button
                  onClick={clearFilters}
                  variant="outline"
                  className="flex-1"
                >
                  Limpiar
                </Button>
                <Button
                  onClick={() => setIsOpen(false)}
                  className="flex-1"
                >
                  Aplicar
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchFilters;
