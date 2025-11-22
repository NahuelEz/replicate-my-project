import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'María González',
    location: 'Palermo, CABA',
    rating: 5,
    comment: 'Excelente servicio. Encontré mi departamento ideal en menos de un mes. El equipo fue muy profesional y atento durante todo el proceso.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200'
  },
  {
    id: 2,
    name: 'Carlos Rodríguez',
    location: 'Nordelta, Buenos Aires',
    rating: 5,
    comment: 'La plataforma es muy fácil de usar y tiene una gran variedad de propiedades. Compré mi casa gracias a PropiedadesArgentinas.com.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200'
  },
  {
    id: 3,
    name: 'Laura Martínez',
    location: 'Belgrano, CABA',
    rating: 5,
    comment: 'Invertí en un proyecto y la rentabilidad superó mis expectativas. Muy recomendable para inversores.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200'
  },
];

const Testimonials = () => {
  return (
    <section className="py-16 bg-muted">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-2">
            Lo que dicen nuestros clientes
          </h2>
          <p className="text-lg text-muted-foreground">
            Miles de personas confían en nosotros
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-6 rounded-lg shadow-sm border border-border relative"
            >
              <Quote className="absolute top-4 right-4 w-8 h-8 text-brand-celeste/20" />
              <div className="flex items-center mb-4">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                />
                <div>
                  <h4 className="font-heading font-bold text-foreground">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                </div>
              </div>
              <div className="flex mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-brand-dorado text-brand-dorado" />
                ))}
              </div>
              <p className="text-muted-foreground italic">"{testimonial.comment}"</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
