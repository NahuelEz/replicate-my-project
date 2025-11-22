import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Constructora del Sur S.A.',
    role: 'Desarrollador',
    quote: 'Publicar nuestros proyectos en Propiedades Argentinas fue un antes y un después. La visibilidad que obtuvimos nos conectó con inversores de todo el país.',
    rating: 5,
    avatar: 'https://i.pravatar.cc/150?u=constructora-sur'
  },
  {
    name: 'Familia Gómez',
    role: 'Compradores',
    quote: '¡Encontramos la casa de nuestros sueños en menos de un mes! El proceso fue súper simple y el contacto con la inmobiliaria, inmediato. ¡Totalmente recomendados!',
    rating: 5,
    avatar: 'https://i.pravatar.cc/150?u=familia-gomez'
  },
  {
    name: 'Estudio Jurídico Diaz & Asoc.',
    role: 'Inquilinos',
    quote: 'Alquilamos nuestra nueva oficina a través del portal. Los filtros de búsqueda nos ayudaron a encontrar el espacio perfecto para nuestro equipo. Excelente plataforma.',
    rating: 4,
    avatar: 'https://i.pravatar.cc/150?u=estudio-diaz'
  },
];

interface StarRatingProps {
  rating: number;
}

const StarRating = ({ rating }: StarRatingProps) => (
  <div className="flex">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${i < rating ? 'text-brand-dorado fill-current' : 'text-gray-300'}`}
      />
    ))}
  </div>
);

const Testimonials = () => {
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
            La experiencia de nuestros usuarios
          </h2>
          <p className="text-lg text-brand-gris-oscuro max-w-2xl mx-auto">
            Descubrí por qué miles de personas confían en nosotros para sus negocios inmobiliarios.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-8 rounded-lg shadow-md flex flex-col"
            >
              <Quote className="w-8 h-8 text-brand-celeste mb-4" />
              <p className="text-brand-gris-oscuro flex-grow mb-6">"{testimonial.quote}"</p>
              <div className="flex items-center mt-auto">
                <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full mr-4" />
                <div className="flex-grow">
                  <h4 className="font-bold font-heading">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
                <StarRating rating={testimonial.rating} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
