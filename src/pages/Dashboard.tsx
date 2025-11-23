import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Home, Heart, Settings, Edit, Trash2, TrendingUp, Building, PlusCircle, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { useData } from '@/contexts/DataContext';
import PropertyCard from '@/components/PropertyCard';
import { motion } from 'framer-motion';
import { Label } from '@/components/ui/label';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('properties');
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
  });
  
  const { toast } = useToast();
  const { user, profile, signOut } = useAuth();
  const { isAdmin, isRealEstateAgent } = useUserRole();
  const { properties } = useData();
  const navigate = useNavigate();
  
  // Mock user's properties
  const userProperties = properties.filter(p => p.operation === "Venta").slice(0, 2);
  const favoriteProperties = properties.filter(p => p.operation === "Alquiler").slice(0, 2);

  const handleAccountSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "¡Datos actualizados con éxito!" });
    setIsAccountModalOpen(false);
  };

  const handleDelete = (id: number) => {
    toast({ 
      title: "Propiedad eliminada", 
      description: "La propiedad ha sido eliminada correctamente." 
    });
  };

  const tabs = [
    { id: 'properties', label: 'Mis Propiedades', icon: Home },
    { id: 'favorites', label: 'Favoritos', icon: Heart },
    { id: 'stats', label: 'Estadísticas', icon: TrendingUp },
    { id: 'account', label: 'Mi Cuenta', icon: Settings },
  ];

  return (
    <>
      <Helmet>
        <title>Panel de Control - PropiedadesArgentinas.com</title>
      </Helmet>
      <div className="min-h-screen bg-muted py-8">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">
                Bienvenido, {user?.email?.split('@')[0] || 'Usuario'}
              </h1>
              <p className="text-muted-foreground">Gestiona tus propiedades y favoritos</p>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-lg shadow-sm">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      activeTab === tab.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
              {isAdmin && (
                <button
                  onClick={() => navigate('/admin')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 ml-auto"
                >
                  <Shield className="w-4 h-4" />
                  <span className="hidden sm:inline">Admin</span>
                </button>
              )}
            </div>

            {/* Content */}
            <div className="bg-white rounded-lg shadow-md p-6">
              {activeTab === 'properties' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-heading font-bold">Mis Propiedades</h2>
                    <Button onClick={() => navigate('/publicar')} className="btn-primary">
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Nueva Propiedad
                    </Button>
                  </div>
                  
                  {userProperties.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-6">
                      {userProperties.map((property) => (
                        <div key={property.id} className="relative">
                          <PropertyCard property={property} />
                          <div className="flex gap-2 mt-3">
                            <Button variant="outline" size="sm" className="flex-1">
                              <Edit className="w-4 h-4 mr-2" />
                              Editar
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex-1"
                              onClick={() => handleDelete(property.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Eliminar
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Building className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">
                        Aún no has publicado ninguna propiedad
                      </p>
                      <Button onClick={() => navigate('/publicar')} className="btn-primary">
                        Publicar mi primera propiedad
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'favorites' && (
                <div>
                  <h2 className="text-2xl font-heading font-bold mb-6">Propiedades Favoritas</h2>
                  {favoriteProperties.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-6">
                      {favoriteProperties.map((property) => (
                        <PropertyCard key={property.id} property={property} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">
                        No tienes propiedades favoritas aún
                      </p>
                      <Button onClick={() => navigate('/comprar')} className="btn-primary">
                        Explorar propiedades
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'stats' && (
                <div>
                  <h2 className="text-2xl font-heading font-bold mb-6">Estadísticas</h2>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-muted p-6 rounded-lg">
                      <TrendingUp className="w-8 h-8 text-primary mb-2" />
                      <p className="text-3xl font-bold">245</p>
                      <p className="text-sm text-muted-foreground">Vistas este mes</p>
                    </div>
                    <div className="bg-muted p-6 rounded-lg">
                      <Home className="w-8 h-8 text-primary mb-2" />
                      <p className="text-3xl font-bold">{userProperties.length}</p>
                      <p className="text-sm text-muted-foreground">Propiedades activas</p>
                    </div>
                    <div className="bg-muted p-6 rounded-lg">
                      <Heart className="w-8 h-8 text-primary mb-2" />
                      <p className="text-3xl font-bold">12</p>
                      <p className="text-sm text-muted-foreground">Contactos recibidos</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'account' && (
                <div>
                  <h2 className="text-2xl font-heading font-bold mb-6">Mi Cuenta</h2>
                  <div className="max-w-md space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Email</p>
                      <p className="font-semibold">{user?.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Nombre</p>
                      <p className="font-semibold">{profile?.full_name || 'No configurado'}</p>
                    </div>
                    <div className="pt-4">
                      <Button onClick={() => setIsAccountModalOpen(true)} className="btn-primary">
                        <Edit className="w-4 h-4 mr-2" />
                        Editar Información
                      </Button>
                    </div>
                    <div className="pt-4 border-t">
                      <Button onClick={signOut} variant="destructive">
                        Cerrar Sesión
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Edit Account Modal */}
      <Dialog open={isAccountModalOpen} onOpenChange={setIsAccountModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Información</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAccountSave} className="space-y-4">
            <div>
              <Label htmlFor="name">Nombre</Label>
              <Input 
                id="name"
                name="name" 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                placeholder="Nombre o Empresa" 
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email"
                name="email" 
                type="email" 
                value={formData.email} 
                onChange={(e) => setFormData({...formData, email: e.target.value})} 
                placeholder="Email" 
              />
            </div>
            <div>
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input 
                id="whatsapp"
                name="whatsapp" 
                value={formData.whatsapp} 
                onChange={(e) => setFormData({...formData, whatsapp: e.target.value})} 
                placeholder="WhatsApp" 
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => setIsAccountModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="btn-primary">
                Guardar Cambios
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Dashboard;
