import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Calculator, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuickActionsProps {
  onContact: (type: 'visit' | 'financing' | 'similar') => void;
}

const QuickActions = ({ onContact }: QuickActionsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="bg-card rounded-lg p-6 shadow-sm border"
    >
      <h3 className="text-lg font-semibold mb-4">Acciones rápidas</h3>
      <div className="space-y-3">
        <Button
          onClick={() => onContact('visit')}
          variant="outline"
          className="w-full justify-start"
        >
          <Calendar className="w-4 h-4 mr-2" />
          Agendar visita
        </Button>
        <Button
          onClick={() => onContact('financing')}
          variant="outline"
          className="w-full justify-start"
        >
          <Calculator className="w-4 h-4 mr-2" />
          Calcular financiación
        </Button>
        <Button
          onClick={() => onContact('similar')}
          variant="outline"
          className="w-full justify-start"
        >
          <Search className="w-4 h-4 mr-2" />
          Ver propiedades similares
        </Button>
      </div>
    </motion.div>
  );
};

export default QuickActions;
