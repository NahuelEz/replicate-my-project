import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const PublishCTA = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="fixed bottom-4 right-4 z-50"
    >
      <Button 
        onClick={() => navigate('/publicar')}
        className="btn-secondary shadow-lg text-base md:text-lg px-6 py-6"
      >
        Publicar propiedad
      </Button>
    </motion.div>
  );
};

export default PublishCTA;
