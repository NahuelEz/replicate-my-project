import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Share2, Heart, ArrowLeft, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import PropertyGallery from '@/components/PropertyGallery';
import PropertyHeader from '@/components/PropertyHeader';
import PropertyDetails from '@/components/PropertyDetails';
import PropertyDescription from '@/components/PropertyDescription';
import PropertyAmenities from '@/components/PropertyAmenities';
import PropertyMap from '@/components/PropertyMap';
import QuickActions from '@/components/QuickActions';

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { properties, favorites, toggleFavorite } = useData();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const property = properties.find((p) => p.id === Number(id));
  const isFavorite = favorites.some((fav) => fav.id === Number(id));

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Propiedad no encontrada</h1>
          <Button onClick={() => navigate(-1)}>Volver</Button>
        </div>
      </div>
    );
  }

  const images = property.images || [property.image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800'];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: property.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: 'Enlace copiado',
        description: 'El enlace ha sido copiado al portapapeles',
      });
    }
  };

  const handleFavorite = () => {
    toggleFavorite(property);
    toast({
      title: isFavorite ? 'Eliminado de favoritos' : 'Agregado a favoritos',
      description: isFavorite
        ? 'La propiedad ha sido eliminada de tus favoritos'
        : 'La propiedad ha sido agregada a tus favoritos',
    });
  };

  const handleContact = (type: 'visit' | 'financing' | 'similar' | string) => {
    const messages: Record<string, string> = {
      visit: 'Agendar visita',
      financing: 'Calcular financiación',
      similar: 'Ver propiedades similares',
      gallery: 'Ver en pantalla completa',
    };
    toast({
      title: messages[type] || 'Contactar',
      description: 'Esta funcionalidad estará disponible próximamente',
    });
  };

  const handleContactDirect = async (type: 'call' | 'message') => {
    if (type === 'call') {
      toast({
        title: 'Llamar',
        description: 'Funcionalidad de llamada disponible próximamente',
      });
    } else {
      // Message functionality
      if (!user) {
        toast({
          title: 'Iniciar sesión',
          description: 'Debes iniciar sesión para enviar mensajes',
          variant: 'destructive',
        });
        navigate('/auth');
        return;
      }

      if (!property) return;

      // Check if conversation already exists
      try {
        const { data: existingConv } = await supabase
          .from('conversations')
          .select('id')
          .eq('property_id', property.id.toString())
          .eq('owner_id', 'OWNER_USER_ID') // TODO: Get actual owner from property
          .eq('participant_id', user.id)
          .maybeSingle();

        if (existingConv) {
          navigate(`/mensajes/${existingConv.id}`);
          return;
        }

        // Create new conversation
        const { data: newConv, error } = await supabase
          .from('conversations')
          .insert({
            property_id: property.id.toString(),
            property_title: property.title,
            owner_id: 'OWNER_USER_ID', // TODO: Get actual owner from property
            participant_id: user.id,
          })
          .select()
          .single();

        if (error) throw error;

        navigate(`/mensajes/${newConv.id}`);
      } catch (error: any) {
        console.error('Error creating conversation:', error);
        toast({
          title: 'Error',
          description: 'Error al iniciar conversación',
          variant: 'destructive',
        });
      }
    }
  };

  // Prepare data for PropertyHeader
  const headerData = {
    title: property.title,
    fullAddress: property.location,
    views: Math.floor(Math.random() * 1000) + 100,
    publishDate: new Date().toISOString(),
    code: `PROP-${property.id}`,
    price: property.price,
    pricePerM2: `USD ${Math.floor(parseInt(property.price.replace(/[^0-9]/g, '')) / property.area)}/m²`,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    area: property.area,
    parking: property.garage || 0,
  };

  // Prepare data for PropertyDetails
  const detailsData = {
    type: property.type || 'Departamento',
    area: property.area,
    coveredArea: property.coveredSurface || property.area - 10,
    floor: 'N/A',
    orientation: 'N/A',
    age: 0,
    expenses: 'Consultar',
    features: {
      heating: 'Central',
      flooring: 'Porcelanato',
      windows: 'PVC DVH',
    },
  };

  const amenities = [
    'Piscina',
    'Gimnasio',
    'Seguridad 24hs',
    'Salón de usos múltiples',
  ];

  return (
    <>
      <Helmet>
        <title>{property.title} - PropiedadesArgentinas.com</title>
        <meta name="description" content={property.description || `${property.title} en ${property.location}`} />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>

          <PropertyGallery
            images={images}
            title={property.title}
            currentImageIndex={currentImageIndex}
            onNextImage={() => setCurrentImageIndex((prev) => (prev + 1) % images.length)}
            onPrevImage={() => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)}
            onFavoriteClick={handleFavorite}
            onShare={handleShare}
            onContact={handleContact}
            isFavorite={isFavorite}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <div className="lg:col-span-2 space-y-6">
              <PropertyHeader property={headerData} />
              <PropertyDetails property={detailsData} />
              <PropertyDescription description={property.description || 'Hermosa propiedad ubicada en una zona privilegiada. Cuenta con excelente iluminación natural y acabados de primera calidad. Ideal para quienes buscan comodidad y ubicación estratégica.'} />
              <PropertyAmenities amenities={amenities} />
              <PropertyMap
                location={property.location}
              />
            </div>

            <div className="space-y-6">
              <div className="bg-card rounded-lg p-6 shadow-sm border sticky top-6">
                <h3 className="text-lg font-semibold mb-4">Contactar</h3>
                <div className="space-y-3">
                  <Button
                    onClick={() => handleContactDirect('call')}
                    className="w-full"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Llamar
                  </Button>
                  <Button
                    onClick={() => handleContactDirect('message')}
                    variant="outline"
                    className="w-full"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Enviar mensaje
                  </Button>
                  <Button
                    onClick={handleShare}
                    variant="outline"
                    className="w-full"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Compartir
                  </Button>
                  <Button
                    onClick={handleFavorite}
                    variant={isFavorite ? 'default' : 'outline'}
                    className="w-full"
                  >
                    <Heart className={`w-4 h-4 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
                    {isFavorite ? 'En favoritos' : 'Guardar'}
                  </Button>
                </div>
              </div>

              <QuickActions onContact={handleContact} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PropertyDetail;
