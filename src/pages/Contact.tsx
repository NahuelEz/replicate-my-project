import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';

const Contact = () => {
  const { toast } = useToast();
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    honeypot: ''
  });

  useEffect(() => {
    if (location.state?.subject) {
      setFormData(prev => ({ 
        ...prev, 
        message: `Hola, estoy interesado/a en el servicio de ${location.state.subject}. Quisiera recibir más información.` 
      }));
    }
  }, [location.state]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({...prev, [name]: value}));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(formData.honeypot) {
      return;
    }
    console.log("Form submitted:", formData);
    toast({
      title: "Mensaje Enviado",
      description: "Gracias por contactarnos. Te responderemos a la brevedad.",
    });
    setFormData({ name: '', email: '', phone: '', message: '', honeypot: '' });
  };

  return (
    <>
      <Helmet>
        <title>Contacto - PropiedadesArgentinas.com</title>
        <meta name="description" content="Contactate con nosotros. Envianos tu consulta a través de nuestro formulario o encontrá nuestros datos de contacto." />
      </Helmet>
      <div className="min-h-screen bg-background py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-center mb-4">Contacto</h1>
            <p className="text-center text-muted-foreground text-lg mb-12">
              Estamos para ayudarte. Envianos tu consulta
            </p>
            
            <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
              {/* Contact Form */}
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-heading font-bold mb-6">Envianos tu consulta</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nombre completo</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      type="text" 
                      placeholder="Nombre completo" 
                      required 
                      value={formData.name} 
                      onChange={handleChange} 
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      placeholder="tu@email.com" 
                      required 
                      value={formData.email} 
                      onChange={handleChange} 
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Teléfono (opcional)</Label>
                    <Input 
                      id="phone" 
                      name="phone" 
                      type="tel" 
                      placeholder="+54 11 1234-5678" 
                      value={formData.phone} 
                      onChange={handleChange} 
                    />
                  </div>
                  <div>
                    <Label htmlFor="message">Mensaje</Label>
                    <Textarea 
                      id="message" 
                      name="message" 
                      rows={5} 
                      placeholder="Escribe tu consulta aquí..." 
                      required 
                      value={formData.message} 
                      onChange={handleChange} 
                    />
                  </div>
                  {/* Honeypot field (hidden from users) */}
                  <input 
                    type="text" 
                    name="honeypot" 
                    value={formData.honeypot} 
                    onChange={handleChange} 
                    className="hidden" 
                    tabIndex={-1} 
                    autoComplete="off" 
                  />
                  <Button type="submit" className="w-full btn-primary">
                    Enviar mensaje
                  </Button>
                </form>
              </div>

              {/* Contact Info */}
              <div className="space-y-6">
                <div className="bg-white p-8 rounded-lg shadow-md">
                  <h2 className="text-2xl font-heading font-bold mb-6">Información de contacto</h2>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Phone className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Teléfono</h3>
                        <p className="text-muted-foreground">0810-123-7767</p>
                        <p className="text-sm text-muted-foreground">Lun a Vie, 9:00 - 18:00hs</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Mail className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Email</h3>
                        <p className="text-muted-foreground">info@propiedadesargentinas.com</p>
                        <p className="text-sm text-muted-foreground">Respondemos en 24hs</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Oficina</h3>
                        <p className="text-muted-foreground">Av. Santa Fe 1234</p>
                        <p className="text-muted-foreground">Buenos Aires, Argentina</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-primary to-primary/80 p-8 rounded-lg shadow-md text-white">
                  <h3 className="text-xl font-heading font-bold mb-2">¿Sos profesional inmobiliario?</h3>
                  <p className="mb-4 text-white/90">Publicá tus propiedades y llegá a miles de clientes</p>
                  <Button variant="secondary" className="w-full">
                    Más información
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Contact;
