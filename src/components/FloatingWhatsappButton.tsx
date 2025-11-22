import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

interface Agent {
  whatsapp?: string;
}

interface Property {
  code: string;
  title: string;
}

interface FloatingWhatsappButtonProps {
  agent: Agent;
  property: Property;
}

const FloatingWhatsappButton = ({ agent, property }: FloatingWhatsappButtonProps) => {
  if (!agent || !agent.whatsapp) {
    return null;
  }

  const message = encodeURIComponent(
    `Hola, te contacto desde PropiedadesArgentinas.com. Estoy interesado/a en la propiedad con código ${property.code} (${property.title}).`
  );

  const whatsappLink = `https://wa.me/${agent.whatsapp}?text=${message}`;

  return (
    <motion.a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, duration: 0.5, type: 'spring' }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-6 right-6 bg-green-500 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg z-50 hover:bg-green-600 transition-colors"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle className="w-8 h-8" />
    </motion.a>
  );
};

export default FloatingWhatsappButton;
