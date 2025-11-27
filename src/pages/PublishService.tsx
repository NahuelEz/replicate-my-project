import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Wrench, X, ImagePlus } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

const PublishService = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    category_slug: 'construccion-obras',
    location: '',
    services_description: '',
    years_experience: '',
    phone: '',
    email: '',
    website: '',
  });

  const categoryOptions = [
    { value: 'construccion-obras', label: 'Construcción y Obras' },
    { value: 'arquitectura-proyectos', label: 'Arquitectura y Proyectos' },
    { value: 'instalaciones', label: 'Instalaciones' },
    { value: 'remodelaciones', label: 'Remodelaciones' },
    { value: 'electricistas', label: 'Electricistas' },
    { value: 'plomeros', label: 'Plomería' },
    { value: 'pintores', label: 'Pintores' },
    { value: 'consultores-inmobiliarios', label: 'Consultoría Inmobiliaria' },
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: 'Archivo muy grande',
        description: 'La imagen debe ser menor a 5MB',
        variant: 'destructive',
      });
      return;
    }

    setUploadedImage(file);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setUploadedImage(null);
    setImagePreview('');
  };

  const uploadAvatar = async (professionalId: string): Promise<string | null> => {
    if (!uploadedImage) return null;

    const fileExt = uploadedImage.name.split('.').pop();
    const fileName = `professionals/${professionalId}/avatar.${fileExt}`;
    
    const { error } = await supabase.storage
      .from('property-images')
      .upload(fileName, uploadedImage);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('property-images')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: 'Error',
        description: 'Debes iniciar sesión para publicar un servicio',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const servicesArray = formData.services_description
        .split('\n')
        .filter(s => s.trim())
        .map(s => ({ name: s.trim(), description: '' }));

      const { data: professional, error: professionalError } = await supabase
        .from('professionals')
        .insert({
          user_id: user.id,
          name: formData.name,
          specialty: formData.specialty,
          category_slug: formData.category_slug,
          location: formData.location,
          services: servicesArray,
          reputation: {
            rating: 0,
            reviews: 0,
            years_experience: parseInt(formData.years_experience) || 0,
            completed_projects: 0,
          },
          profile_reviews: [],
          avatar: null,
        })
        .select()
        .single();

      if (professionalError) throw professionalError;

      if (uploadedImage) {
        const avatarUrl = await uploadAvatar(professional.id);
        
        if (avatarUrl) {
          const { error: updateError } = await supabase
            .from('professionals')
            .update({ avatar: avatarUrl })
            .eq('id', professional.id);

          if (updateError) throw updateError;
        }
      }

      toast({
        title: '¡Éxito!',
        description: 'Tu perfil profesional ha sido publicado correctamente',
      });

      navigate('/panel');
    } catch (error) {
      console.error('Error publishing service:', error);
      toast({
        title: 'Error',
        description: 'No se pudo publicar el servicio. Por favor intenta de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="w-6 h-6" />
            Publicar Servicio Profesional
          </CardTitle>
          <CardDescription>
            Completa el formulario para ofrecer tus servicios profesionales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="name">Nombre o Razón Social *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Juan Pérez - Arquitecto"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Categoría del Servicio *</Label>
                <Select
                  value={formData.category_slug}
                  onValueChange={(value) => setFormData({ ...formData, category_slug: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialty">Especialidad *</Label>
                <Input
                  id="specialty"
                  value={formData.specialty}
                  onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                  placeholder="Ej: Diseño de interiores"
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="location">Ubicación *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Ej: CABA, Buenos Aires"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="years_experience">Años de Experiencia</Label>
                <Input
                  id="years_experience"
                  type="number"
                  value={formData.years_experience}
                  onChange={(e) => setFormData({ ...formData, years_experience: e.target.value })}
                  placeholder="Ej: 10"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="services_description">Servicios Ofrecidos *</Label>
                <Textarea
                  id="services_description"
                  value={formData.services_description}
                  onChange={(e) => setFormData({ ...formData, services_description: e.target.value })}
                  placeholder="Lista tus servicios (uno por línea)&#10;Ej:&#10;Diseño arquitectónico&#10;Dirección de obra&#10;Remodelaciones integrales"
                  rows={5}
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Escribe un servicio por línea
                </p>
              </div>

              <div className="space-y-4 md:col-span-2 pt-4 border-t">
                <h3 className="text-lg font-semibold">Información de Contacto</h3>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+54 11 1234-5678"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="contacto@ejemplo.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Sitio Web</Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://www.ejemplo.com"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="avatar">Foto de Perfil</Label>
                <p className="text-sm text-muted-foreground">
                  Agrega una imagen profesional (máximo 5MB)
                </p>
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('avatar')?.click()}
                    className="w-full"
                  >
                    <ImagePlus className="w-4 h-4 mr-2" />
                    Seleccionar imagen
                  </Button>
                  <Input
                    id="avatar"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              </div>

              {imagePreview && (
                <div className="relative w-32 h-32 mx-auto">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Publicando...' : 'Publicar Servicio'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/publicar')}
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

export default PublishService;
