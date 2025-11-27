import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { TrendingUp, X, ImagePlus } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

const PublishInvestment = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    modality: 'pozo',
    min_investment: '',
    annual_return: '',
    capital_gain: '',
    delivery_date: '',
    status: 'preventa',
    unit_types: [] as string[],
    publisher_name: '',
    publisher_phone: '',
    publisher_email: '',
  });

  const unitTypeOptions = [
    { id: 'monoambiente', label: 'Monoambiente' },
    { id: 'departamento', label: 'Departamento' },
    { id: 'duplex', label: 'Duplex' },
    { id: 'ph', label: 'PH' },
    { id: 'local', label: 'Local Comercial' },
    { id: 'oficina', label: 'Oficina' },
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    const maxSize = 5 * 1024 * 1024;
    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        toast({
          title: 'Archivo muy grande',
          description: `${file.name} supera los 5MB`,
          variant: 'destructive',
        });
        return false;
      }
      return true;
    });

    if (uploadedImages.length + validFiles.length > 10) {
      toast({
        title: 'Límite de imágenes',
        description: 'Máximo 10 imágenes por proyecto',
        variant: 'destructive',
      });
      return;
    }

    setUploadedImages(prev => [...prev, ...validFiles]);
    
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async (projectId: string): Promise<string[]> => {
    const uploadPromises = uploadedImages.map(async (file, index) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${projectId}/${Date.now()}_${index}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('property-images')
        .upload(fileName, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('property-images')
        .getPublicUrl(fileName);

      return publicUrl;
    });

    return Promise.all(uploadPromises);
  };

  const handleUnitTypeToggle = (unitTypeId: string) => {
    setFormData(prev => ({
      ...prev,
      unit_types: prev.unit_types.includes(unitTypeId)
        ? prev.unit_types.filter(id => id !== unitTypeId)
        : [...prev.unit_types, unitTypeId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: 'Error',
        description: 'Debes iniciar sesión para publicar un proyecto',
        variant: 'destructive',
      });
      return;
    }

    if (uploadedImages.length === 0) {
      toast({
        title: 'Imágenes requeridas',
        description: 'Debes agregar al menos una imagen del proyecto',
        variant: 'destructive',
      });
      return;
    }

    if (formData.unit_types.length === 0) {
      toast({
        title: 'Tipos de unidad requeridos',
        description: 'Debes seleccionar al menos un tipo de unidad',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const slug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const { data: project, error: projectError } = await supabase
        .from('investment_projects')
        .insert({
          user_id: user.id,
          name: formData.name,
          description: formData.description,
          location: formData.location,
          modality: formData.modality,
          min_investment: parseFloat(formData.min_investment),
          annual_return: parseFloat(formData.annual_return),
          capital_gain: parseFloat(formData.capital_gain),
          delivery_date: formData.delivery_date,
          status: formData.status,
          unit_types: formData.unit_types,
          slug,
          publisher: {
            name: formData.publisher_name,
            phone: formData.publisher_phone,
            email: formData.publisher_email,
          },
          images: [],
        })
        .select()
        .single();

      if (projectError) throw projectError;

      const imageUrls = await uploadImages(project.id);

      const { error: updateError } = await supabase
        .from('investment_projects')
        .update({ images: imageUrls })
        .eq('id', project.id);

      if (updateError) throw updateError;

      toast({
        title: '¡Éxito!',
        description: 'Tu proyecto de inversión ha sido publicado correctamente',
      });

      navigate('/panel');
    } catch (error) {
      console.error('Error publishing investment:', error);
      toast({
        title: 'Error',
        description: 'No se pudo publicar el proyecto. Por favor intenta de nuevo.',
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
            <TrendingUp className="w-6 h-6" />
            Publicar Proyecto de Inversión
          </CardTitle>
          <CardDescription>
            Completa el formulario para publicar tu proyecto de inversión inmobiliaria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="name">Nombre del Proyecto *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Torres del Parque"
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe el proyecto de inversión..."
                  rows={4}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="location">Ubicación *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Ej: Palermo, Buenos Aires"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="modality">Modalidad *</Label>
                <Select
                  value={formData.modality}
                  onValueChange={(value) => setFormData({ ...formData, modality: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pozo">Pozo</SelectItem>
                    <SelectItem value="terminado">Terminado</SelectItem>
                    <SelectItem value="preventa">Pre-venta</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Estado *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="preventa">Pre-venta</SelectItem>
                    <SelectItem value="disponible">Disponible</SelectItem>
                    <SelectItem value="agotado">Agotado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="min_investment">Inversión Mínima (USD) *</Label>
                <Input
                  id="min_investment"
                  type="number"
                  value={formData.min_investment}
                  onChange={(e) => setFormData({ ...formData, min_investment: e.target.value })}
                  placeholder="Ej: 50000"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="annual_return">Retorno Anual (%) *</Label>
                <Input
                  id="annual_return"
                  type="number"
                  step="0.01"
                  value={formData.annual_return}
                  onChange={(e) => setFormData({ ...formData, annual_return: e.target.value })}
                  placeholder="Ej: 12.5"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="capital_gain">Ganancia de Capital (%) *</Label>
                <Input
                  id="capital_gain"
                  type="number"
                  step="0.01"
                  value={formData.capital_gain}
                  onChange={(e) => setFormData({ ...formData, capital_gain: e.target.value })}
                  placeholder="Ej: 25"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="delivery_date">Fecha de Entrega *</Label>
                <Input
                  id="delivery_date"
                  type="date"
                  value={formData.delivery_date}
                  onChange={(e) => setFormData({ ...formData, delivery_date: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Tipos de Unidades *</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 border rounded-lg">
                  {unitTypeOptions.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={option.id}
                        checked={formData.unit_types.includes(option.id)}
                        onCheckedChange={() => handleUnitTypeToggle(option.id)}
                      />
                      <label
                        htmlFor={option.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4 md:col-span-2 pt-4 border-t">
                <h3 className="text-lg font-semibold">Información del Publicante</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="publisher_name">Nombre o Empresa</Label>
                  <Input
                    id="publisher_name"
                    value={formData.publisher_name}
                    onChange={(e) => setFormData({ ...formData, publisher_name: e.target.value })}
                    placeholder="Ej: Desarrollos SA"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="publisher_phone">Teléfono de Contacto</Label>
                    <Input
                      id="publisher_phone"
                      value={formData.publisher_phone}
                      onChange={(e) => setFormData({ ...formData, publisher_phone: e.target.value })}
                      placeholder="Ej: +54 11 1234-5678"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="publisher_email">Email de Contacto</Label>
                    <Input
                      id="publisher_email"
                      type="email"
                      value={formData.publisher_email}
                      onChange={(e) => setFormData({ ...formData, publisher_email: e.target.value })}
                      placeholder="contacto@ejemplo.com"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="images">Imágenes del Proyecto *</Label>
                <p className="text-sm text-muted-foreground">
                  Agrega hasta 10 imágenes (máximo 5MB cada una)
                </p>
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('images')?.click()}
                    className="w-full"
                  >
                    <ImagePlus className="w-4 h-4 mr-2" />
                    Seleccionar imágenes
                  </Button>
                  <Input
                    id="images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              </div>

              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Publicando...' : 'Publicar Proyecto'}
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

export default PublishInvestment;
