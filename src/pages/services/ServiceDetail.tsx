import React from 'react';
import { Helmet } from 'react-helmet';
import { useParams, Link } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, DollarSign, MessageSquare } from 'lucide-react';
import StarRating from '@/components/StarRating';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";

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
  <div className="bg-muted p-4 rounded-lg border">
    <div className="flex items-center mb-2">
      <p className="font-bold mr-4">{review.author}</p>
      <StarRating rating={review.rating} size="sm" />
    </div>
    <p className="text-foreground">{review.comment}</p>
    <p className="text-xs text-muted-foreground mt-2">{new Date(review.date).toLocaleDateString()}</p>
  </div>
);

const ServiceDetail = () => {
  const { professionalId, serviceId } = useParams();
  const { getProfessionalById } = useData();
  const { toast } = useToast();
  
  const professional = getProfessionalById(professionalId || '');
  const service = professional?.services.find(s => s.id === serviceId);

  if (!professional || !service) {
    return <div className="text-center py-20">Servicio no encontrado.</div>;
  }

  const handleContact = () => {
    toast({
      title: "Funcionalidad no implementada",
      description: "🚧 ¡Esta función aún no está lista, pero puedes solicitarla en tu próximo prompt! 🚀",
    });
  };

  return (
    <>
      <Helmet>
        <title>{service.title} - {professional.name}</title>
      </Helmet>
      <div className="bg-background min-h-screen">
        <div className="container mx-auto px-4 py-12">
          <Link to={`/servicios/profesionales/${professionalId}`} className="text-brand-celeste hover:underline flex items-center mb-6 font-semibold">
            <ArrowLeft className="w-4 h-4 mr-2" /> Volver al perfil de {professional.name}
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Columna principal */}
            <div className="lg:col-span-2">
              <motion.div initial={{ opacity: 0, y:20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="relative mb-6 rounded-lg overflow-hidden" style={{paddingTop: '56.25%'}}>
                     <img src={service.images[0]} alt={service.title} className="absolute top-0 left-0 w-full h-full object-cover"/>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold font-heading text-foreground mb-4">{service.title}</h1>
                <div className="flex items-center space-x-6 text-muted-foreground mb-6">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-brand-celeste" />
                    <span>Entrega: {service.deliveryTime}</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="w-5 h-5 mr-2 text-green-500" />
                    <span>{service.priceRange}</span>
                  </div>
                </div>
                <p className="text-lg text-foreground leading-relaxed">{service.description}</p>
              </motion.div>
            </div>
            {/* Columna lateral */}
            <div className="lg:col-span-1">
                 <motion.div initial={{ opacity: 0, y:20 }} animate={{ opacity: 1, y: 0 }} transition={{delay: 0.2}} className="sticky top-24">
                <div className="bg-muted p-6 rounded-xl border">
                  <h3 className="text-2xl font-bold font-heading mb-4">Información del Servicio</h3>
                  <Button onClick={handleContact} size="lg" className="w-full btn-secondary mb-6">Contactar por este servicio</Button>
                  
                  <h4 className="font-bold font-heading mb-2 text-lg flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2 text-brand-dorado" />
                    Opiniones sobre este servicio
                  </h4>
                  
                  <div className="mb-4">
                    <StarRating rating={service.rating} totalReviews={service.reviews.length} />
                  </div>

                  {service.reviews.length > 0 ? (
                    <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                      {service.reviews.map((review: any) => (
                        <ReviewCard key={review.id} review={review} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Aún no hay opiniones para este servicio.</p>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ServiceDetail;
