import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  totalReviews?: number;
  size?: 'sm' | 'md' | 'lg';
}

const StarRating = ({ rating, totalReviews, size = 'md' }: StarRatingProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${
              star <= Math.round(rating) ? 'fill-brand-dorado text-brand-dorado' : 'text-muted'
            }`}
          />
        ))}
      </div>
      {totalReviews !== undefined && (
        <span className={`${textSizes[size]} text-muted-foreground`}>
          ({totalReviews})
        </span>
      )}
    </div>
  );
};

export default StarRating;
