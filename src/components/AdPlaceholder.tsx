import React from 'react';
import { Megaphone } from 'lucide-react';

interface AdPlaceholderProps {
  className?: string;
}

const AdPlaceholder = ({ className = '' }: AdPlaceholderProps) => {
  return (
    <div
      className={`flex flex-col items-center justify-center bg-muted border-2 border-dashed border-border rounded-lg p-8 text-center text-muted-foreground ${className}`}
    >
      <Megaphone className="w-12 h-12 mb-4" />
      <h3 className="text-lg font-bold">Lugar publicitario disponible</h3>
      <p className="text-sm mt-1">Contactate para anunciar aquí.</p>
    </div>
  );
};

export default AdPlaceholder;
