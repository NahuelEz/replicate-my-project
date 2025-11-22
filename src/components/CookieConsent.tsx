import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const handleConsent = (consent: string) => {
    localStorage.setItem('cookie_consent', consent);
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'tween', ease: 'easeInOut' }}
          className="fixed bottom-0 left-0 right-0 bg-brand-gris-oscuro text-white p-4 shadow-lg z-50"
        >
          <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-center md:text-left">
              Usamos cookies para mejorar tu experiencia en nuestro sitio. Al continuar, aceptás nuestro uso de cookies.
            </p>
            <div className="flex items-center gap-4">
              <Button onClick={() => handleConsent('accepted')} className="bg-brand-celeste hover:bg-brand-celeste/90 text-white">
                Aceptar
              </Button>
              <Button onClick={() => handleConsent('rejected')} variant="secondary" className="bg-brand-gris-claro/20 text-white hover:bg-brand-gris-claro/30">
                Rechazar
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
