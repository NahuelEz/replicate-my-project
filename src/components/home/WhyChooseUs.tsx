import React from 'react';
import { motion } from 'framer-motion';
import { Award, Users, TrendingUp, HeartHandshake } from 'lucide-react';

const features = [
  {
    icon: Award,
    title: 'Publicación Gratuita',
    description: 'Destacá tu propiedad sin costos iniciales y llegá a miles de interesados.',
  },
  {
    icon: Users,
    title: 'Comunidad Confiable',
    description: 'Unite a más de 10,000 usuarios registrados que confían en nuestra plataforma.',
  },
  {
    icon: TrendingUp,
    title: 'Inversiones Validadas',
    description: 'Accedé a proyectos con retorno de inversión analizado por nuestros expertos.',
  },
  {
    icon: HeartHandshake,
    title: 'Contacto Directo',
    description: 'Comunicate sin intermediarios con anunciantes y acelerá tu búsqueda.',
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-brand-gris-oscuro mb-2">
            ¿Por qué elegir Propiedades Argentinas?
          </h2>
          <p className="text-lg text-brand-gris-oscuro max-w-2xl mx-auto">
            Te ofrecemos las mejores herramientas para que tu experiencia sea única.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center p-6"
            >
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-brand-celeste/10 mx-auto mb-4">
                <feature.icon className="w-8 h-8 text-brand-celeste" />
              </div>
              <h3 className="text-xl font-bold font-heading mb-2">{feature.title}</h3>
              <p className="text-brand-gris-oscuro">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
