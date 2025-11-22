import React, { createContext, useContext, useState, ReactNode } from 'react';

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
  featured?: boolean;
}

interface InvestmentProject {
  id: number;
  name: string;
  slug: string;
  location: string;
  status: string;
  deliveryDate: string;
  minInvestment: number;
  annualReturn: number;
  capitalGain: number;
  images: string[];
  description: string;
}

interface DataContextType {
  properties: Property[];
  investmentProjects: InvestmentProject[];
  loading: boolean;
  getPropertyBySlug: (slug: string) => Property | undefined;
  getInvestmentProjectBySlug: (slug: string) => InvestmentProject | undefined;
  addProperty: (property: any) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const mockProperties: Property[] = [
  {
    id: 1,
    title: "Departamento 3 ambientes en Palermo con balcón",
    slug: "departamento-3-ambientes-palermo",
    price: "USD 280.000",
    location: "Palermo, CABA",
    bedrooms: 2,
    bathrooms: 2,
    area: 85,
    type: "Departamento",
    operation: "Venta",
    images: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800"],
    featured: true,
  },
  {
    id: 2,
    title: "Casa en Nordelta con pileta y jardín",
    slug: "casa-nordelta-pileta-jardin",
    price: "USD 450.000",
    location: "Nordelta, Buenos Aires",
    bedrooms: 4,
    bathrooms: 3,
    area: 250,
    type: "Casa",
    operation: "Venta",
    images: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800"],
    featured: true,
  },
  {
    id: 3,
    title: "Departamento 2 ambientes en Belgrano",
    slug: "departamento-2-ambientes-belgrano",
    price: "ARS 350.000/mes",
    location: "Belgrano, CABA",
    bedrooms: 1,
    bathrooms: 1,
    area: 55,
    type: "Departamento",
    operation: "Alquiler",
    images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"],
  },
];

const mockInvestmentProjects: InvestmentProject[] = [
  {
    id: 1,
    name: "Torres del Puerto",
    slug: "torres-del-puerto",
    location: "Puerto Madero, CABA",
    status: "En construcción",
    deliveryDate: "2025-12-01",
    minInvestment: 100000,
    annualReturn: 8,
    capitalGain: 25,
    images: ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800"],
    description: "Proyecto premium en la zona más exclusiva de Buenos Aires.",
  },
  {
    id: 2,
    name: "Edificio Palermo Soho",
    slug: "edificio-palermo-soho",
    location: "Palermo Soho, CABA",
    status: "En pozo",
    deliveryDate: "2026-06-01",
    minInvestment: 75000,
    annualReturn: 10,
    capitalGain: 30,
    images: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800"],
    description: "Desarrollo moderno en el corazón de Palermo Soho.",
  },
];

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [properties] = useState<Property[]>(mockProperties);
  const [investmentProjects] = useState<InvestmentProject[]>(mockInvestmentProjects);
  const [loading] = useState(false);

  const getPropertyBySlug = (slug: string) => {
    return properties.find(p => p.slug === slug);
  };

  const getInvestmentProjectBySlug = (slug: string) => {
    return investmentProjects.find(p => p.slug === slug);
  };

  const addProperty = (property: any) => {
    console.log('Property added:', property);
  };

  return (
    <DataContext.Provider
      value={{
        properties,
        investmentProjects,
        loading,
        getPropertyBySlug,
        getInvestmentProjectBySlug,
        addProperty,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
