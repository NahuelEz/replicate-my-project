import React from 'react';
import { Heart, Share2, ChevronLeft, ChevronRight, Maximize } from 'lucide-react';

interface PropertyGalleryProps {
  images: string[];
  title: string;
  currentImageIndex: number;
  onNextImage: () => void;
  onPrevImage: () => void;
  onFavoriteClick: () => void;
  onShare: () => void;
  onContact: (source: string) => void;
  isFavorite: boolean;
}

const PropertyGallery = ({ 
  images, 
  title, 
  currentImageIndex, 
  onNextImage, 
  onPrevImage, 
  onFavoriteClick, 
  onShare, 
  onContact, 
  isFavorite 
}: PropertyGalleryProps) => {
  return (
    <div className="relative h-96 md:h-[500px] overflow-hidden rounded-lg">
      <img   
        className="w-full h-full object-cover"
        alt={`${title} - Imagen ${currentImageIndex + 1}`}
        src={images[currentImageIndex] || "https://images.unsplash.com/photo-1655315921980-767062e70bcc"} 
      />
      
      {/* Navigation arrows */}
      <button
        onClick={onPrevImage}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
        aria-label="Imagen anterior"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={onNextImage}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
        aria-label="Siguiente imagen"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Image counter */}
      <div className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1 rounded-md text-sm">
        {currentImageIndex + 1} / {images.length}
      </div>

      {/* Action buttons */}
      <div className="absolute top-4 right-4 flex space-x-2">
        <button
          onClick={onFavoriteClick}
          className={`p-2 rounded-full transition-all duration-200 ${
            isFavorite 
              ? 'bg-red-500 text-white' 
              : 'bg-white/80 text-foreground hover:bg-white hover:text-red-500'
          }`}
          aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
        <button
          onClick={onShare}
          className="p-2 bg-white/80 text-foreground rounded-full hover:bg-white transition-colors"
          aria-label="Compartir"
        >
          <Share2 className="w-5 h-5" />
        </button>
        <button
          onClick={() => onContact('gallery')}
          className="p-2 bg-white/80 text-foreground rounded-full hover:bg-white transition-colors"
          aria-label="Ver en pantalla completa"
        >
          <Maximize className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default PropertyGallery;
