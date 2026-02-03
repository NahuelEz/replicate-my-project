import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Eye, RefreshCw, TrendingUp } from 'lucide-react';

interface Investment {
  id: string;
  name: string;
  location: string;
  min_investment: number;
  status: string;
  modality: string;
  created_at: string;
}

const AdminInvestments = () => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchInvestments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('investment_projects')
        .select('id, name, location, min_investment, status, modality, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvestments(data || []);
    } catch (error) {
      console.error('Error fetching investments:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los proyectos de inversión',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvestments();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este proyecto de inversión?')) return;

    try {
      const { error } = await supabase.from('investment_projects').delete().eq('id', id);

      if (error) throw error;

      toast({
        title: 'Éxito',
        description: 'Proyecto eliminado correctamente',
      });

      fetchInvestments();
    } catch (error) {
      console.error('Error deleting investment:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el proyecto',
        variant: 'destructive',
      });
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'activo' ? 'inactivo' : 'activo';

    try {
      const { error } = await supabase
        .from('investment_projects')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Éxito',
        description: `Proyecto ${newStatus}`,
      });

      fetchInvestments();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el estado',
        variant: 'destructive',
      });
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Gestión de Inversiones
        </CardTitle>
        <Button onClick={fetchInvestments} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Actualizar
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-center text-muted-foreground py-8">Cargando...</p>
        ) : investments.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No hay proyectos de inversión</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Ubicación</TableHead>
                  <TableHead>Inversión Mín.</TableHead>
                  <TableHead>Modalidad</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {investments.map((investment) => (
                  <TableRow key={investment.id}>
                    <TableCell className="font-medium">{investment.name}</TableCell>
                    <TableCell>{investment.location}</TableCell>
                    <TableCell>{formatCurrency(investment.min_investment)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{investment.modality}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={investment.status === 'activo' ? 'default' : 'secondary'}>
                        {investment.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleStatus(investment.id, investment.status)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(investment.id)}
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

export default AdminInvestments;
