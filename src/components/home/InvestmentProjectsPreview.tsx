import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { TrendingUp, MapPin, Calendar } from 'lucide-react';

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

interface InvestmentProjectCardProps {
  project: InvestmentProject;
}

const InvestmentProjectCard = ({ project }: InvestmentProjectCardProps) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
      className="bg-white rounded-lg overflow-hidden border border-gray-200 transition-shadow duration-300 flex flex-col h-full"
    >
      <Link to={`/proyecto/${project.slug}`} className="block flex flex-col h-full">
        <div className="relative aspect-w-4 aspect-h-3">
          <img 
            className="w-full h-full object-cover" 
            alt={project.name}
            src={project.images[0] || "https://images.unsplash.com/photo-1595872018818-97555653a011"} />
          <div className="absolute top-2 left-2 bg-brand-dorado text-white px-2 py-1 rounded text-xs font-bold">
            INVERSIÓN
          </div>
        </div>

        <div className="p-4 flex flex-col flex-grow">
          <div className="flex-grow">
            <h3 className="text-lg font-bold font-heading text-brand-gris-oscuro mb-2 h-14 line-clamp-2">
              {project.name}
            </h3>
            <div className="flex items-center text-gray-500 mb-3">
              <MapPin className="w-4 h-4 mr-2" />
              <span className="text-sm font-bold">{project.location}</span>
            </div>
          </div>
          
          <div className="border-t border-gray-100 pt-3 mt-auto space-y-2">
            <div className="flex justify-between items-center text-gray-600 text-sm">
              <div className="flex items-center">
                <TrendingUp className="w-4 h-4 mr-2 text-green-500" />
                <span>Retorno Anual</span>
              </div>
              <span className="font-bold text-green-600">{project.annualReturn}%</span>
            </div>
            <div className="flex justify-between items-center text-gray-600 text-sm">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                <span>Entrega</span>
              </div>
              <span className="font-bold text-blue-600">{new Date(project.deliveryDate).getFullYear()}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

interface InvestmentProjectsPreviewProps {
  projects: InvestmentProject[];
}

const InvestmentProjectsPreview = ({ projects }: InvestmentProjectsPreviewProps) => {
  const navigate = useNavigate();

  if (!projects || projects.length === 0) {
    return null;
  }

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
            Proyectos para Inversores
          </h2>
          <p className="text-lg text-brand-gris-oscuro max-w-2xl mx-auto">
            Oportunidades de inversión con alta rentabilidad y respaldo.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.slice(0, 3).map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <InvestmentProjectCard project={project} />
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button onClick={() => navigate('/inversiones')} className="btn-secondary">
            Ver más proyectos de inversión
          </Button>
        </div>
      </div>
    </section>
  );
};

export default InvestmentProjectsPreview;
