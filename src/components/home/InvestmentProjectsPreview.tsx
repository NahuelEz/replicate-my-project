import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { TrendingUp, MapPin, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface InvestmentProject {
  id: number;
  name: string;
  slug: string;
  location: string;
  status: string;
  deliveryDate: string;
  minInvestment: number;
  annualReturn: number;
  capitalGain: number;
  images: string[];
}

interface InvestmentProjectsPreviewProps {
  projects: InvestmentProject[];
}

const InvestmentProjectsPreview = ({ projects }: InvestmentProjectsPreviewProps) => {
  const navigate = useNavigate();

  return (
    <section className="py-16 bg-brand-gris-oscuro text-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-2">
            Proyectos de Inversión
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Invertí en desarrollos inmobiliarios de alta rentabilidad
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {projects.slice(0, 2).map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => navigate(`/proyecto/${project.slug}`)}
              className="bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden cursor-pointer hover:bg-white/20 transition-all duration-300 border border-white/20"
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={project.images[0]} 
                  alt={project.name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-heading font-bold mb-2">{project.name}</h3>
                <div className="flex items-center text-white/80 mb-4">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="text-sm">{project.location}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-white/60">Rentabilidad anual</p>
                    <p className="text-xl font-bold text-brand-dorado">{project.annualReturn}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-white/60">Valorización</p>
                    <p className="text-xl font-bold text-green-400">{project.capitalGain}%</p>
                  </div>
                </div>
                <div className="flex items-center text-sm text-white/60">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Entrega: {new Date(project.deliveryDate).toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button 
            onClick={() => navigate('/inversiones')} 
            className="btn-secondary px-8 py-6"
          >
            <TrendingUp className="w-5 h-5 mr-2" />
            Ver todos los proyectos
          </Button>
        </div>
      </div>
    </section>
  );
};

export default InvestmentProjectsPreview;
