import React from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';

const Blog = () => {
  const { toast } = useToast();
  
  const handleNotImplemented = () => {
    toast({
      title: "🚧 ¡Función no implementada!",
      description: "Esta función aún no está disponible, ¡pero puedes solicitarla en tu próximo mensaje! 🚀",
    });
  };

  const posts = [
    { 
      id: 1, 
      title: '5 Consejos para comprar tu primera propiedad', 
      excerpt: 'Comprar una casa es una de las decisiones más importantes. Te guiamos en el proceso con estos consejos clave.', 
      date: '25 Julio, 2025', 
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800' 
    },
    { 
      id: 2, 
      title: 'El mercado inmobiliario post-pandemia: ¿Qué esperar?', 
      excerpt: 'Analizamos las tendencias actuales y futuras del mercado para que tomes decisiones informadas.', 
      date: '20 Julio, 2025', 
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800' 
    },
    { 
      id: 3, 
      title: 'Decoración de interiores: Tendencias 2025', 
      excerpt: 'Ideas y estilos para renovar tu hogar y darle un toque moderno y acogedor.', 
      date: '15 Julio, 2025', 
      image: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800' 
    },
  ];

  return (
    <>
      <Helmet>
        <title>Blog - PropiedadesArgentinas.com</title>
        <meta name="description" content="Noticias y consejos sobre el mercado inmobiliario, decoración y más." />
      </Helmet>
      <div className="min-h-screen bg-background py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-center mb-4">Nuestro Blog</h1>
            <p className="text-center text-muted-foreground text-lg mb-12">
              Noticias, consejos y tendencias del mercado inmobiliario
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white border rounded-lg overflow-hidden flex flex-col shadow-sm hover:shadow-xl transition-all duration-300 card-hover cursor-pointer"
                  onClick={handleNotImplemented}
                >
                  <div className="h-48 overflow-hidden">
                    <img 
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" 
                      alt={post.title} 
                      src={post.image} 
                    />
                  </div>
                  <div className="p-6 flex-grow flex flex-col">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <Calendar className="w-4 h-4" />
                      <span>{post.date}</span>
                    </div>
                    <h2 className="text-xl font-heading font-bold mb-3 flex-grow">{post.title}</h2>
                    <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                    <Button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNotImplemented();
                      }} 
                      variant="link" 
                      className="p-0 text-primary font-bold self-start hover:text-primary/80"
                    >
                      Leer más →
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Blog;
