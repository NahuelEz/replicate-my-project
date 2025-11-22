import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Star, ShieldCheck } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface StarRatingProps {
  rating: number;
}

const StarRating = ({ rating }: StarRatingProps) => {
  const totalStars = 5;
  const filledStars = Math.round(rating);

  return (
    <div className="flex items-center">
      {[...Array(totalStars)].map((_, index) => (
        <Star
          key={index}
          className={`w-5 h-5 ${
            index < filledStars ? 'text-brand-dorado fill-current' : 'text-muted'
          }`}
        />
      ))}
    </div>
  );
};

interface Publisher {
  name: string;
  avatar: string;
  reputation: number;
  memberSince: string;
  profileUrl: string;
}

interface DeveloperProfileCardProps {
  publisher: Publisher;
}

const DeveloperProfileCard = ({ publisher }: DeveloperProfileCardProps) => {
    if (!publisher) return null;

    const { name, avatar, reputation, memberSince, profileUrl } = publisher;

    return (
        <div className="bg-card border rounded-lg p-6 shadow-md">
            <h3 className="text-xl font-bold font-heading mb-4">Publicado por</h3>
            <div className="flex items-center mb-4">
                <img  src={avatar || "https://images.unsplash.com/photo-1616352595676-409c19b3cb4a"} alt={`Avatar de ${name}`} className="w-16 h-16 rounded-full mr-4 object-cover" />
                <div>
                    <h4 className="font-bold text-lg">{name}</h4>
                    <p className="text-sm text-muted-foreground">Activo desde {new Date(memberSince).getFullYear()}</p>
                </div>
            </div>
            
            <div className="mb-4">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">Reputación</span>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <StarRating rating={reputation} />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Reputación Nivel {reputation} de 5</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
                {reputation > 0 ? (
                    <div className="w-full bg-muted rounded-full h-2.5 mt-2">
                        <div 
                            className="bg-brand-dorado h-2.5 rounded-full" 
                            style={{ width: `${(reputation / 5) * 100}%` }}
                        ></div>
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground mt-2">Sin reputación registrada</p>
                )}
            </div>
            
            <Link to={profileUrl}>
                <Button variant="outline" className="w-full">
                    <ShieldCheck className="w-4 h-4 mr-2" />
                    Ver perfil del desarrollador
                </Button>
            </Link>
        </div>
    );
};

export default DeveloperProfileCard;
