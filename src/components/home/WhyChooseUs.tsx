import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, Award, Clock } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Seguridad Garantizada',
    description: 'Todas las propiedades verificadas y con documentación en regla.',
  },
  {
    icon: Users,
    title: 'Asesoramiento Profesional',
    description: 'Equipo de expertos para guiarte en cada paso del proceso.',
  },
  {
    icon: Award,
    title: 'Mejores Oportunidades',
    description: 'Acceso exclusivo a las propiedades más destacadas del mercado.',
  },
  {
    icon: Clock,
    title: 'Atención 24/7',
    description: 'Estamos disponibles cuando nos necesites.',
  },
];

const WhyChooseUs = () => {
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
            ¿Por qué elegirnos?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Somos tu mejor aliado en la búsqueda de propiedades
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-brand-celeste/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-8 h-8 text-brand-celeste" />
              </div>
              <h3 className="text-xl font-heading font-bold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
