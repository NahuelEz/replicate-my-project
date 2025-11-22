import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { PlusCircle, Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PublishCTA = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 bg-gradient-to-r from-brand-celeste to-brand-celeste/80 text-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                ¿Tenés una propiedad para vender o alquilar?
              </h2>
              <p className="text-lg text-white/90 mb-6">
                Publicá gratis y llegá a miles de potenciales compradores e inquilinos en toda Argentina.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={() => navigate('/publicar')}
                  className="bg-white text-brand-celeste hover:bg-white/90 font-bold py-6 px-8"
                >
                  <PlusCircle className="w-5 h-5 mr-2" />
                  Publicar Propiedad
                </Button>
                <Button 
                  onClick={() => navigate('/para-inmobiliarias')}
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-brand-celeste font-bold py-6 px-8"
                >
                  <Building className="w-5 h-5 mr-2" />
                  Para Inmobiliarias
                </Button>
              </div>
            </div>
            <div className="hidden md:block">
              <img 
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600" 
                alt="Publicar propiedad"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PublishCTA;
