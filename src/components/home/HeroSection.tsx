import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/comprar?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <section className="relative bg-gradient-to-r from-brand-celeste to-brand-celeste/80 text-white py-20 md:py-32">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6">
            Encontrá tu hogar ideal
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90">
            Miles de propiedades en venta y alquiler en toda Argentina
          </p>

          {/* Search Bar */}
          <div className="bg-white rounded-lg p-2 shadow-xl max-w-2xl mx-auto">
            <div className="flex flex-col md:flex-row gap-2">
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Buscar por ubicación, barrio..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10 h-12 border-0 focus-visible:ring-0 text-foreground"
                />
              </div>
              <Button onClick={handleSearch} className="btn-primary h-12 px-8">
                <Search className="w-5 h-5 mr-2" />
                Buscar
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
