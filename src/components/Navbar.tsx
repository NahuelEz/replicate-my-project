import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, ChevronDown, Home } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Home className="w-8 h-8 text-[#2D3436]" />
            <span className="text-base font-sans font-black text-[#2D3436] tracking-tight">
              PROPIEDADES<span className="text-[#F97316]">ARGENTINAS.COM</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center">
            <NavigationMenu>
              <NavigationMenuList className="gap-8">
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent hover:bg-transparent text-[#2D3436] font-bold text-xs uppercase">
                    COMPRAR
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[400px] p-4 bg-white">
                      <Link to="/comprar?type=departamento" className="block px-4 py-2 hover:bg-gray-100 rounded-md text-sm">
                        Departamentos
                      </Link>
                      <Link to="/comprar?type=casa" className="block px-4 py-2 hover:bg-gray-100 rounded-md text-sm">
                        Casas
                      </Link>
                      <Link to="/comprar?type=terreno" className="block px-4 py-2 hover:bg-gray-100 rounded-md text-sm">
                        Terrenos
                      </Link>
                      <Link to="/comprar?type=local" className="block px-4 py-2 hover:bg-gray-100 rounded-md text-sm">
                        Locales Comerciales
                      </Link>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent hover:bg-transparent text-[#2D3436] font-bold text-xs uppercase">
                    ALQUILAR
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[400px] p-4 bg-white">
                      <Link to="/alquilar?type=departamento" className="block px-4 py-2 hover:bg-gray-100 rounded-md text-sm">
                        Departamentos
                      </Link>
                      <Link to="/alquilar?type=casa" className="block px-4 py-2 hover:bg-gray-100 rounded-md text-sm">
                        Casas
                      </Link>
                      <Link to="/alquilar?rental_type=temporal" className="block px-4 py-2 hover:bg-gray-100 rounded-md text-sm">
                        Alquiler Temporal
                      </Link>
                      <Link to="/alquilar?type=local" className="block px-4 py-2 hover:bg-gray-100 rounded-md text-sm">
                        Locales Comerciales
                      </Link>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link to="/inversiones" className="text-[#2D3436] hover:text-primary font-bold text-xs uppercase px-4 py-2">
                    INVERTIR
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link to="/servicios" className="text-[#2D3436] hover:text-primary font-bold text-xs uppercase px-4 py-2">
                    SERVICIOS
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent hover:bg-transparent text-[#2D3436] font-bold text-xs uppercase">
                    PRODUCTOS
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[400px] p-4 bg-white">
                      <Link to="/para-inmobiliarias" className="block px-4 py-2 hover:bg-gray-100 rounded-md text-sm">
                        Para Inmobiliarias
                      </Link>
                      <Link to="/para-desarrolladores" className="block px-4 py-2 hover:bg-gray-100 rounded-md text-sm">
                        Para Desarrolladores
                      </Link>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right Side Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/dashboard')}
                  className="text-foreground font-medium"
                >
                  Mi cuenta
                </Button>
                <Button 
                  onClick={() => navigate('/publicar')}
                  className="bg-[#F59E0B] hover:bg-[#F59E0B]/90 text-white font-medium px-6"
                >
                  Publicar
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/login')}
                  className="text-foreground font-medium"
                >
                  Iniciar sesión
                </Button>
                <Button 
                  onClick={() => navigate('/registro')}
                  className="bg-[#06B6D4] hover:bg-[#06B6D4]/90 text-white font-medium px-6"
                >
                  Crear cuenta
                </Button>
                <Button 
                  onClick={() => navigate('/publicar')}
                  className="bg-[#F59E0B] hover:bg-[#F59E0B]/90 text-white font-medium px-6"
                >
                  Publicar
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-3">
              <Link
                to="/comprar"
                className="px-4 py-2 hover:bg-muted rounded-lg transition-colors font-medium"
                onClick={() => setIsOpen(false)}
              >
                COMPRAR
              </Link>
              <Link
                to="/alquilar"
                className="px-4 py-2 hover:bg-muted rounded-lg transition-colors font-medium"
                onClick={() => setIsOpen(false)}
              >
                ALQUILAR
              </Link>
              <Link
                to="/inversiones"
                className="px-4 py-2 hover:bg-muted rounded-lg transition-colors font-medium"
                onClick={() => setIsOpen(false)}
              >
                INVERTIR
              </Link>
              <Link
                to="/servicios"
                className="px-4 py-2 hover:bg-muted rounded-lg transition-colors font-medium"
                onClick={() => setIsOpen(false)}
              >
                SERVICIOS
              </Link>
              {isAuthenticated ? (
                <>
                  <Button 
                    variant="ghost" 
                    onClick={() => { navigate('/dashboard'); setIsOpen(false); }}
                    className="justify-start"
                  >
                    Mi cuenta
                  </Button>
                  <Button 
                    onClick={() => { navigate('/publicar'); setIsOpen(false); }}
                    className="bg-[#F59E0B] hover:bg-[#F59E0B]/90 text-white"
                  >
                    Publicar
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="ghost" 
                    onClick={() => { navigate('/login'); setIsOpen(false); }}
                    className="justify-start"
                  >
                    Iniciar sesión
                  </Button>
                  <Button 
                    onClick={() => { navigate('/registro'); setIsOpen(false); }}
                    className="bg-[#06B6D4] hover:bg-[#06B6D4]/90 text-white"
                  >
                    Crear cuenta
                  </Button>
                  <Button 
                    onClick={() => { navigate('/publicar'); setIsOpen(false); }}
                    className="bg-[#F59E0B] hover:bg-[#F59E0B]/90 text-white"
                  >
                    Publicar
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
