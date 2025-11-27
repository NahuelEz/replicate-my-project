import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { MapPin, Calendar, DollarSign, Percent, TrendingUp, Phone, Mail, Building, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';

const InvestmentDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data, error } = await supabase
          .from('investment_projects')
          .select('*')
          .eq('slug', slug)
          .single();

        if (error) throw error;
        
        setProject(data);
      } catch (error) {
        console.error('Error fetching investment project:', error);
        toast({
          title: 'Error',
          description: 'No se pudo cargar el proyecto de inversión',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [slug, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: '¡Consulta enviada!',
      description: 'Nos contactaremos contigo pronto.'
    });
    
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Proyecto no encontrado</h1>
        <Button onClick={() => navigate('/inversiones')}>Volver a Inversiones</Button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{project.name} - PropiedadesArgentinas.com</title>
        <meta name="description" content={project.description} />
      </Helmet>

      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => navigate('/inversiones')}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Volver a Inversiones
          </Button>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {/* Gallery */}
                <div className="mb-6">
                  <div className="aspect-video rounded-lg overflow-hidden mb-4">
                    <img
                      src={project.images?.[selectedImage] || '/placeholder.svg'}
                      alt={project.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {project.images?.map((image: string, index: number) => (
                      <div
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`aspect-video rounded-lg overflow-hidden cursor-pointer border-2 ${
                          selectedImage === index ? 'border-primary' : 'border-transparent'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${project.name} - ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Title and Status */}
                <div className="mb-6">
                  <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full mb-3 ${
                    project.status === 'En pozo' ? 'bg-yellow-100 text-yellow-800' :
                    project.status === 'En construcción' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {project.status}
                  </span>
                  <h1 className="font-heading text-4xl font-bold mb-2">{project.name}</h1>
                  <p className="text-muted-foreground flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    {project.location}
                  </p>
                </div>

                {/* Key Metrics */}
                <Card className="mb-6">
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <DollarSign className="w-8 h-8 text-primary mx-auto mb-2" />
                        <p className="text-xs text-muted-foreground">Inversión Mínima</p>
                        <p className="font-bold text-lg">USD {project.min_investment?.toLocaleString()}</p>
                      </div>
                      <div className="text-center">
                        <Percent className="w-8 h-8 text-primary mx-auto mb-2" />
                        <p className="text-xs text-muted-foreground">Retorno Anual</p>
                        <p className="font-bold text-lg">{project.annual_return}%</p>
                      </div>
                      <div className="text-center">
                        <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
                        <p className="text-xs text-muted-foreground">Ganancia Capital</p>
                        <p className="font-bold text-lg">{project.capital_gain}%</p>
                      </div>
                      <div className="text-center">
                        <Calendar className="w-8 h-8 text-primary mx-auto mb-2" />
                        <p className="text-xs text-muted-foreground">Entrega</p>
                        <p className="font-bold text-lg">{new Date(project.delivery_date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Description */}
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Descripción del Proyecto</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground whitespace-pre-line">{project.description}</p>
                  </CardContent>
                </Card>

                {/* Unit Types */}
                {project.unit_types && project.unit_types.length > 0 && (
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle>Tipos de Unidades</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {project.unit_types.map((type: string, index: number) => (
                          <div key={index} className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                            <Building className="w-5 h-5 text-primary" />
                            <span className="font-medium">{type}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Modality */}
                <Card>
                  <CardHeader>
                    <CardTitle>Modalidad de Inversión</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{project.modality}</p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Contact Form Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="sticky top-24"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Solicitar Información</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="name">Nombre completo</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Teléfono</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="message">Mensaje</Label>
                        <Textarea
                          id="message"
                          rows={4}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          placeholder="Cuéntanos sobre tu interés en este proyecto..."
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full btn-primary">
                        <Mail className="w-4 h-4 mr-2" />
                        Enviar Consulta
                      </Button>
                    </form>

                    {project.publisher && (
                      <div className="mt-6 pt-6 border-t">
                        <h4 className="font-semibold mb-3">Contacto Directo</h4>
                        {project.publisher.phone && (
                          <a
                            href={`tel:${project.publisher.phone}`}
                            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-2"
                          >
                            <Phone className="w-4 h-4" />
                            {project.publisher.phone}
                          </a>
                        )}
                        {project.publisher.email && (
                          <a
                            href={`mailto:${project.publisher.email}`}
                            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
                          >
                            <Mail className="w-4 h-4" />
                            {project.publisher.email}
                          </a>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvestmentDetail;
