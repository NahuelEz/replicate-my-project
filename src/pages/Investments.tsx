import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { MapPin, TrendingUp, Calendar, DollarSign, Percent } from 'lucide-react';
import { motion } from 'framer-motion';

const Investments = () => {
  const navigate = useNavigate();
  const { investmentProjects } = useData();

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
            Proyectos de Inversión
          </h1>
          <p className="text-muted-foreground text-lg mb-8">
            Invertí en desarrollos inmobiliarios con alta rentabilidad
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {investmentProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer card-hover"
                onClick={() => navigate(`/proyecto/${project.slug}`)}
              >
                <div className="h-64 overflow-hidden">
                  <img
                    src={project.images[0]}
                    alt={project.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full mb-3 ${
                    project.status === 'En pozo' ? 'bg-yellow-100 text-yellow-800' :
                    project.status === 'En construcción' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {project.status}
                  </span>
                  <h3 className="font-heading text-2xl font-bold mb-2">{project.name}</h3>
                  <p className="text-muted-foreground flex items-center gap-2 mb-4">
                    <MapPin className="w-4 h-4 text-primary" />
                    {project.location}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Entrega</p>
                        <p className="text-sm font-semibold">{new Date(project.deliveryDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Desde</p>
                        <p className="text-sm font-semibold">USD {project.minInvestment.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Percent className="w-4 h-4 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Retorno</p>
                        <p className="text-sm font-semibold">{project.annualReturn}%</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Ganancia</p>
                        <p className="text-sm font-semibold">{project.capitalGain}%</p>
                      </div>
                    </div>
                  </div>
                  
                  <Button className="w-full btn-primary">Ver más detalles</Button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Investments;
