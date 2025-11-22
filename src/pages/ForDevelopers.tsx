import React from 'react';
import { Helmet } from 'react-helmet';
import { Building, TrendingUp, Target, Award, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const ForDevelopers = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleContact = () => {
    navigate('/contacto', { state: { subject: 'Desarrolladores' } });
  };

  return (
    <>
      <Helmet>
        <title>Para Desarrolladores - PropiedadesArgentinas.com</title>
        <meta name="description" content="Soluciones para desarrolladores. Mostrá tus emprendimientos a inversores y compradores." />
      </Helmet>
      <div className="min-h-screen bg-background">
        {/* Hero */}
        <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
                Impulsá tus Emprendimientos
              </h1>
              <p className="text-xl mb-8 text-white/90">
                Presentá tus proyectos a una audiencia calificada de inversores y compradores finales. La mejor vidriera para tus desarrollos.
              </p>
              <Button onClick={handleContact} size="lg" className="bg-white text-primary hover:bg-white/90">
                <Mail className="w-5 h-5 mr-2" />
                Contactanos
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              {[
                {
                  icon: Building,
                  title: 'Página Exclusiva',
                  description: 'Una sección dedicada para mostrar todos los detalles de tu proyecto.'
                },
                {
                  icon: Target,
                  title: 'Branding y Diseño',
                  description: 'Personalizá la página de tu emprendimiento con tu propia identidad de marca.'
                },
                {
                  icon: TrendingUp,
                  title: 'Marketing Digital',
                  description: 'Campañas segmentadas para atraer al público correcto.'
                },
                {
                  icon: Award,
                  title: 'Estadísticas y Reportes',
                  description: 'Seguimiento detallado de visitas, interesados y conversiones.'
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <feature.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-heading font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-muted">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto text-center"
            >
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                ¿Listo para mostrar tu proyecto?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Contactanos y un asesor te ayudará a diseñar la mejor estrategia para tu emprendimiento.
              </p>
              <Button onClick={handleContact} size="lg" className="btn-primary">
                Solicitar Información
              </Button>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ForDevelopers;
