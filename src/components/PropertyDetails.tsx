import React from 'react';
import { motion } from 'framer-motion';

interface PropertyFeatures {
  heating: string;
  flooring: string;
  windows: string;
}

interface Property {
  type: string;
  area: number;
  coveredArea: number;
  floor: string;
  orientation: string;
  age: number;
  expenses: string;
  features: PropertyFeatures;
}

interface PropertyDetailsProps {
  property: Property;
}

const PropertyDetails = ({ property }: PropertyDetailsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-card rounded-lg p-6 shadow-sm border"
    >
      <h2 className="text-xl font-semibold mb-4">Detalles de la propiedad</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tipo:</span>
            <span className="font-medium">{property.type}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Superficie total:</span>
            <span className="font-medium">{property.area}m²</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Superficie cubierta:</span>
            <span className="font-medium">{property.coveredArea}m²</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Piso:</span>
            <span className="font-medium">{property.floor}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Orientación:</span>
            <span className="font-medium">{property.orientation}</span>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Antigüedad:</span>
            <span className="font-medium">{property.age} años</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Expensas:</span>
            <span className="font-medium">{property.expenses}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Calefacción:</span>
            <span className="font-medium">{property.features.heating}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Pisos:</span>
            <span className="font-medium">{property.features.flooring}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Ventanas:</span>
            <span className="font-medium">{property.features.windows}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyDetails;
