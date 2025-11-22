import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MessageCircle, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Agent {
  name: string;
  company: string;
  avatar?: string;
}

interface ContactCardProps {
  agent: Agent;
  onContact: (type: 'phone' | 'whatsapp' | 'email' | 'form') => void;
}

const ContactCard = ({ agent, onContact }: ContactCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-card rounded-lg p-6 shadow-sm sticky top-8 border"
    >
      <div className="text-center mb-6">
        <img   
          className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
          alt={`${agent.name} - Agente inmobiliario`}
          src={agent.avatar || "https://images.unsplash.com/photo-1575383596664-30f4489f9786"} />
        <h3 className="text-lg font-semibold">{agent.name}</h3>
        <p className="text-muted-foreground">{agent.company}</p>
        <div className="flex items-center justify-center mt-2">
          <Star className="w-4 h-4 text-brand-dorado fill-current" />
          <Star className="w-4 h-4 text-brand-dorado fill-current" />
          <Star className="w-4 h-4 text-brand-dorado fill-current" />
          <Star className="w-4 h-4 text-brand-dorado fill-current" />
          <Star className="w-4 h-4 text-brand-dorado fill-current" />
          <span className="text-sm text-muted-foreground ml-2">5.0 (24 reseñas)</span>
        </div>
      </div>

      <div className="space-y-3">
        <Button
          onClick={() => onContact('phone')}
          className="w-full"
        >
          <Phone className="w-4 h-4 mr-2" />
          Llamar
        </Button>
        <Button
          onClick={() => onContact('whatsapp')}
          variant="outline"
          className="w-full"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          WhatsApp
        </Button>
        <Button
          onClick={() => onContact('email')}
          variant="outline"
          className="w-full"
        >
          <Mail className="w-4 h-4 mr-2" />
          Email
        </Button>
      </div>

      <div className="mt-6 pt-6 border-t">
        <h4 className="font-medium mb-3">Solicitar información</h4>
        <form className="space-y-3">
          <input
            type="text"
            placeholder="Tu nombre"
            className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background"
          />
          <input
            type="email"
            placeholder="Tu email"
            className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background"
          />
          <input
            type="tel"
            placeholder="Tu teléfono"
            className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background"
          />
          <textarea
            placeholder="Mensaje (opcional)"
            rows={3}
            className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background"
          ></textarea>
          <Button
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              onContact('form');
            }}
            className="w-full"
          >
            Enviar consulta
          </Button>
        </form>
      </div>
    </motion.div>
  );
};

export default ContactCard;
