import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Home, Upload } from 'lucide-react';
import PageLoader from '@/components/PageLoader';

const PublishProperty = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isAdmin, isRealEstateAgent, loading: roleLoading } = useUserRole();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    operation: 'venta',
    type: 'departamento',
    location: '',
    price: '',
    area: '',
    bedrooms: '',
    bathrooms: '',
    garage: '',
    rental_type: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: 'Error',
        description: 'Debes iniciar sesión para publicar una propiedad',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const { error } = await supabase.from('properties').insert({
        user_id: user.id,
        title: formData.title,
        description: formData.description,
        operation: formData.operation,
        type: formData.type,
        location: formData.location,
        price: formData.price,
        area: parseFloat(formData.area),
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        garage: formData.garage ? parseInt(formData.garage) : null,
        rental_type: formData.operation === 'alquiler' ? formData.rental_type : null,
        slug,
        status: 'activa',
      });

      if (error) throw error;

      toast({
        title: '¡Éxito!',
        description: 'Tu propiedad ha sido publicada correctamente',
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Error publishing property:', error);
      toast({
        title: 'Error',
        description: 'No se pudo publicar la propiedad. Verifica que tengas los permisos necesarios.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (roleLoading) {
    return <PageLoader />;
  }

  if (!user || (!isAdmin && !isRealEstateAgent)) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Home className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
        <h1 className="text-2xl font-bold mb-2">Acceso Restringido</h1>
        <p className="text-muted-foreground mb-6">
          Solo agentes inmobiliarios y administradores pueden publicar propiedades.
        </p>
        <Button onClick={() => navigate('/contact')}>Contactar para ser agente</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-6 h-6" />
            Publicar Propiedad
          </CardTitle>
          <CardDescription>
            Completa el formulario para publicar tu propiedad en la plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ej: Departamento moderno en Miraflores"
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe las características de la propiedad..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="operation">Operación *</Label>
                <Select
                  value={formData.operation}
                  onValueChange={(value) => setFormData({ ...formData, operation: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="venta">Venta</SelectItem>
                    <SelectItem value="alquiler">Alquiler</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Tipo de Propiedad *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="departamento">Departamento</SelectItem>
                    <SelectItem value="casa">Casa</SelectItem>
                    <SelectItem value="oficina">Oficina</SelectItem>
                    <SelectItem value="terreno">Terreno</SelectItem>
                    <SelectItem value="local">Local Comercial</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.operation === 'alquiler' && (
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="rental_type">Tipo de Alquiler</Label>
                  <Select
                    value={formData.rental_type}
                    onValueChange={(value) => setFormData({ ...formData, rental_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mensual">Mensual</SelectItem>
                      <SelectItem value="temporal">Temporal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="location">Ubicación *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Ej: Miraflores, Lima"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Precio *</Label>
                <Input
                  id="price"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="Ej: $250,000"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="area">Área (m²) *</Label>
                <Input
                  id="area"
                  type="number"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  placeholder="Ej: 120"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bedrooms">Dormitorios *</Label>
                <Input
                  id="bedrooms"
                  type="number"
                  value={formData.bedrooms}
                  onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                  placeholder="Ej: 3"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bathrooms">Baños *</Label>
                <Input
                  id="bathrooms"
                  type="number"
                  value={formData.bathrooms}
                  onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                  placeholder="Ej: 2"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="garage">Estacionamientos</Label>
                <Input
                  id="garage"
                  type="number"
                  value={formData.garage}
                  onChange={(e) => setFormData({ ...formData, garage: e.target.value })}
                  placeholder="Ej: 1"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Publicando...' : 'Publicar Propiedad'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/dashboard')}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PublishProperty;
