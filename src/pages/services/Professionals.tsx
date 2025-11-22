import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useParams } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { motion } from 'framer-motion';
import { MapPin, Search } from 'lucide-react';
import StarRating from '@/components/StarRating';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ProfessionalCardProps {
  professional: any;
  index: number;
}

const ProfessionalCard = ({ professional, index }: ProfessionalCardProps) => {
  const totalReviews = (professional.profileReviews?.length || 0) + 
                       professional.services.reduce((acc: number, service: any) => acc + (service.reviews?.length || 0), 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-lg overflow-hidden border border-border transition-shadow duration-300 hover:shadow-xl flex flex-col"
    >
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-start mb-4">
          <img  
            src={professional.avatar} 
            alt={professional.name} 
            className="w-20 h-20 rounded-full mr-4 border-2 border-brand-celeste/20"
           />
          <div className="flex-grow">
            <h3 className="text-xl font-bold font-heading text-foreground mb-1">{professional.name}</h3>
            <p className="text-brand-celeste font-semibold">{professional.specialty}</p>
          </div>
        </div>
        <div className="mb-4">
          <StarRating rating={professional.reputation.rating} totalReviews={totalReviews} />
        </div>
        <div className="flex items-center text-muted-foreground mb-6">
          <MapPin className="w-4 h-4 mr-2" />
          <span className="text-sm font-bold">{professional.location}</span>
        </div>
        <div className="mt-auto">
          <Link to={`/servicios/profesionales/${professional.id}`}>
            <Button className="w-full btn-primary">Ver Perfil</Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

const Professionals = () => {
  const { getProfessionalsByCategory } = useData();
  const { categorySlug } = useParams();
  const [professionals, setProfessionals] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const allProfessionals = getProfessionalsByCategory(categorySlug || '');
    const filtered = allProfessionals.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setProfessionals(filtered);
  }, [categorySlug, getProfessionalsByCategory, searchTerm]);

  const categoryName = categorySlug 
    ? categorySlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    : "Todos los Profesionales";

  return (
    <>
      <Helmet>
        <title>{categoryName} - PropiedadesArgentinas.com</title>
      </Helmet>
      <div className="bg-background min-h-screen">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold font-heading text-foreground mb-4">{categoryName}</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Encontrá a los mejores expertos para tu proyecto.
            </p>
          </div>
          <div className="mb-12 max-w-lg mx-auto">
            <div className="relative">
                <Input 
                    type="text"
                    placeholder="Buscar por nombre, especialidad o ubicación..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            </div>
          </div>
          {professionals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {professionals.map((prof, index) => (
                <ProfessionalCard key={prof.id} professional={prof} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
                <p className="text-xl text-muted-foreground">No se encontraron profesionales que coincidan con tu búsqueda.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Professionals;
