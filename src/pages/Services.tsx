import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building, HardHat, Wrench, Briefcase, Camera, Truck, DraftingCompass, Zap, Droplets, Flame, Hammer, Paintbrush, FileText, Scale, PenSquare, Search, Shield, Video, Home, Users } from 'lucide-react';

const serviceGroups = [
  {
    title: 'Construcción & Obra',
    icon: <Building className="w-8 h-8 text-brand-celeste mb-4" />,
    categories: [
      { name: 'Arquitectura & Proyectos', slug: 'arquitectura-proyectos', icon: DraftingCompass },
      { name: 'Ingenieros', slug: 'ingenieros', icon: HardHat },
      { name: 'Empresas Constructoras', slug: 'empresas-constructoras', icon: Briefcase },
      { name: 'Maestros Mayores de Obra', slug: 'maestros-mayores-obra', icon: Users },
    ]
  },
  {
    title: 'Oficios Técnicos Especializados',
    icon: <Wrench className="w-8 h-8 text-brand-celeste mb-4" />,
    categories: [
      { name: 'Electricistas', slug: 'electricistas', icon: Zap },
      { name: 'Plomeros', slug: 'plomeros', icon: Droplets },
      { name: 'Gasistas Matriculados', slug: 'gasistas', icon: Flame },
      { name: 'Pintores', slug: 'pintores', icon: Paintbrush },
    ]
  },
  {
    title: 'Servicios Inmobiliarios',
    icon: <FileText className="w-8 h-8 text-brand-celeste mb-4" />,
    categories: [
      { name: 'Consultores Inmobiliarios', slug: 'consultores-inmobiliarios', icon: Search },
      { name: 'Tasadores', slug: 'tasadores', icon: Scale },
      { name: 'Escribanos', slug: 'escribanos', icon: PenSquare },
      { name: 'Garantías y Seguros', slug: 'garantias-seguros', icon: Shield },
    ]
  },
  {
    title: 'Producción y Marketing Visual',
    icon: <Camera className="w-8 h-8 text-brand-celeste mb-4" />,
    categories: [
      { name: 'Fotografía Profesional', slug: 'fotografia-profesional', icon: Camera },
      { name: 'Videos con Drone', slug: 'videos-drone', icon: Video },
      { name: 'Renderistas 3D', slug: 'renderistas-3d', icon: Home },
    ]
  },
  {
    title: 'Servicios Logísticos',
    icon: <Truck className="w-8 h-8 text-brand-celeste mb-4" />,
    categories: [
      { name: 'Mudanzas y Fletes', slug: 'mudanzas', icon: Truck },
      { name: 'Reparaciones Generales', slug: 'reparaciones', icon: Hammer },
    ]
  }
];

interface CategoryCardProps {
  category: {
    name: string;
    slug: string;
    icon: React.ElementType;
  };
}

const CategoryCard = ({ category }: CategoryCardProps) => (
  <Link 
    to={`/servicios/${category.slug}`}
    className="flex items-center bg-white p-4 rounded-lg transition-all duration-300 hover:bg-brand-celeste/10 hover:shadow-lg group border border-border"
  >
    <category.icon className="w-6 h-6 mr-4 text-brand-celeste transition-colors duration-300" />
    <h4 className="text-md font-bold font-heading text-foreground group-hover:text-brand-celeste">{category.name}</h4>
  </Link>
);

const Services = () => {
  return (
    <>
      <Helmet>
        <title>Red de Profesionales - PropiedadesArgentinas.com</title>
        <meta name="description" content="Encontrá arquitectos, ingenieros, constructoras, electricistas, plomeros y todos los profesionales que necesitás para tus proyectos inmobiliarios." />
      </Helmet>
      <div className="bg-background min-h-screen">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-bold font-heading text-foreground mb-4"
            >
              Red de Profesionales
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-muted-foreground"
            >
              Conectá con los mejores expertos del sector inmobiliario y de la construcción para llevar a cabo tus proyectos.
            </motion.p>
          </div>
          
          <div className="space-y-12">
            {serviceGroups.map((group, groupIndex) => (
              <motion.div
                key={group.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: groupIndex * 0.2 }}
              >
                <div className="flex items-center mb-6">
                  {group.icon}
                  <h2 className="text-2xl md:text-3xl font-bold font-heading text-foreground">{group.title}</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {group.categories.map((cat) => (
                    <CategoryCard key={cat.slug} category={cat} />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Services;
