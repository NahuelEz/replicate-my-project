import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, User, LogOut, ChevronDown, Building, Home, Star, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { cn } from "@/lib/utils";

interface ListItemProps extends React.ComponentPropsWithoutRef<typeof Link> {
  title: string;
  children: React.ReactNode;
}

const ListItem = React.forwardRef<HTMLAnchorElement, ListItemProps>(
  ({ className, children, title, ...props }, ref) => {
    return (
      <li>
        <NavigationMenu.Link asChild>
          <Link
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          </Link>
        </NavigationMenu.Link>
      </li>
    );
  }
);
ListItem.displayName = "ListItem";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleMenuClick = (path?: string) => {
    if (path) {
      navigate(path);
    } else {
      toast({
        title: "🚧 ¡Función no implementada!",
        description: "Esta función aún no está disponible, ¡pero puedes solicitarla en tu próximo mensaje! 🚀",
      });
    }
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    signOut();
    toast({ title: "Sesión cerrada exitosamente." });
    navigate('/');
    setIsMenuOpen(false);
  };

  const buyOptions = [
    { title: "Departamentos", href: "/comprar/departamento", description: "Encontrá tu próximo depto en la ciudad." },
    { title: "Casas", href: "/comprar/casa", description: "Las mejores casas con patio y jardín." },
    { title: "PH", href: "/comprar/ph", description: "Comodidad y estilo en propiedad horizontal." },
    { title: "Terrenos", href: "/comprar/terreno", description: "Construí la casa de tus sueños." },
  ];

  const rentOptions = [
    { title: "Alquiler Tradicional", href: "/alquilar", description: "Alquileres en las mejores zonas." },
    { title: "Alquiler Temporal", href: "/alquiler-temporal", description: "Amoblados por noche, semana o mes." },
    { title: "Oficinas", href: "/alquilar/oficina", description: "El espacio ideal para tu negocio." },
    { title: "Locales", href: "/alquilar/local", description: "Ubicaciones comerciales estratégicas." },
  ];
  
  const servicesOptions = [
      { title: "Arquitectura y Proyectos", href: "/servicios/arquitectura-proyectos", icon: <Building className="h-4 w-4" /> },
      { title: "Oficios Técnicos", href: "/servicios/electricistas", icon: <Wrench className="h-4 w-4" /> },
      { title: "Servicios Inmobiliarios", href: "/servicios/consultores-inmobiliarios", icon: <Home className="h-4 w-4" /> },
      { title: "Ver todos", href: "/servicios", icon: <Star className="h-4 w-4" /> },
  ];

  return (
    <header className="bg-background shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 flex items-center justify-between h-20">
        <Link to="/">
          <img
            src="https://storage.googleapis.com/hostinger-horizons-assets-prod/766655db-48f1-491b-bb1e-2352485b8e5d/c9f4e29e54edd503c3689229b547732a.png"
            alt="PropiedadesArgentinas.com Logo"
            className="h-12"
          />
        </Link>

        <NavigationMenu.Root className="hidden md:flex items-center space-x-2">
            <NavigationMenu.List className="flex items-center space-x-2">
                <NavigationMenu.Item>
                    <NavigationMenu.Trigger 
                      onClick={() => navigate('/comprar')}
                      className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-bold transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                        Comprar <ChevronDown className="relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180" aria-hidden="true" />
                    </NavigationMenu.Trigger>
                    <NavigationMenu.Content className="absolute top-full left-0 flex w-full justify-center data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52">
                        <ul className="one:w-[300px] gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr] bg-popover border rounded-lg shadow-lg">
                            {buyOptions.map((component) => (
                                <ListItem key={component.title} title={component.title} to={component.href}>
                                    {component.description}
                                </ListItem>
                            ))}
                        </ul>
                    </NavigationMenu.Content>
                </NavigationMenu.Item>
                <NavigationMenu.Item>
                    <NavigationMenu.Trigger 
                      onClick={() => navigate('/alquilar')}
                      className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-bold transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                        Alquilar <ChevronDown className="relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180" aria-hidden="true" />
                    </NavigationMenu.Trigger>
                    <NavigationMenu.Content className="absolute top-full left-0 flex w-full justify-center data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52">
                         <ul className="one:w-[300px] gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr] bg-popover border rounded-lg shadow-lg">
                            {rentOptions.map((component) => (
                                <ListItem key={component.title} title={component.title} to={component.href}>
                                    {component.description}
                                </ListItem>
                            ))}
                        </ul>
                    </NavigationMenu.Content>
                </NavigationMenu.Item>
                <NavigationMenu.Item>
                    <NavigationMenu.Link asChild>
                        <Link to="/inversiones" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-bold transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                            Inversiones
                        </Link>
                    </NavigationMenu.Link>
                </NavigationMenu.Item>
                 <NavigationMenu.Item>
                    <NavigationMenu.Trigger 
                      onClick={() => navigate('/servicios')}
                      className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-bold transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                        Servicios <ChevronDown className="relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180" aria-hidden="true" />
                    </NavigationMenu.Trigger>
                    <NavigationMenu.Content className="absolute top-full left-0 flex w-full justify-center data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52">
                         <ul className="one:w-[300px] gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr] bg-popover border rounded-lg shadow-lg">
                            {servicesOptions.map((component) => (
                                <ListItem key={component.title} title={component.title} to={component.href}>
                                    {component.icon} {component.title}
                                </ListItem>
                            ))}
                        </ul>
                    </NavigationMenu.Content>
                </NavigationMenu.Item>
            </NavigationMenu.List>
            <NavigationMenu.Viewport />
        </NavigationMenu.Root>

        <div className="hidden md:flex items-center space-x-2">
          {user ? (
            <>
              <button onClick={() => handleMenuClick('/panel')} className="p-2 text-muted-foreground hover:text-primary transition-colors" title="Mi Panel">
                <User className="w-6 h-6" />
              </button>
              <button onClick={handleLogout} className="p-2 text-muted-foreground hover:text-primary transition-colors" title="Cerrar Sesión">
                <LogOut className="w-6 h-6" />
              </button>
            </>
          ) : (
            <>
              <Button onClick={() => handleMenuClick('/login')} variant="ghost" className="font-bold">Iniciar sesión</Button>
              <Button onClick={() => handleMenuClick('/registro')} variant="outline" className="font-bold">Crear cuenta</Button>
            </>
          )}
          <Button onClick={() => handleMenuClick('/publicar')} className="font-bold">
            Publicar
          </Button>
        </div>

        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-foreground">
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-background border-t"
        >
          <nav className="container mx-auto px-4 py-4 flex flex-col space-y-4 font-bold">
            <Link to="/comprar" className="text-foreground hover:text-primary" onClick={() => setIsMenuOpen(false)}>Comprar</Link>
            <Link to="/alquilar" className="text-foreground hover:text-primary" onClick={() => setIsMenuOpen(false)}>Alquilar</Link>
            <Link to="/inversiones" className="text-foreground hover:text-primary" onClick={() => setIsMenuOpen(false)}>Inversiones</Link>
            <Link to="/servicios" className="text-foreground hover:text-primary" onClick={() => setIsMenuOpen(false)}>Servicios</Link>
            <div className="border-t pt-4 space-y-4">
              {user ? (
                <>
                  <button onClick={() => handleMenuClick('/panel')} className="w-full text-left flex items-center text-foreground hover:text-primary"><User className="w-5 h-5 mr-2" /> Mi Panel</button>
                  <button onClick={handleLogout} className="w-full text-left flex items-center text-foreground hover:text-primary"><LogOut className="w-5 h-5 mr-2" /> Cerrar Sesión</button>
                </>
              ) : (
                <>
                  <Button onClick={() => handleMenuClick('/login')} variant="ghost" className="w-full justify-start font-bold">Iniciar sesión</Button>
                  <Button onClick={() => handleMenuClick('/registro')} variant="outline" className="w-full font-bold">Crear cuenta</Button>
                </>
              )}
              <Button onClick={() => handleMenuClick('/publicar')} className="w-full font-bold">Publicar</Button>
            </div>
          </nav>
        </motion.div>
      )}
    </header>
  );
};

export default Header;
