import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const HeroSection = () => {
  const navigate = useNavigate();
  const [operation, setOperation] = useState('comprar');
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [rentalType, setRentalType] = useState('tradicional');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let path = '/';
    if (operation === 'comprar') {
        path = propertyType ? `/comprar/${propertyType}` : '/comprar';
    } else if (operation === 'alquilar') {
        if (rentalType === 'temporal') {
            path = propertyType ? `/alquiler-temporal/${propertyType}` : '/alquiler-temporal';
        } else {
            path = propertyType ? `/alquilar/${propertyType}` : '/alquilar';
        }
    } else if (operation === 'invertir') {
        path = '/inversiones';
    }

    if (location) {
      path = `${path}/${location.toLowerCase().replace(/ /g, '-')}`;
    }
    
    navigate(path);
  };

  return (
    <section className="relative py-24 md:py-32 bg-white">
      <div className="absolute inset-0 h-full w-full">
         <img className="h-full w-full object-cover" alt="Moderno edificio de apartamentos con balcones de cristal" src="https://images.unsplash.com/photo-1696550876347-fc196ae0cfdc" />
      </div>
      <div className="absolute inset-0 bg-black/60 z-10"></div>
      <div className="container mx-auto px-4 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 font-heading" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.7)' }}>
            <span style={{color: '#f4b847'}}>Tu próximo hogar</span> está acá
          </h1>
          <p className="text-lg text-white mb-8 font-body" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.7)' }}>
            El portal número uno para comprar, alquilar e invertir en propiedades en Argentina.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto bg-white/95 backdrop-blur-sm p-4 sm:p-6 rounded-xl shadow-lg border"
        >
          <div className="flex justify-center mb-4">
            {['comprar', 'alquilar', 'invertir'].map(op => (
                <Button 
                    key={op}
                    onClick={() => setOperation(op)}
                    variant="ghost"
                    className={`capitalize font-bold text-lg rounded-full px-6 transition-all duration-300 ${operation === op ? 'bg-brand-celeste text-white shadow-md' : 'text-gray-600'}`}
                >
                    {op}
                </Button>
            ))}
          </div>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            {operation === 'alquilar' && (
              <Select value={rentalType} onValueChange={setRentalType}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de Alquiler" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tradicional">Alquiler Tradicional</SelectItem>
                  <SelectItem value="temporal">Alquiler Temporal</SelectItem>
                </SelectContent>
              </Select>
            )}

            <div className={`relative ${operation === 'alquilar' ? 'md:col-span-1' : 'md:col-span-2'}`}>
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <Input 
                type="text" 
                placeholder="Ubicación, barrio o ciudad..." 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-10"
              />
            </div>
            
            <Select value={propertyType} onValueChange={setPropertyType} disabled={operation === 'invertir'}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo de Propiedad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="departamento">Departamento</SelectItem>
                <SelectItem value="casa">Casa</SelectItem>
                <SelectItem value="ph">PH</SelectItem>
                <SelectItem value="terreno">Terreno</SelectItem>
                <SelectItem value="oficina">Oficina</SelectItem>
                <SelectItem value="local">Local</SelectItem>
              </SelectContent>
            </Select>
            
            <Button type="submit" className="btn-primary w-full h-full text-base">
              <Search className="mr-2" size={20} />
              Buscar
            </Button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
