import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home, Building, Briefcase, Wrench } from 'lucide-react';

const options = [
  {
    icon: Home,
    title: 'Comprar una propiedad',
    link: '/comprar',
  },
  {
    icon: Building,
    title: 'Alquilar',
    link: '/alquilar',
  },
  {
    icon: Briefcase,
    title: 'Invertir en un desarrollo',
    link: '/inversiones',
  },
  {
    icon: Wrench,
    title: 'Necesito un servicio',
    link: '/servicios',
  },
];

const LookingForSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-brand-gris-oscuro mb-2">
            ¿Qué estás buscando hoy?
          </h2>
          <p className="text-lg text-brand-gris-oscuro max-w-2xl mx-auto">
            Encontrá todo lo que necesitás en un solo lugar.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {options.map((option, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link to={option.link}>
                <div className="bg-gray-50 p-8 rounded-lg text-center h-full transition-all duration-300 hover:bg-brand-celeste hover:text-white hover:shadow-xl hover:-translate-y-2 group">
                  <option.icon className="w-16 h-16 mx-auto mb-4 text-brand-celeste transition-colors duration-300 group-hover:text-white" />
                  <h3 className="text-xl font-bold font-heading">{option.title}</h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LookingForSection;
