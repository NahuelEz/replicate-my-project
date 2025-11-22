import React from 'react';
import { motion } from 'framer-motion';

interface PropertyDescriptionProps {
  description: string;
}

const PropertyDescription = ({ description }: PropertyDescriptionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="bg-card rounded-lg p-6 shadow-sm border"
    >
      <h2 className="text-xl font-semibold mb-4">Descripción</h2>
      <div className="text-foreground leading-relaxed whitespace-pre-line">
        {description}
      </div>
    </motion.div>
  );
};

export default PropertyDescription;
