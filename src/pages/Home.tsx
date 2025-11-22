import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Home as HomeIcon, Building, TrendingUp, MapPin, Award, Users, Shield } from 'lucide-react';
import PropertyCard from '@/components/PropertyCard';
import { useData } from '@/contexts/DataContext';

const Home = () => {
  const navigate = useNavigate();
  const { properties, investmentProjects } = useData();
  const featuredProperties = properties.filter(p => p.featured);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary to-primary/80 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }} />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="font-heading text-5xl md:text-6xl font-bold mb-6">
              Encontrá tu hogar ideal
            </h1>
            <p className="text-xl mb-8 text-white/90">
              El portal líder en bienes raíces de Argentina. Miles de propiedades para comprar, alquilar e invertir.
            </p>
            
            {/* Search Bar */}
            <div className="bg-white rounded-lg p-2 shadow-2xl">
              <div className="flex flex-col md:flex-row gap-2">
                <div className="flex-1 relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    placeholder="Ubicación (ej: Palermo, CABA)"
                    className="pl-10 border-0 focus-visible:ring-0 text-foreground"
                  />
                </div>
                <Button onClick={() => navigate('/comprar')} className="btn-primary px-8">
                  <Search className="w-5 h-5 mr-2" />
                  Buscar
                </Button>
              </div>
            </div>

            {/* Quick Links */}
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Button onClick={() => navigate('/comprar')} variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                <HomeIcon className="w-4 h-4 mr-2" />
                Comprar
              </Button>
              <Button onClick={() => navigate('/alquilar')} variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                <Building className="w-4 h-4 mr-2" />
                Alquilar
              </Button>
              <Button onClick={() => navigate('/inversiones')} variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                <TrendingUp className="w-4 h-4 mr-2" />
                Invertir
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-12">
              <h2 className="font-heading text-4xl font-bold text-foreground mb-4">
                Propiedades Destacadas
              </h2>
              <p className="text-muted-foreground text-lg">
                Las mejores oportunidades del mercado inmobiliario argentino
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {featuredProperties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <PropertyCard property={property} />
                </motion.div>
              ))}
            </div>

            <div className="text-center">
              <Button onClick={() => navigate('/comprar')} size="lg" className="btn-primary">
                Ver todas las propiedades
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-12">
              <h2 className="font-heading text-4xl font-bold text-foreground mb-4">
                ¿Por qué elegir PropiedadesArgentinas?
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-heading text-xl font-bold mb-2">Confianza</h3>
                <p className="text-muted-foreground">
                  Más de 10 años conectando compradores y vendedores
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-heading text-xl font-bold mb-2">Comunidad</h3>
                <p className="text-muted-foreground">
                  Miles de usuarios activos buscando su propiedad ideal
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-heading text-xl font-bold mb-2">Seguridad</h3>
                <p className="text-muted-foreground">
                  Verificamos todas las publicaciones para tu tranquilidad
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Investment Projects Preview */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-12">
              <h2 className="font-heading text-4xl font-bold text-foreground mb-4">
                Proyectos de Inversión
              </h2>
              <p className="text-muted-foreground text-lg">
                Invertí en desarrollos inmobiliarios con alta rentabilidad
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {investmentProjects.slice(0, 2).map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
                  onClick={() => navigate(`/proyecto/${project.slug}`)}
                >
                  <div className="h-56 overflow-hidden">
                    <img
                      src={project.images[0]}
                      alt={project.name}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full mb-3 ${
                      project.status === 'En pozo' ? 'bg-yellow-100 text-yellow-800' :
                      project.status === 'En construcción' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {project.status}
                    </span>
                    <h3 className="font-heading text-2xl font-bold mb-2">{project.name}</h3>
                    <p className="text-muted-foreground flex items-center gap-2 mb-4">
                      <MapPin className="w-4 h-4" />
                      {project.location}
                    </p>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Retorno anual</p>
                        <p className="text-lg font-bold text-primary">{project.annualReturn}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Ganancia</p>
                        <p className="text-lg font-bold text-primary">{project.capitalGain}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Desde</p>
                        <p className="text-lg font-bold text-primary">USD {project.minInvestment.toLocaleString()}</p>
                      </div>
                    </div>
                    <Button className="w-full btn-primary">Ver proyecto</Button>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="text-center">
              <Button onClick={() => navigate('/inversiones')} size="lg" className="btn-secondary">
                Ver todos los proyectos
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-secondary to-secondary/80">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-heading text-4xl font-bold text-secondary-foreground mb-4">
              ¿Sos profesional inmobiliario?
            </h2>
            <p className="text-lg text-secondary-foreground/80 mb-8 max-w-2xl mx-auto">
              Publicá tus propiedades y llegá a miles de potenciales compradores y inquilinos
            </p>
            <Button onClick={() => navigate('/publicar')} size="lg" className="bg-white text-secondary hover:bg-white/90">
              Publicar ahora
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
