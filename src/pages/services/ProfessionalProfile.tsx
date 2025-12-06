import React from 'react';
import { Helmet } from 'react-helmet';
import { useParams, Link } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { motion } from 'framer-motion';
import { MapPin, Briefcase, MessageSquare } from 'lucide-react';
import StarRating from '@/components/StarRating';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";

interface ServiceCardProps {
  service: {
    id: string;
    title: string;
    description: string;
    rating: number;
    reviews: any[];
  };
  professionalId: string;
}

const ServiceCard = ({ service, professionalId }: ServiceCardProps) => (
  <div className="bg-white rounded-lg p-4 border border-border hover:shadow-md transition-shadow">
    <h4 className="font-bold font-heading text-lg text-foreground">{service.title}</h4>
    <p className="text-muted-foreground my-2 text-sm line-clamp-2">{service.description}</p>
    <StarRating rating={service.rating} totalReviews={service.reviews.length} size="sm" />
    <Link to={`/servicio/${professionalId}/${service.id}`} className="mt-3">
      <Button variant="link" className="p-0 h-auto text-brand-celeste">Ver detalles</Button>
    </Link>
  </div>
);

interface ReviewCardProps {
  review: {
    id: string;
    author: string;
    rating: number;
    comment: string;
    date: string;
  };
}

const ReviewCard = ({ review }: ReviewCardProps) => (
  <div className="bg-muted p-4 rounded-lg">
    <div className="flex items-center mb-2">
      <p className="font-bold mr-4">{review.author}</p>
      <StarRating rating={review.rating} size="sm" />
    </div>
    <p className="text-foreground">{review.comment}</p>
    <p className="text-xs text-muted-foreground mt-2">{new Date(review.date).toLocaleDateString()}</p>
  </div>
);

const ProfessionalProfile = () => {
  const { professionalId } = useParams();
  const { getProfessionalById } = useData();
  const { toast } = useToast();
  const professional = getProfessionalById(professionalId || '');

  if (!professional) {
    return <div className="text-center py-20">Profesional no encontrado.</div>;
  }

  const handleContact = () => {
    toast({
      title: "Funcionalidad no implementada",
      description: "🚧 ¡Esta función aún no está lista, pero puedes solicitarla en tu próximo prompt! 🚀",
    });
  };

  const totalReviews = (professional.profileReviews?.length || 0) + 
                     professional.services.reduce((acc, service) => acc + (service.reviews?.length || 0), 0);

  return (
    <>
      <Helmet>
        <title>{professional.name} - Perfil Profesional</title>
      </Helmet>
      <div className="bg-background min-h-screen">
        <div className="container mx-auto px-4 py-12">
          {/* Header Perfil */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-xl shadow-lg mb-8"
          >
            <div className="flex flex-col md:flex-row items-center">
              <img src={professional.avatar} alt={professional.name} className="w-32 h-32 rounded-full mb-6 md:mb-0 md:mr-8 border-4 border-brand-celeste" />
              <div className="flex-grow text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-bold font-heading text-foreground">{professional.name}</h1>
                <p className="text-xl text-brand-celeste font-semibold my-2">{professional.specialty}</p>
                <div className="flex items-center justify-center md:justify-start text-muted-foreground mb-2">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>{professional.location}</span>
                </div>
                <StarRating rating={professional.reputation.rating} totalReviews={totalReviews} size="lg"/>
              </div>
              <div className="mt-6 md:mt-0 md:ml-8">
                <Button onClick={handleContact} className="btn-secondary w-full">Contactar</Button>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Columna Izquierda - Servicios */}
            <div className="lg:col-span-2">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white p-6 rounded-xl shadow-lg"
              >
                <h2 className="text-2xl font-bold font-heading mb-4 flex items-center"><Briefcase className="mr-3 text-brand-celeste" />Servicios Ofrecidos</h2>
                {professional.services.length > 0 ? (
                  <div className="space-y-4">
                    {professional.services.map(service => (
                      <ServiceCard key={service.id} service={service} professionalId={professional.id} />
                    ))}
                  </div>
                ) : (
                  <p>Este profesional no ha publicado servicios todavía.</p>
                )}
              </motion.div>
            </div>
            {/* Columna Derecha - Opiniones del Perfil */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }} 
                className="bg-white p-6 rounded-xl shadow-lg"
              >
                <h2 className="text-2xl font-bold font-heading mb-4 flex items-center"><MessageSquare className="mr-3 text-brand-dorado" />Opiniones sobre el Profesional</h2>
                {professional.profileReviews && professional.profileReviews.length > 0 ? (
                  <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                    {professional.profileReviews.map(review => (
                      <ReviewCard key={review.id} review={review} />
                    ))}
                  </div>
                ) : (
                  <p>Todavía no hay opiniones sobre este profesional.</p>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfessionalProfile;
