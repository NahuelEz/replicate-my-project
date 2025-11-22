import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const zones = [
  { name: 'Palermo', image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=2670&auto=format&fit=crop', alt:'Vista aérea del barrio de Palermo en Buenos Aires' },
  { name: 'Caballito', image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=2670&auto=format&fit=crop', alt:'Parque Rivadavia en Caballito, Buenos Aires' },
  { name: 'Belgrano', image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=2644&auto=format&fit=crop', alt:'Calle del barrio de Belgrano con grandes árboles' },
  { name: 'Tigre', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2670&auto=format&fit=crop', alt:'Vista del delta del río Tigre con botes' },
  { name: 'Pilar', image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=2687&auto=format&fit=crop', alt:'Casa moderna en un country en Pilar' },
  { name: 'Mar del Plata', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2673&auto=format&fit=crop', alt:'Vista de la costa en Mar del Plata' },
];

interface ZoneCardProps {
  zone: { name: string; image: string; alt: string };
  index: number;
}

const ZoneCard = ({ zone, index }: ZoneCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="relative rounded-lg overflow-hidden h-64 group"
  >
    <Link to={`/comprar?ubicacion=${zone.name}`} className="block h-full w-full">
      <img className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" alt={zone.alt} src={zone.image} />
      <div className="absolute inset-0 bg-black/50 group-hover:bg-black/70 transition-colors"></div>
      <div className="absolute bottom-4 left-4 text-white">
        <h3 className="text-2xl font-bold font-heading">{zone.name}</h3>
      </div>
    </Link>
  </motion.div>
);

const PopularZones = () => {
  const navigate = useNavigate();
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
            Zonas Populares
          </h2>
          <p className="text-lg text-brand-gris-oscuro max-w-2xl mx-auto">
            Explorá las áreas más buscadas y encontrá el lugar perfecto para vivir o invertir.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {zones.map((zone, index) => (
            <ZoneCard key={zone.name} zone={zone} index={index} />
          ))}
        </div>
        <div className="text-center mt-12">
          <Button onClick={() => navigate('/comprar')} variant="outline" className="font-bold border-brand-celeste text-brand-celeste hover:bg-brand-celeste hover:text-white rounded-lg px-8 py-6 text-base transition-all duration-300">
            Ver más zonas
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PopularZones;
