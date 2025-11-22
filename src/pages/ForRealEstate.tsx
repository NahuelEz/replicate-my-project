import React from 'react';
import { Helmet } from 'react-helmet';
import { CheckCircle, BarChart, Users, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';

interface PlanCardProps {
  plan: { name: string; description: string; price: string };
  features: string[];
  recommended?: boolean;
}

const PlanCard = ({ plan, features, recommended }: PlanCardProps) => {
  const { toast } = useToast();
  const handleNotImplemented = () => {
    toast({
      title: "🚧 ¡Función no implementada!",
      description: "Esta función aún no está disponible, ¡pero puedes solicitarla en tu próximo mensaje! 🚀",
    });
  };

  return (
    <div className={`border rounded-lg p-8 flex flex-col ${recommended ? 'border-secondary bg-secondary/5 shadow-lg' : 'border-border'}`}>
      {recommended && (
        <div className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm font-semibold mb-4 self-start">
          Recomendado
        </div>
      )}
      <h3 className="text-2xl font-heading font-bold mb-2">{plan.name}</h3>
      <p className="text-muted-foreground mb-4">{plan.description}</p>
      <p className="text-4xl font-heading font-bold text-primary mb-6">{plan.price}</p>
      <ul className="space-y-3 mb-8 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <Button onClick={handleNotImplemented} className={recommended ? 'btn-secondary' : 'btn-primary'}>
        Contratar Plan
      </Button>
    </div>
  );
};

const ForRealEstate = () => {
  const plans = {
    gratuito: { name: 'Gratuito', description: 'Para empezar a publicar', price: 'Gratis' },
    destacado: { name: 'Destacado', description: 'Mayor visibilidad', price: '$25.000/mes' },
    premium: { name: 'Premium', description: 'Máxima exposición y herramientas', price: '$50.000/mes' },
  };

  const features = {
    gratuito: ['Hasta 10 propiedades', 'Soporte por email'],
    destacado: ['Hasta 50 propiedades', 'Publicaciones destacadas', 'Soporte prioritario', 'Estadísticas básicas'],
    premium: ['Propiedades ilimitadas', 'Publicaciones súper destacadas', 'Agente dedicado', 'CRM integrado', 'Reportes avanzados'],
  };

  return (
    <>
      <Helmet>
        <title>Para Inmobiliarias - PropiedadesArgentinas.com</title>
        <meta name="description" content="Planes y beneficios para inmobiliarias. Potenciá tu negocio con nuestra plataforma." />
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
                Potenciá tu Inmobiliaria con Nosotros
              </h1>
              <p className="text-xl mb-8 text-white/90">
                Llegá a miles de clientes potenciales con nuestras soluciones para profesionales inmobiliarios.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {[
                { icon: Users, title: 'Alcance Masivo', description: 'Miles de usuarios activos buscando propiedades diariamente' },
                { icon: BarChart, title: 'Reportes Detallados', description: 'Estadísticas y análisis de tus publicaciones' },
                { icon: Zap, title: 'Publicación Rápida', description: 'Publicá en minutos con nuestro sistema intuitivo' },
                { icon: CheckCircle, title: 'Soporte Dedicado', description: 'Asistencia personalizada para tu inmobiliaria' },
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-heading font-bold mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Plans */}
        <section className="py-16 bg-muted">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                  Planes para tu Inmobiliaria
                </h2>
                <p className="text-lg text-muted-foreground">
                  Elegí el plan que mejor se adapte a tus necesidades
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                <PlanCard plan={plans.gratuito} features={features.gratuito} />
                <PlanCard plan={plans.destacado} features={features.destacado} recommended />
                <PlanCard plan={plans.premium} features={features.premium} />
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ForRealEstate;
