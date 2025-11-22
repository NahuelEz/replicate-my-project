import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, User, LogOut, Home, Building, TrendingUp, PlusCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Home className="w-8 h-8 text-primary" />
            <span className="text-2xl font-heading font-bold text-brand-gris-oscuro">
              Propiedades<span className="text-primary">Argentinas</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/comprar" className="text-foreground hover:text-primary transition-colors font-medium">
              Comprar
            </Link>
            <Link to="/alquilar" className="text-foreground hover:text-primary transition-colors font-medium">
              Alquilar
            </Link>
            <Link to="/inversiones" className="text-foreground hover:text-primary transition-colors font-medium">
              Inversiones
            </Link>
            
            {isAuthenticated ? (
              <>
                <Button onClick={() => navigate('/publicar')} className="btn-secondary">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Publicar
                </Button>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{user?.email}</span>
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Salir
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate('/login')}>
                  Ingresar
                </Button>
                <Button onClick={() => navigate('/registro')} className="btn-primary">
                  Crear cuenta
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-3">
              <Link
                to="/comprar"
                className="px-4 py-2 hover:bg-muted rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Comprar
              </Link>
              <Link
                to="/alquilar"
                className="px-4 py-2 hover:bg-muted rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Alquilar
              </Link>
              <Link
                to="/inversiones"
                className="px-4 py-2 hover:bg-muted rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Inversiones
              </Link>
              {isAuthenticated ? (
                <>
                  <Button onClick={() => { navigate('/publicar'); setIsOpen(false); }} className="btn-secondary">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Publicar
                  </Button>
                  <Button variant="ghost" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Salir
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" onClick={() => { navigate('/login'); setIsOpen(false); }}>
                    Ingresar
                  </Button>
                  <Button onClick={() => { navigate('/registro'); setIsOpen(false); }} className="btn-primary">
                    Crear cuenta
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
