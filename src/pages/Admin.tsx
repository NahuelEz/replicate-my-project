import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield } from 'lucide-react';
import PageLoader from '@/components/PageLoader';
import AdminProperties from '@/components/admin/AdminProperties';
import AdminUsers from '@/components/admin/AdminUsers';
import AdminStats from '@/components/admin/AdminStats';
import AdminInvestments from '@/components/admin/AdminInvestments';
import AdminProfessionals from '@/components/admin/AdminProfessionals';

const Admin = () => {
  const { user } = useAuth();
  const { isAdmin, loading } = useUserRole();
  const [activeTab, setActiveTab] = useState('stats');

  if (loading) {
    return <PageLoader />;
  }

  if (!user || !isAdmin) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Shield className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
        <h1 className="text-2xl font-bold mb-2">Acceso Restringido</h1>
        <p className="text-muted-foreground mb-6">
          No tienes permisos para acceder al panel de administración.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Shield className="w-8 h-8" />
          Panel de Administración
        </h1>
        <p className="text-muted-foreground mt-2">
          Gestiona usuarios, propiedades, inversiones y profesionales de la plataforma
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto">
          <TabsTrigger value="stats">Estadísticas</TabsTrigger>
          <TabsTrigger value="properties">Propiedades</TabsTrigger>
          <TabsTrigger value="investments">Inversiones</TabsTrigger>
          <TabsTrigger value="professionals">Profesionales</TabsTrigger>
          <TabsTrigger value="users">Usuarios</TabsTrigger>
        </TabsList>

        <TabsContent value="stats">
          <AdminStats />
        </TabsContent>

        <TabsContent value="properties">
          <AdminProperties />
        </TabsContent>

        <TabsContent value="investments">
          <AdminInvestments />
        </TabsContent>

        <TabsContent value="professionals">
          <AdminProfessionals />
        </TabsContent>

        <TabsContent value="users">
          <AdminUsers />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
