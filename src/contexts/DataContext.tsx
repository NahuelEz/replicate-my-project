import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface Property {
  id: number;
  title: string;
  slug: string;
  price: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  status?: string;
  image?: string;
  images: string[];
  operation: string;
  type: string;
  rentalType?: string;
  description?: string;
  surface?: number;
  coveredSurface?: number;
  rooms?: number;
  baths?: number;
  garage?: number;
  featured?: boolean;
}

interface Publisher {
  name: string;
  avatar: string;
  reputation: number;
  memberSince: string;
  profileUrl: string;
}

interface Coordinates {
  lat: number;
  lng: number;
}

interface InvestmentProject {
  id: number;
  name: string;
  slug: string;
  status: string;
  deliveryDate: string;
  location: string;
  unitTypes: string[];
  minInvestment: number;
  annualReturn: number;
  capitalGain: number;
  modality: string;
  description: string;
  images: string[];
  coordinates?: Coordinates;
  publisher?: Publisher;
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
  images: string[];
  category: string;
  deliveryTime: string;
  priceRange: string;
  rating: number;
  reviews: Review[];
}

interface Professional {
  id: string;
  name: string;
  avatar: string;
  specialty: string;
  categorySlug: string;
  location: string;
  reputation: {
    rating: number;
    level: string;
  };
  profileReviews: Review[];
  services: Service[];
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
  updateProperty: (property: Property) => void;
  toggleFavorite: (property: Property) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const initialProperties: Property[] = [
  { id: 1, title: 'Departamento en Palermo', slug: 'departamento-palermo', price: 'USD 250.000', location: 'Palermo, CABA', bedrooms: 2, bathrooms: 1, area: 50, status: 'activa', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2670&auto=format&fit=crop', images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2670&auto=format&fit=crop'], operation: 'Venta', type: 'departamento', description: "Luminoso departamento de 2 ambientes en el corazón de Palermo Hollywood. Balcón con vista abierta.", surface: 50, coveredSurface: 45, rooms: 2, baths: 1, garage: 1, featured: true },
  { id: 2, title: 'Casa en San Isidro', slug: 'casa-san-isidro', price: 'USD 680.000', location: 'San Isidro, GBA Norte', bedrooms: 5, bathrooms: 3, area: 400, status: 'pausada', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2675&auto=format&fit=crop', images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2675&auto=format&fit=crop'], operation: 'Venta', type: 'casa', description: "Espectacular casa con jardín y pileta en la mejor zona de San Isidro. Acabados de lujo.", surface: 400, coveredSurface: 250, rooms: 5, baths: 3, garage: 2, featured: true },
  { id: 3, title: 'Oficina en Microcentro', slug: 'oficina-microcentro', price: 'USD 180.000', location: 'Microcentro, CABA', bedrooms: 3, bathrooms: 2, area: 80, status: 'finalizada', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2669&auto=format&fit=crop', images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2669&auto=format&fit=crop'], operation: 'Venta', type: 'oficina', description: "Oficina moderna y equipada en edificio corporativo. Ubicación estratégica.", surface: 80, coveredSurface: 80, rooms: 3, baths: 2, garage: 0, featured: true },
  { id: 4, title: 'Loft en Puerto Madero', slug: 'loft-puerto-madero', price: 'ARS 350.000/mes', location: 'Puerto Madero, CABA', bedrooms: 1, bathrooms: 1, area: 65, status: 'activa', image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=2670&auto=format&fit=crop', images: ['https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=2670&auto=format&fit=crop'], operation: 'Alquiler', type: 'departamento', rentalType: 'tradicional', description: 'Loft con vista al dique.', surface: 65, coveredSurface: 65, rooms: 1, baths: 1, garage: 1 },
  { id: 5, title: 'Casa quinta en Tigre', slug: 'casa-quinta-tigre', price: 'USD 320.000', location: 'Tigre, GBA Norte', bedrooms: 4, bathrooms: 3, area: 250, status: 'activa', image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2670&auto=format&fit=crop', images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2670&auto=format&fit=crop'], operation: 'Venta', type: 'casa', description: 'Casa de fin de semana con pileta y parrilla.', surface: 250, coveredSurface: 180, rooms: 4, baths: 3, garage: 3 },
  { id: 6, title: 'Estudio en Recoleta', slug: 'estudio-recoleta', price: 'ARS 180.000/mes', location: 'Recoleta, CABA', bedrooms: 1, bathrooms: 1, area: 35, status: 'activa', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2670&auto=format&fit=crop', images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2670&auto=format&fit=crop'], operation: 'Alquiler', type: 'departamento', rentalType: 'tradicional', description: 'Monoambiente ideal para estudiantes.', surface: 35, coveredSurface: 35, rooms: 1, baths: 1, garage: 0 },
  { id: 7, title: 'Depto amoblado en Belgrano', slug: 'depto-amoblado-belgrano', price: 'USD 900/mes', location: 'Belgrano, CABA', bedrooms: 2, bathrooms: 1, area: 60, status: 'activa', image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2680&auto=format&fit=crop', images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2680&auto=format&fit=crop'], operation: 'Alquiler', type: 'departamento', rentalType: 'temporal', description: 'Departamento totalmente amoblado y equipado para alquileres temporales. Ideal para ejecutivos o turistas.', surface: 60, coveredSurface: 60, rooms: 2, baths: 1, garage: 0 },
  { id: 8, title: 'Casa de playa en Cariló', slug: 'casa-playa-carilo', price: 'USD 300/noche', location: 'Cariló, Costa Atlántica', bedrooms: 4, bathrooms: 3, area: 220, status: 'activa', image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=2670&auto=format&fit=crop', images: ['https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=2670&auto=format&fit=crop'], operation: 'Alquiler', type: 'casa', rentalType: 'temporal', description: 'Espectacular casa a metros del mar. Ideal para vacaciones en familia.', surface: 220, coveredSurface: 200, rooms: 4, baths: 3, garage: 2 },
];

const initialInvestmentProjects: InvestmentProject[] = [
  { 
    id: 1, 
    name: 'Torres del Sol', 
    slug: 'torres-del-sol', 
    status: 'En pozo', 
    deliveryDate: '2026-12-01', 
    location: 'Caballito, CABA', 
    unitTypes: ['Deptos 1-3 amb.'], 
    minInvestment: 50000, 
    annualReturn: 8, 
    capitalGain: 25, 
    modality: 'Fideicomiso', 
    description: 'Un desarrollo único en el corazón de Caballito, pensado para la vida moderna. Unidades de 1, 2 y 3 ambientes con amenities de primer nivel: piscina, SUM, gimnasio y seguridad 24hs. Ideal para inversores que buscan renta y capitalización.', 
    images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2670&auto=format&fit=crop', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2653&auto=format&fit=crop', 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=2687&auto=format&fit=crop'], 
    coordinates: { lat: -34.6105, lng: -58.4441 },
    publisher: {
      name: 'Constructora del Sur S.A.',
      avatar: 'https://i.pravatar.cc/150?u=constructora-sur',
      reputation: 5,
      memberSince: '2021-03-10',
      profileUrl: '/perfil/constructora-del-sur'
    }
  },
  { 
    id: 2, 
    name: 'Madero Office IV', 
    slug: 'madero-office-iv', 
    status: 'En construcción', 
    deliveryDate: '2025-06-01', 
    location: 'Puerto Madero, CABA', 
    unitTypes: ['Oficinas AAA'], 
    minInvestment: 120000, 
    annualReturn: 10, 
    capitalGain: 20, 
    modality: 'Renta garantizada', 
    description: 'Oficinas premium en la zona de mayor crecimiento de Buenos Aires. Plantas libres, tecnología de punta y vistas panorámicas al río. Una inversión segura con renta garantizada por contrato.', 
    images: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2670&auto=format&fit=crop', 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=2669&auto=format&fit=crop', 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2669&auto=format&fit=crop'], 
    coordinates: { lat: -34.6173, lng: -58.3621 },
    publisher: {
      name: 'Urbanica Desarrollos',
      avatar: 'https://i.pravatar.cc/150?u=urbanica',
      reputation: 4,
      memberSince: '2020-11-25',
      profileUrl: '/perfil/urbanica-desarrollos'
    }
  },
  { 
    id: 3, 
    name: 'Country "La Arboleda"', 
    slug: 'country-la-arboleda', 
    status: 'Entrega inmediata', 
    deliveryDate: '2024-01-01', 
    location: 'Pilar, GBA Norte', 
    unitTypes: ['Lotes', 'Casas'], 
    minInvestment: 80000, 
    annualReturn: 5, 
    capitalGain: 30, 
    modality: 'Reventa', 
    description: 'Viva en un entorno natural con todas las comodidades. Lotes desde 800m² y casas de diseño. Club house, canchas de tenis, golf y acceso directo desde Panamericana. Oportunidad única de revalorización.', 
    images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2669&auto=format&fit=crop', 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=2675&auto=format&fit=crop', 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?q=80&w=2670&auto=format&fit=crop'], 
    coordinates: { lat: -34.4449, lng: -58.9163 },
    publisher: {
      name: 'Grupo Inversor Pilar',
      avatar: 'https://i.pravatar.cc/150?u=grupo-pilar',
      reputation: 3,
      memberSince: '2023-01-05',
      profileUrl: '/perfil/grupo-inversor-pilar'
    }
  },
];

const initialProfessionals: Professional[] = [
  {
    id: 'arq-laura-gomez',
    name: 'Arq. Laura Gómez',
    avatar: 'https://i.pravatar.cc/150?u=laura-gomez',
    specialty: 'Diseño Residencial y Sustentable',
    categorySlug: 'arquitectura-proyectos',
    location: 'Palermo, CABA',
    reputation: { rating: 4.8, level: 'Nivel 5 - Excelente' },
    profileReviews: [
      { id: 'pr1', author: 'Familia Perez', rating: 5, comment: 'Laura diseñó la casa de nuestros sueños. Súper profesional y atenta a cada detalle.', date: '2024-06-20' },
      { id: 'pr2', author: 'Juan Carlos', rating: 4, comment: 'Muy buen trabajo, aunque demoró un poco más de lo esperado. El resultado final fue impecable.', date: '2024-05-15' },
    ],
    services: [
      {
        id: 'diseno-planos',
        title: 'Diseño de Planos Personalizados',
        description: 'Creación de planos de arquitectura completos para viviendas unifamiliares, desde el anteproyecto hasta los planos municipales.',
        images: ['https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2831&auto=format&fit=crop'],
        category: 'Diseño Arquitectónico',
        deliveryTime: '3-4 semanas',
        priceRange: 'Desde USD 1.500',
        rating: 5,
        reviews: [
          { id: 'sr1', author: 'Martina S.', rating: 5, comment: 'El plano fue perfecto, captó exactamente lo que queríamos.', date: '2024-07-01' }
        ]
      },
      {
        id: 'renderizado-3d',
        title: 'Renderizado 3D y Visualización',
        description: 'Visualizaciones fotorrealistas de alta calidad para que puedas ver tu proyecto antes de construirlo.',
        images: ['https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2670&auto=format&fit=crop'],
        category: 'Visualización',
        deliveryTime: '1 semana',
        priceRange: 'Desde USD 500',
        rating: 4.5,
        reviews: [
          { id: 'sr2', author: 'Inmobiliaria Norte', rating: 5, comment: 'Los renders nos ayudaron a vender el proyecto en pozo. Increíble calidad.', date: '2024-06-10' },
          { id: 'sr3', author: 'Carlos F.', rating: 4, comment: 'Buen trabajo, me hubiese gustado una opción de revisión más.', date: '2024-05-22' }
        ]
      }
    ]
  },
  {
    id: 'ing-martin-rodriguez',
    name: 'Ing. Martín Rodriguez',
    avatar: 'https://i.pravatar.cc/150?u=martin-rodriguez',
    specialty: 'Cálculo Estructural',
    categorySlug: 'ingenieros',
    location: 'Córdoba Capital',
    reputation: { rating: 5, level: 'Nivel 5 - Excelente' },
    profileReviews: [
      { id: 'pr3', author: 'Constructora Lider', rating: 5, comment: 'Siempre confiamos en los cálculos de Martín. Precisión y seguridad garantizadas.', date: '2024-07-05' }
    ],
    services: [
      {
        id: 'calculo-estructural',
        title: 'Cálculo de Estructuras de Hormigón',
        description: 'Análisis y dimensionamiento de estructuras de hormigón armado para edificios y viviendas, cumpliendo con todas las normativas vigentes (CIRSOC).',
        images: ['https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2676&auto=format&fit=crop'],
        category: 'Ingeniería Civil',
        deliveryTime: '2-3 semanas',
        priceRange: 'A consultar',
        rating: 5,
        reviews: [
          { id: 'sr4', author: 'Arq. Gomez', rating: 5, comment: 'Impecable y entregado a tiempo. Un placer trabajar con Martín.', date: '2024-06-28' }
        ]
      }
    ]
  },
  {
    id: 'elec-juan-perez',
    name: 'Juan Pérez Electricista',
    avatar: 'https://i.pravatar.cc/150?u=juan-perez',
    specialty: 'Instalaciones Eléctricas Domiciliarias',
    categorySlug: 'electricistas',
    location: 'Rosario, Santa Fe',
    reputation: { rating: 4.9, level: 'Nivel 5 - Excelente' },
    profileReviews: [],
    services: [
      {
        id: 'instalacion-completa',
        title: 'Instalación Eléctrica Completa',
        description: 'Cableado completo para obras nuevas, tableros, y puesta a tierra.',
        images: ['https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2669&auto=format&fit=crop'],
        category: 'Instalaciones',
        deliveryTime: 'A convenir',
        priceRange: 'A consultar',
        rating: 4.9,
        reviews: [
          { id: 'sr5', author: 'Familia Rossi', rating: 5, comment: 'Juan nos hizo toda la instalación de la casa nueva. Un trabajo prolijo y seguro.', date: '2024-07-10' }
        ]
      }
    ]
  },
  {
    id: 'foto-ana-sanchez',
    name: 'Ana Sánchez Fotografía',
    avatar: 'https://i.pravatar.cc/150?u=ana-sanchez',
    specialty: 'Fotografía de Arquitectura e Inmobiliaria',
    categorySlug: 'fotografia-profesional',
    location: 'Toda Argentina',
    reputation: { rating: 5, level: 'Nivel 5 - Excelente' },
    profileReviews: [],
    services: [
      {
        id: 'sesion-fotos-propiedad',
        title: 'Sesión de Fotos Profesional para Propiedades',
        description: 'Paquete de 20 fotografías de alta calidad, editadas profesionalmente para destacar cualquier tipo de propiedad en venta o alquiler.',
        images: ['https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=2670&auto=format&fit=crop'],
        category: 'Fotografía',
        deliveryTime: '48hs',
        priceRange: 'Desde ARS 30.000',
        rating: 5,
        reviews: [
          { id: 'sr6', author: 'Inmobiliaria Futuro', rating: 5, comment: 'Las fotos de Ana son increíbles, nuestras propiedades se alquilan mucho más rápido ahora.', date: '2024-07-15' }
        ]
      }
    ]
  }
];

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const [properties, setProperties] = useState<Property[]>([]);
  const [investmentProjects, setInvestmentProjects] = useState<InvestmentProject[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch properties
        const { data: propertiesData, error: propertiesError } = await supabase
          .from('properties')
          .select('*')
          .eq('status', 'activa')
          .order('created_at', { ascending: false });

        if (propertiesError) throw propertiesError;

        // Transform Supabase data to match Property interface
        const transformedProperties: Property[] = (propertiesData || []).map(p => ({
          id: parseInt(p.id.split('-')[0], 16), // Convert UUID to number for compatibility
          title: p.title,
          slug: p.slug,
          price: p.price,
          location: p.location,
          bedrooms: p.bedrooms,
          bathrooms: p.bathrooms,
          area: Number(p.area),
          status: p.status || 'activa',
          image: p.images?.[0] || '',
          images: p.images || [],
          operation: p.operation,
          type: p.type,
          rentalType: p.rental_type || undefined,
          description: p.description || undefined,
          surface: p.surface ? Number(p.surface) : undefined,
          coveredSurface: p.covered_surface ? Number(p.covered_surface) : undefined,
          rooms: p.rooms || undefined,
          baths: p.baths || undefined,
          garage: p.garage || undefined,
          featured: p.featured || false,
        }));

        setProperties(transformedProperties);

        // Fetch investment projects
        const { data: projectsData, error: projectsError } = await supabase
          .from('investment_projects')
          .select('*')
          .order('created_at', { ascending: false });

        if (projectsError) throw projectsError;

        // Transform Supabase data to match InvestmentProject interface
        const transformedProjects: InvestmentProject[] = (projectsData || []).map(p => ({
          id: parseInt(p.id.split('-')[0], 16),
          name: p.name,
          slug: p.slug,
          status: p.status,
          deliveryDate: p.delivery_date,
          location: p.location,
          unitTypes: p.unit_types,
          minInvestment: Number(p.min_investment),
          annualReturn: Number(p.annual_return),
          capitalGain: Number(p.capital_gain),
          modality: p.modality,
          description: p.description,
          images: p.images || [],
          coordinates: p.coordinates as unknown as Coordinates | undefined,
          publisher: p.publisher as unknown as Publisher | undefined,
        }));

        setInvestmentProjects(transformedProjects);

        // Fetch professionals
        const { data: professionalsData, error: professionalsError } = await supabase
          .from('professionals')
          .select('*')
          .order('created_at', { ascending: false });

        if (professionalsError) throw professionalsError;

        // Transform Supabase data to match Professional interface
        const transformedProfessionals: Professional[] = (professionalsData || []).map(p => ({
          id: p.id,
          name: p.name,
          avatar: p.avatar || '',
          specialty: p.specialty,
          categorySlug: p.category_slug,
          location: p.location,
          reputation: p.reputation as { rating: number; level: string },
          profileReviews: (p.profile_reviews as unknown as Review[]) || [],
          services: (p.services as unknown as Service[]) || [],
        }));

        setProfessionals(transformedProfessionals);

        // Load favorites from localStorage
        const storedFavorites = localStorage.getItem('favorites');
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error',
          description: 'No se pudieron cargar los datos. Intenta recargar la página.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addProperty = (newProperty: any) => {
    const propertyWithId = { ...newProperty, id: Date.now() };
    setProperties(prev => [propertyWithId, ...prev]);
  };

  const updateProperty = (updatedProperty: Property) => {
    setProperties(prev =>
      prev.map(p =>
        p.id === updatedProperty.id ? { ...p, ...updatedProperty } : p
      )
    );
  };

  const toggleFavorite = (property: Property) => {
    setFavorites(prev => {
      const isFavorite = prev.some(fav => fav.id === property.id);
      if (isFavorite) {
        toast({ title: "Removido de favoritos" });
        return prev.filter(fav => fav.id !== property.id);
      } else {
        toast({ title: "Agregado a favoritos" });
        return [...prev, property];
      }
    });
  };

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
    return professionals.filter(p => p.categorySlug === categorySlug);
  };

  const value: DataContextType = {
    properties,
    investmentProjects,
    professionals,
    favorites,
    loading,
    getPropertyBySlug,
    updateProperty,
    toggleFavorite,
    addProperty,
    getInvestmentProjectBySlug,
    getProfessionalById,
    getProfessionalsByCategory,
  };

  return (
    <DataContext.Provider value={value}>
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
