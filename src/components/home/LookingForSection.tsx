import React from 'react';
import { motion } from 'framer-motion';
import { Home, Key, TrendingUp, Wrench } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const options = [
  {
    icon: Home,
    title: 'Comprar',
    description: 'Encontrá tu casa o departamento ideal',
    link: '/comprar',
    color: 'text-brand-celeste'
  },
  {
    icon: Key,
    title: 'Alquilar',
    description: 'Descubrí opciones de alquiler',
    link: '/alquilar',
    color: 'text-brand-dorado'
  },
  {
    icon: TrendingUp,
    title: 'Invertir',
    description: 'Proyectos con alta rentabilidad',
    link: '/inversiones',
    color: 'text-green-600'
  },
  {
    icon: Wrench,
    title: 'Servicios',
    description: 'Profesionales para tu proyecto',
    link: '/servicios',
    color: 'text-purple-600'
  },
];

const LookingForSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-2">
            ¿Qué estás buscando?
          </h2>
          <p className="text-lg text-muted-foreground">
            Elegí la opción que mejor se adapte a tus necesidades
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {options.map((option, index) => (
            <motion.div
              key={option.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => navigate(option.link)}
              className="bg-white p-8 rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer card-hover border border-border"
            >
              <option.icon className={`w-12 h-12 ${option.color} mb-4`} />
              <h3 className="text-xl font-heading font-bold text-foreground mb-2">
                {option.title}
              </h3>
              <p className="text-muted-foreground">
                {option.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LookingForSection;
