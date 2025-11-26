import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Building2, Paintbrush, Hammer, Wrench, HardHat, FileText } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const services = [
  {
    id: 1,
    title: 'Diseño de Proyectos',
    category: 'ARQUITECTURA',
    description: 'Diseño arquitectónico completo para tu proyecto',
    icon: FileText,
    featured: true,
  },
  {
    id: 2,
    title: 'Construcción de Obras',
    category: 'CONSTRUCCIÓN',
    description: 'Construcción llave en mano de proyectos residenciales',
    icon: HardHat,
    featured: false,
  },
  {
    id: 3,
    title: 'Remodelaciones',
    category: 'REFACCIONES',
    description: 'Renovación y actualización de espacios',
    icon: Hammer,
    featured: false,
  },
  {
    id: 4,
    title: 'Instalaciones',
    category: 'SERVICIOS',
    description: 'Instalaciones eléctricas, sanitarias y gas',
    icon: Wrench,
    featured: false,
  },
];

const FeaturedServices = () => {
  const navigate = useNavigate();

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
              Productos Destacados
            </h2>
            <p className="text-lg text-muted-foreground">
              Insumos y contenedores para tu próximo proyecto.
            </p>
          </div>
          <button 
            onClick={() => navigate('/servicios')}
            className="text-brand-celeste hover:underline font-bold hidden md:block"
          >
            Destacar mi publicación
          </button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="relative h-full overflow-hidden group cursor-pointer hover:shadow-lg transition-all duration-300 bg-background">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <Badge 
                      variant="secondary" 
                      className="bg-brand-dorado/20 text-brand-dorado border-0 font-bold"
                    >
                      {service.category}
                    </Badge>
                    {service.featured && (
                      <Badge 
                        variant="secondary" 
                        className="bg-brand-celeste/20 text-brand-celeste border-0 font-bold"
                      >
                        NUEVO
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-center w-16 h-16 bg-muted rounded-lg mb-4">
                    <service.icon className="w-8 h-8 text-brand-celeste" />
                  </div>

                  <h3 className="text-xl font-heading font-bold text-foreground mb-2 group-hover:text-brand-celeste transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {service.description}
                  </p>
                </div>

                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-brand-celeste to-brand-dorado transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedServices;
