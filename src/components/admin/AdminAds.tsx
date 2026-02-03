import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Megaphone, Plus, Pencil, Trash2, ExternalLink, Eye, MousePointer } from 'lucide-react';

interface Advertisement {
  id: string;
  title: string;
  image_url: string | null;
  link_url: string | null;
  location: string;
  is_active: boolean;
  start_date: string | null;
  end_date: string | null;
  clicks: number;
  impressions: number;
  created_at: string;
}

const locationLabels: Record<string, string> = {
  'home': 'Página Principal',
  'sidebar': 'Sidebar (Listados)',
  'property-detail': 'Detalle de Propiedad',
  'footer': 'Footer'
};

const AdminAds = () => {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<Advertisement | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    image_url: '',
    link_url: '',
    location: 'sidebar',
    is_active: true,
    start_date: '',
    end_date: ''
  });

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const { data, error } = await supabase
        .from('advertisements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAds(data || []);
    } catch (error) {
      console.error('Error fetching ads:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los anuncios",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const payload = {
        title: formData.title,
        image_url: formData.image_url || null,
        link_url: formData.link_url || null,
        location: formData.location,
        is_active: formData.is_active,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null
      };

      if (editingAd) {
        const { error } = await supabase
          .from('advertisements')
          .update(payload)
          .eq('id', editingAd.id);

        if (error) throw error;
        toast({ title: "Anuncio actualizado correctamente" });
      } else {
        const { error } = await supabase
          .from('advertisements')
          .insert(payload);

        if (error) throw error;
        toast({ title: "Anuncio creado correctamente" });
      }

      setDialogOpen(false);
      resetForm();
      fetchAds();
    } catch (error) {
      console.error('Error saving ad:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar el anuncio",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (ad: Advertisement) => {
    setEditingAd(ad);
    setFormData({
      title: ad.title,
      image_url: ad.image_url || '',
      link_url: ad.link_url || '',
      location: ad.location,
      is_active: ad.is_active,
      start_date: ad.start_date || '',
      end_date: ad.end_date || ''
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este anuncio?')) return;

    try {
      const { error } = await supabase
        .from('advertisements')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: "Anuncio eliminado" });
      fetchAds();
    } catch (error) {
      console.error('Error deleting ad:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el anuncio",
        variant: "destructive"
      });
    }
  };

  const toggleActive = async (id: string, currentState: boolean) => {
    try {
      const { error } = await supabase
        .from('advertisements')
        .update({ is_active: !currentState })
        .eq('id', id);

      if (error) throw error;
      toast({ title: `Anuncio ${!currentState ? 'activado' : 'desactivado'}` });
      fetchAds();
    } catch (error) {
      console.error('Error toggling ad:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setEditingAd(null);
    setFormData({
      title: '',
      image_url: '',
      link_url: '',
      location: 'sidebar',
      is_active: true,
      start_date: '',
      end_date: ''
    });
  };

  const handleOpenDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  if (loading) {
    return <div className="text-center py-8">Cargando anuncios...</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Megaphone className="w-5 h-5" />
          Gestión de Anuncios ({ads.length})
        </CardTitle>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenDialog}>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Anuncio
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingAd ? 'Editar Anuncio' : 'Nuevo Anuncio'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="image_url">URL de Imagen</Label>
                <Input
                  id="image_url"
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div>
                <Label htmlFor="link_url">URL de Destino</Label>
                <Input
                  id="link_url"
                  type="url"
                  value={formData.link_url}
                  onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div>
                <Label htmlFor="location">Ubicación</Label>
                <Select
                  value={formData.location}
                  onValueChange={(value) => setFormData({ ...formData, location: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="home">Página Principal</SelectItem>
                    <SelectItem value="sidebar">Sidebar (Listados)</SelectItem>
                    <SelectItem value="property-detail">Detalle de Propiedad</SelectItem>
                    <SelectItem value="footer">Footer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start_date">Fecha Inicio</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="end_date">Fecha Fin</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active">Activo</Label>
              </div>
              <Button type="submit" className="w-full">
                {editingAd ? 'Guardar Cambios' : 'Crear Anuncio'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {ads.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No hay anuncios configurados
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Ubicación</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Estadísticas</TableHead>
                  <TableHead>Fechas</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ads.map((ad) => (
                  <TableRow key={ad.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {ad.image_url && (
                          <img
                            src={ad.image_url}
                            alt={ad.title}
                            className="w-10 h-10 object-cover rounded"
                          />
                        )}
                        <div>
                          <p className="font-medium">{ad.title}</p>
                          {ad.link_url && (
                            <a
                              href={ad.link_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-muted-foreground hover:underline flex items-center gap-1"
                            >
                              <ExternalLink className="w-3 h-3" />
                              Ver enlace
                            </a>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {locationLabels[ad.location] || ad.location}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={ad.is_active}
                        onCheckedChange={() => toggleActive(ad.id, ad.is_active)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {ad.impressions}
                        </span>
                        <span className="flex items-center gap-1">
                          <MousePointer className="w-3 h-3" />
                          {ad.clicks}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {ad.start_date && <p>Desde: {ad.start_date}</p>}
                        {ad.end_date && <p>Hasta: {ad.end_date}</p>}
                        {!ad.start_date && !ad.end_date && <p>Sin límite</p>}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(ad)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(ad.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminAds;
