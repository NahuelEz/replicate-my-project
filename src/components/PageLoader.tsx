import React from 'react';
import { motion } from 'framer-motion';

const PageLoader = () => {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <motion.div
        className="w-16 h-16 border-4 border-t-4 border-muted border-t-primary rounded-full"
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 1
        }}
      />
    </div>
  );
};

export default PageLoader;
