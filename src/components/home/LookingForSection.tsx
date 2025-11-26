import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home, Building2, TrendingUp, ArrowRight } from 'lucide-react';
import comprarBg from '@/assets/comprar-bg.jpg';
import alquilarBg from '@/assets/alquilar-bg.jpg';
import invertirBg from '@/assets/invertir-bg.jpg';

const options = [
  {
    icon: Home,
    title: 'Comprar Propiedad',
    description: 'Encontrá tu próximo hogar entre miles de opciones.',
    link: '/comprar',
    image: comprarBg,
  },
  {
    icon: Building2,
    title: 'Alquilar Propiedad',
    description: 'La mejor selección de alquileres temporarios y permanentes.',
    link: '/alquilar',
    image: alquilarBg,
  },
  {
    icon: TrendingUp,
    title: 'Invertir',
    description: 'Asegurá tu futuro con proyectos en pozo y oportunidades únicas.',
    link: '/inversiones',
    image: invertirBg,
  },
];

const LookingForSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {options.map((option, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link to={option.link} className="block group">
                <div className="relative h-80 rounded-lg overflow-hidden shadow-lg">
                  <img 
                    src={option.image} 
                    alt={option.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"></div>
                  
                  <div className="absolute inset-0 p-8 flex flex-col justify-between">
                    <div>
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg mb-4">
                        <option.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2 font-heading">{option.title}</h3>
                      <p className="text-white/90 text-sm mb-4 font-body">{option.description}</p>
                      <div className="flex items-center text-brand-dorado font-bold group-hover:gap-2 transition-all duration-300">
                        <span>Ver más</span>
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </div>
                    </div>
                  </div>
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
