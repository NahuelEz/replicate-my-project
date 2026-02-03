import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Trash2, RefreshCw, Briefcase, Star } from 'lucide-react';
import type { Json } from '@/integrations/supabase/types';

interface Professional {
  id: string;
  name: string;
  specialty: string;
  category_slug: string;
  location: string;
  reputation: Json;
  created_at: string;
}

const AdminProfessionals = () => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProfessionals = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('professionals')
        .select('id, name, specialty, category_slug, location, reputation, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProfessionals(data || []);
    } catch (error) {
      console.error('Error fetching professionals:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los profesionales',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfessionals();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este profesional?')) return;

    try {
      const { error } = await supabase.from('professionals').delete().eq('id', id);

      if (error) throw error;

      toast({
        title: 'Éxito',
        description: 'Profesional eliminado correctamente',
      });

      fetchProfessionals();
    } catch (error) {
      console.error('Error deleting professional:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el profesional',
        variant: 'destructive',
      });
    }
  };

  const getCategoryLabel = (slug: string) => {
    const categories: Record<string, string> = {
      'arquitectura-proyectos': 'Arquitectura',
      'electricistas': 'Electricista',
      'consultores-inmobiliarios': 'Consultor',
      'plomeros': 'Plomero',
      'pintores': 'Pintor',
      'albaniles': 'Albañil',
    };
    return categories[slug] || slug;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="w-5 h-5" />
          Gestión de Profesionales
        </CardTitle>
        <Button onClick={fetchProfessionals} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Actualizar
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-center text-muted-foreground py-8">Cargando...</p>
        ) : professionals.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No hay profesionales registrados</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Especialidad</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Ubicación</TableHead>
                  <TableHead>Reputación</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {professionals.map((professional) => (
                  <TableRow key={professional.id}>
                    <TableCell className="font-medium">{professional.name}</TableCell>
                    <TableCell>{professional.specialty}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{getCategoryLabel(professional.category_slug)}</Badge>
                    </TableCell>
                    <TableCell>{professional.location}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>
                          {typeof professional.reputation === 'object' && professional.reputation !== null && 'rating' in professional.reputation
                            ? Number(professional.reputation.rating).toFixed(1)
                            : 'N/A'}
                        </span>
                        <span className="text-muted-foreground text-sm">
                          ({typeof professional.reputation === 'object' && professional.reputation !== null && 'reviews' in professional.reputation
                            ? Number(professional.reputation.reviews)
                            : 0})
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(professional.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
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

export default AdminProfessionals;
