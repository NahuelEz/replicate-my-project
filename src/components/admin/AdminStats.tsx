import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, Users, FileText, TrendingUp } from 'lucide-react';

const AdminStats = () => {
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalUsers: 0,
    totalInquiries: 0,
    activeProperties: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [properties, profiles, inquiries] = await Promise.all([
          supabase.from('properties').select('id, status', { count: 'exact' }),
          supabase.from('profiles').select('id', { count: 'exact' }),
          supabase.from('property_inquiries').select('id', { count: 'exact' }),
        ]);

        const activeCount = properties.data?.filter(p => p.status === 'activa').length || 0;

        setStats({
          totalProperties: properties.count || 0,
          totalUsers: profiles.count || 0,
          totalInquiries: inquiries.count || 0,
          activeProperties: activeCount,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Propiedades',
      value: stats.totalProperties,
      icon: Home,
      description: `${stats.activeProperties} activas`,
    },
    {
      title: 'Usuarios Registrados',
      value: stats.totalUsers,
      icon: Users,
      description: 'Total en la plataforma',
    },
    {
      title: 'Consultas Recibidas',
      value: stats.totalInquiries,
      icon: FileText,
      description: 'Todas las consultas',
    },
    {
      title: 'Tasa de Actividad',
      value: `${stats.totalProperties > 0 ? Math.round((stats.activeProperties / stats.totalProperties) * 100) : 0}%`,
      icon: TrendingUp,
      description: 'Propiedades activas',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AdminStats;
