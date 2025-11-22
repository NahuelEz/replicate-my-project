import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { Property } from '@/contexts/DataContext';
import { toast } from '@/hooks/use-toast';

interface ComparisonContextType {
  comparisonItems: Property[];
  addToComparison: (property: Property) => void;
  removeFromComparison: (propertyId: number) => void;
  clearComparison: () => void;
  isInComparison: (propertyId: number) => boolean;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

const COMPARISON_STORAGE_KEY = 'property-comparison';
const MAX_COMPARISON_ITEMS = 4;

export const usePropertyComparison = () => {
  const context = useContext(ComparisonContext);
  if (!context) {
    throw new Error('usePropertyComparison must be used within a ComparisonProvider');
  }
  return context;
};

interface ComparisonProviderProps {
  children: ReactNode;
}

export const ComparisonProvider = ({ children }: ComparisonProviderProps) => {
  const [comparisonItems, setComparisonItems] = useState<Property[]>(() => {
    try {
      const stored = localStorage.getItem(COMPARISON_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading comparison items:', error);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(COMPARISON_STORAGE_KEY, JSON.stringify(comparisonItems));
  }, [comparisonItems]);

  const addToComparison = useCallback((property: Property) => {
    setComparisonItems(prevItems => {
      // Check if already in comparison
      if (prevItems.some(item => item.id === property.id)) {
        toast({
          title: "Ya está en comparación",
          description: `${property.title} ya está en tu lista de comparación.`,
          variant: "default",
        });
        return prevItems;
      }

      // Check max limit
      if (prevItems.length >= MAX_COMPARISON_ITEMS) {
        toast({
          title: "Límite alcanzado",
          description: `Solo puedes comparar hasta ${MAX_COMPARISON_ITEMS} propiedades a la vez.`,
          variant: "destructive",
        });
        return prevItems;
      }

      toast({
        title: "Agregado a comparación",
        description: `${property.title} se agregó a tu lista de comparación.`,
      });

      return [...prevItems, property];
    });
  }, []);

  const removeFromComparison = useCallback((propertyId: number) => {
    setComparisonItems(prevItems => {
      const property = prevItems.find(item => item.id === propertyId);
      
      if (property) {
        toast({
          title: "Eliminado de comparación",
          description: `${property.title} se eliminó de tu lista de comparación.`,
        });
      }

      return prevItems.filter(item => item.id !== propertyId);
    });
  }, []);

  const clearComparison = useCallback(() => {
    setComparisonItems([]);
    toast({
      title: "Comparación limpiada",
      description: "Se eliminaron todas las propiedades de la comparación.",
    });
  }, []);

  const isInComparison = useCallback((propertyId: number) => {
    return comparisonItems.some(item => item.id === propertyId);
  }, [comparisonItems]);

  const value = useMemo(() => ({
    comparisonItems,
    addToComparison,
    removeFromComparison,
    clearComparison,
    isInComparison,
  }), [comparisonItems, addToComparison, removeFromComparison, clearComparison, isInComparison]);

  return (
    <ComparisonContext.Provider value={value}>
      {children}
    </ComparisonContext.Provider>
  );
};
