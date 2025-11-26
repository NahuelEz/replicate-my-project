import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const CTABanner = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-heading">
            Tu próximo hogar está acá
          </h2>
          <p className="text-lg text-muted-foreground mb-8 font-body">
            Empezá tu búsqueda y encontrá la propiedad que siempre soñaste.
          </p>
          <Button
            onClick={() => navigate('/comprar')}
            size="lg"
            className="bg-brand-celeste hover:bg-brand-celeste/90 text-white font-bold px-8 py-6 text-lg"
          >
            Buscar ahora
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default CTABanner;
