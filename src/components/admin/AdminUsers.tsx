import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, Shield, UserCog } from 'lucide-react';
import { AppRole } from '@/hooks/useUserRole';

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
}

interface UserWithRole extends Profile {
  roles: AppRole[];
}

const AdminUsers = () => {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');

      if (rolesError) throw rolesError;

      const usersWithRoles = profiles?.map(profile => ({
        ...profile,
        roles: userRoles
          ?.filter(ur => ur.user_id === profile.id)
          .map(ur => ur.role as AppRole) || [],
      })) || [];

      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los usuarios',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: AppRole) => {
    try {
      // Primero eliminamos todos los roles del usuario
      await supabase.from('user_roles').delete().eq('user_id', userId);

      // Luego insertamos el nuevo rol
      const { error } = await supabase.from('user_roles').insert({
        user_id: userId,
        role: newRole,
      });

      if (error) throw error;

      toast({
        title: 'Éxito',
        description: 'Rol actualizado correctamente',
      });

      fetchUsers();
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el rol',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <UserCog className="w-5 h-5" />
          Gestión de Usuarios
        </CardTitle>
        <Button onClick={fetchUsers} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Actualizar
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-center text-muted-foreground py-8">Cargando...</p>
        ) : users.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No hay usuarios</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rol Actual</TableHead>
                  <TableHead className="text-right">Cambiar Rol</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.full_name || 'Sin nombre'}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {user.roles.length > 0 ? (
                        <div className="flex gap-1">
                          {user.roles.map((role) => (
                            <Badge key={role} variant={role === 'admin' ? 'default' : 'secondary'}>
                              {role === 'admin' && <Shield className="w-3 h-3 mr-1" />}
                              {role === 'admin' ? 'Admin' : role === 'real_estate_agent' ? 'Agente' : 'Usuario'}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <Badge variant="outline">Sin rol</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Select
                        onValueChange={(value) => handleRoleChange(user.id, value as AppRole)}
                        defaultValue={user.roles[0] || 'user'}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Seleccionar rol" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">Usuario</SelectItem>
                          <SelectItem value="real_estate_agent">Agente Inmobiliario</SelectItem>
                          <SelectItem value="admin">Administrador</SelectItem>
                        </SelectContent>
                      </Select>
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

export default AdminUsers;
