import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Footer = () => {
  const { toast } = useToast();

  const handleLinkClick = () => {
    toast({
      title: "🚧 ¡Función no implementada!",
      description: "Esta función aún no está disponible, ¡pero puedes solicitarla en tu próximo mensaje! 🚀",
    });
  };

  return (
    <footer className="bg-brand-gris-oscuro text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <Link to="/">
              <img
                src="https://storage.googleapis.com/hostinger-horizons-assets-prod/766655db-48f1-491b-bb1e-2352485b8e5d/f09d93f80cd18f724dfdf2b48374e699.png"
                alt="PropiedadesArgentinas.com Logo"
                className="h-10"
              />
            </Link>
            <p className="text-brand-gris-claro text-sm">
              La plataforma para encontrar tu próximo hogar o inversión en Argentina.
            </p>
            <div className="flex space-x-4">
              <button onClick={handleLinkClick} className="text-brand-gris-claro hover:text-brand-celeste transition-colors"><Facebook /></button>
              <button onClick={handleLinkClick} className="text-brand-gris-claro hover:text-brand-celeste transition-colors"><Twitter /></button>
              <button onClick={handleLinkClick} className="text-brand-gris-claro hover:text-brand-celeste transition-colors"><Instagram /></button>
              <button onClick={handleLinkClick} className="text-brand-gris-claro hover:text-brand-celeste transition-colors"><Linkedin /></button>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-lg font-heading text-brand-dorado">Navegación</p>
            <ul className="space-y-2 text-sm">
              <li><Link to="/comprar" className="text-brand-gris-claro hover:text-white">Comprar</Link></li>
              <li><Link to="/alquilar" className="text-brand-gris-claro hover:text-white">Alquilar</Link></li>
              <li><Link to="/alquiler-temporal" className="text-brand-gris-claro hover:text-white">Alquiler Temporal</Link></li>
              <li><Link to="/inversiones" className="text-brand-gris-claro hover:text-white">Inversiones</Link></li>
              <li><Link to="/servicios" className="text-brand-gris-claro hover:text-white">Servicios</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <p className="text-lg font-heading text-brand-dorado">Para Profesionales</p>
            <ul className="space-y-2 text-sm">
              <li><Link to="/publicar" className="text-brand-gris-claro hover:text-white">Publicar Propiedad</Link></li>
              <li><Link to="/para-inmobiliarias" className="text-brand-gris-claro hover:text-white">Para Inmobiliarias</Link></li>
              <li><Link to="/para-desarrolladores" className="text-brand-gris-claro hover:text-white">Para Desarrolladores</Link></li>
              <li><Link to="/blog" className="text-brand-gris-claro hover:text-white">Blog</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <p className="text-lg font-heading text-brand-dorado">Legal</p>
            <ul className="space-y-2 text-sm">
              <li><button onClick={handleLinkClick} className="text-brand-gris-claro hover:text-white">Términos y Condiciones</button></li>
              <li><button onClick={handleLinkClick} className="text-brand-gris-claro hover:text-white">Políticas de Privacidad</button></li>
              <li><Link to="/contacto" className="text-brand-gris-claro hover:text-white">Contacto</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-brand-marron pt-6 text-center text-sm text-brand-gris-claro">
          <p>&copy; {new Date().getFullYear()} PropiedadesArgentinas.com. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
