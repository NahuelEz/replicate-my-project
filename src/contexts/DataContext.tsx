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

interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

interface Service {
  id: string;
  title: string;
  description: string;
  priceRange: string;
  deliveryTime: string;
  rating: number;
  reviews: Review[];
  images: string[];
}

interface Professional {
  id: string;
  name: string;
  specialty: string;
  category: string;
  location: string;
  avatar: string;
  reputation: {
    rating: number;
  };
  services: Service[];
  profileReviews: Review[];
}

interface DataContextType {
  properties: Property[];
  investmentProjects: InvestmentProject[];
  professionals: Professional[];
  favorites: Property[];
  loading: boolean;
  getPropertyBySlug: (slug: string) => Property | undefined;
  getInvestmentProjectBySlug: (slug: string) => InvestmentProject | undefined;
  getProfessionalById: (id: string) => Professional | undefined;
  getProfessionalsByCategory: (categorySlug: string) => Professional[];
  addProperty: (property: any) => void;
  toggleFavorite: (property: Property) => void;
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

const mockProfessionals: Professional[] = [
  {
    id: 'prof-1',
    name: 'Arq. María González',
    specialty: 'Arquitecta & Diseñadora',
    category: 'arquitectura-proyectos',
    location: 'Buenos Aires, CABA',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
    reputation: { rating: 4.8 },
    services: [
      {
        id: 'serv-1',
        title: 'Diseño y Proyecto de Vivienda',
        description: 'Diseño completo de viviendas unifamiliares, incluyendo planos, renders 3D y documentación técnica para aprobación municipal.',
        priceRange: '$500.000 - $1.500.000',
        deliveryTime: '30-45 días',
        rating: 4.9,
        images: ['https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800'],
        reviews: [
          {
            id: 'rev-1',
            author: 'Carlos Pérez',
            rating: 5,
            comment: 'Excelente trabajo, muy profesional y creativa. Superó nuestras expectativas.',
            date: '2025-01-15'
          }
        ]
      }
    ],
    profileReviews: [
      {
        id: 'prev-1',
        author: 'Lucía Fernández',
        rating: 5,
        comment: 'Muy profesional y atenta a todos los detalles. Recomendada 100%.',
        date: '2025-01-10'
      }
    ]
  },
  {
    id: 'prof-2',
    name: 'Ing. Roberto Martínez',
    specialty: 'Ingeniero Civil',
    category: 'ingenieros',
    location: 'Córdoba, Argentina',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400',
    reputation: { rating: 4.7 },
    services: [],
    profileReviews: []
  }
];

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [properties] = useState<Property[]>(mockProperties);
  const [investmentProjects] = useState<InvestmentProject[]>(mockInvestmentProjects);
  const [professionals] = useState<Professional[]>(mockProfessionals);
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [loading] = useState(false);

  const getPropertyBySlug = (slug: string) => {
    return properties.find(p => p.slug === slug);
  };

  const getInvestmentProjectBySlug = (slug: string) => {
    return investmentProjects.find(p => p.slug === slug);
  };

  const getProfessionalById = (id: string) => {
    return professionals.find(p => p.id === id);
  };

  const getProfessionalsByCategory = (categorySlug: string) => {
    if (!categorySlug) return professionals;
    return professionals.filter(p => p.category === categorySlug);
  };

  const addProperty = (property: any) => {
    console.log('Property added:', property);
  };

  const toggleFavorite = (property: Property) => {
    setFavorites(prev => {
      const exists = prev.some(fav => fav.id === property.id);
      if (exists) {
        return prev.filter(fav => fav.id !== property.id);
      } else {
        return [...prev, property];
      }
    });
  };

  return (
    <DataContext.Provider
      value={{
        properties,
        investmentProjects,
        professionals,
        favorites,
        loading,
        getPropertyBySlug,
        getInvestmentProjectBySlug,
        getProfessionalById,
        getProfessionalsByCategory,
        addProperty,
        toggleFavorite,
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
