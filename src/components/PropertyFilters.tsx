import React, { useState } from 'react';
import { Filter, MapPin, DollarSign, Home, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';

export interface PropertyFiltersState {
  operation: string;
  propertyType: string;
  location: string;
  priceMin: string;
  priceMax: string;
  rooms: string;
  areaMin: string;
  areaMax: string;
  amenities: string[];
}

interface PropertyFiltersProps {
  onFiltersChange: (filters: PropertyFiltersState) => void;
  defaultOperation?: string;
  showOperationFilter?: boolean;
}

const PropertyFilters = ({ 
  onFiltersChange, 
  defaultOperation = '',
  showOperationFilter = true 
}: PropertyFiltersProps) => {
  const [filters, setFilters] = useState<PropertyFiltersState>({
    operation: defaultOperation,
    propertyType: '',
    location: '',
    priceMin: '',
    priceMax: '',
    rooms: '',
    areaMin: '',
    areaMax: '',
    amenities: [],
  });

  const [openSections, setOpenSections] = useState({
    price: false,
    rooms: false,
    area: false,
    amenities: false,
  });

  const amenitiesList = [
    'Piscina', 'Gimnasio', 'Parrilla', 'Jardín', 'Balcón', 'Terraza',
    'Cochera', 'Seguridad 24hs', 'Ascensor', 'Aire acondicionado'
  ];

  const handleFilterChange = (key: keyof PropertyFiltersState, value: string | string[]) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  const toggleAmenity = (amenity: string) => {
    const newAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter(a => a !== amenity)
      : [...filters.amenities, amenity];
    handleFilterChange('amenities', newAmenities);
  };

  const clearFilters = () => {
    const clearedFilters: PropertyFiltersState = {
      operation: defaultOperation,
      propertyType: '',
      location: '',
      priceMin: '',
      priceMax: '',
      rooms: '',
      areaMin: '',
      areaMax: '',
      amenities: [],
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const applyFilters = () => {
    onFiltersChange(filters);
  };

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="bg-card rounded-xl shadow-lg border p-6 sticky top-24">
      <div className="flex items-center gap-2 mb-6">
        <Filter className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Filtros de búsqueda</h3>
      </div>

      <div className="space-y-5">
        {/* Operación */}
        {showOperationFilter && (
          <div>
            <Label className="text-sm text-muted-foreground mb-2 block">Operación</Label>
            <Select
              value={filters.operation}
              onValueChange={(value) => handleFilterChange('operation', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="venta">Venta</SelectItem>
                <SelectItem value="alquiler">Alquiler</SelectItem>
                <SelectItem value="alquiler-temporal">Alquiler Temporal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Tipo de propiedad */}
        <div>
          <Label className="text-sm text-muted-foreground mb-2 block">Tipo de propiedad</Label>
          <Select
            value={filters.propertyType}
            onValueChange={(value) => handleFilterChange('propertyType', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="departamento">Departamento</SelectItem>
              <SelectItem value="casa">Casa</SelectItem>
              <SelectItem value="ph">PH</SelectItem>
              <SelectItem value="loft">Loft</SelectItem>
              <SelectItem value="terreno">Terreno</SelectItem>
              <SelectItem value="local">Local</SelectItem>
              <SelectItem value="oficina">Oficina</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Ubicación */}
        <div>
          <Label className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            Ubicación
          </Label>
          <Input
            type="text"
            value={filters.location}
            onChange={(e) => handleFilterChange('location', e.target.value)}
            placeholder="Barrio, ciudad, zona..."
            className="w-full"
          />
        </div>

        {/* Rango de precio - Collapsible */}
        <Collapsible open={openSections.price} onOpenChange={() => toggleSection('price')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-left">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Rango de precio</span>
            </div>
            <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${openSections.price ? 'rotate-180' : ''}`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-3 space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                value={filters.priceMin}
                onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                placeholder="Mínimo"
              />
              <Input
                type="number"
                value={filters.priceMax}
                onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                placeholder="Máximo"
              />
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Ambientes - Collapsible */}
        <Collapsible open={openSections.rooms} onOpenChange={() => toggleSection('rooms')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-left">
            <div className="flex items-center gap-2">
              <Home className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Ambientes</span>
            </div>
            <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${openSections.rooms ? 'rotate-180' : ''}`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-3">
            <Select
              value={filters.rooms}
              onValueChange={(value) => handleFilterChange('rooms', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Cualquiera" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Cualquiera</SelectItem>
                <SelectItem value="1">1 ambiente</SelectItem>
                <SelectItem value="2">2 ambientes</SelectItem>
                <SelectItem value="3">3 ambientes</SelectItem>
                <SelectItem value="4">4 ambientes</SelectItem>
                <SelectItem value="5+">5+ ambientes</SelectItem>
              </SelectContent>
            </Select>
          </CollapsibleContent>
        </Collapsible>

        {/* Superficie - Collapsible */}
        <Collapsible open={openSections.area} onOpenChange={() => toggleSection('area')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-left">
            <div className="flex items-center gap-2">
              <Square className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Superficie (m²)</span>
            </div>
            <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${openSections.area ? 'rotate-180' : ''}`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-3 space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                value={filters.areaMin}
                onChange={(e) => handleFilterChange('areaMin', e.target.value)}
                placeholder="Mín m²"
              />
              <Input
                type="number"
                value={filters.areaMax}
                onChange={(e) => handleFilterChange('areaMax', e.target.value)}
                placeholder="Máx m²"
              />
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Comodidades - Collapsible */}
        <Collapsible open={openSections.amenities} onOpenChange={() => toggleSection('amenities')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-left">
            <span className="text-sm font-medium">Comodidades</span>
            <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${openSections.amenities ? 'rotate-180' : ''}`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-3">
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {amenitiesList.map((amenity) => (
                <div key={amenity} className="flex items-center space-x-2">
                  <Checkbox
                    id={amenity}
                    checked={filters.amenities.includes(amenity)}
                    onCheckedChange={() => toggleAmenity(amenity)}
                  />
                  <label
                    htmlFor={amenity}
                    className="text-sm leading-none cursor-pointer"
                  >
                    {amenity}
                  </label>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Botones */}
        <div className="flex gap-3 pt-4 border-t">
          <Button
            onClick={clearFilters}
            variant="outline"
            className="flex-1"
          >
            Limpiar
          </Button>
          <Button
            onClick={applyFilters}
            className="flex-1"
          >
            Aplicar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PropertyFilters;
