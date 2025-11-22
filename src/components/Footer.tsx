import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-brand-gris-oscuro text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Home className="w-8 h-8 text-primary" />
              <span className="text-xl font-heading font-bold">
                Propiedades<span className="text-primary">Argentinas</span>
              </span>
            </Link>
            <p className="text-sm text-gray-300">
              El portal líder en bienes raíces de Argentina. Encontrá tu propiedad ideal.
            </p>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h3 className="font-heading font-bold text-lg mb-4">Enlaces</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/comprar" className="text-gray-300 hover:text-primary transition-colors">Comprar</Link></li>
              <li><Link to="/alquilar" className="text-gray-300 hover:text-primary transition-colors">Alquilar</Link></li>
              <li><Link to="/inversiones" className="text-gray-300 hover:text-primary transition-colors">Inversiones</Link></li>
              <li><Link to="/servicios" className="text-gray-300 hover:text-primary transition-colors">Servicios</Link></li>
              <li><Link to="/blog" className="text-gray-300 hover:text-primary transition-colors">Blog</Link></li>
              <li><Link to="/contacto" className="text-gray-300 hover:text-primary transition-colors">Contacto</Link></li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="font-heading font-bold text-lg mb-4">Contacto</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>0810-123-7767</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>info@propiedadesargentinas.com</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Buenos Aires, Argentina</span>
              </li>
            </ul>
          </div>

          {/* Redes sociales */}
          <div>
            <h3 className="font-heading font-bold text-lg mb-4">Seguinos</h3>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2024 PropiedadesArgentinas.com. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
