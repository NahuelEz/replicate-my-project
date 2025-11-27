import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, TrendingUp, Wrench } from 'lucide-react';

const PublishSelector = () => {
  const navigate = useNavigate();

  const options = [
    {
      title: 'Publicar Propiedad',
      description: 'Publica tu departamento, casa, oficina o terreno',
      icon: Building2,
      path: '/publicar/propiedad',
      color: 'from-primary/20 to-primary/5',
    },
    {
      title: 'Publicar Inversión',
      description: 'Ofrece un proyecto de inversión inmobiliaria',
      icon: TrendingUp,
      path: '/publicar/inversion',
      color: 'from-accent/20 to-accent/5',
    },
    {
      title: 'Publicar Servicio',
      description: 'Ofrece servicios de construcción, diseño o instalaciones',
      icon: Wrench,
      path: '/publicar/servicio',
      color: 'from-secondary/20 to-secondary/5',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">¿Qué deseas publicar?</h1>
          <p className="text-muted-foreground text-lg">
            Elige el tipo de publicación que deseas realizar
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {options.map((option) => {
            const Icon = option.icon;
            return (
              <Card
                key={option.path}
                className="cursor-pointer transition-all hover:shadow-lg hover:scale-105 group"
                onClick={() => navigate(option.path)}
              >
                <CardHeader>
                  <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${option.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{option.title}</CardTitle>
                  <CardDescription className="text-base">
                    {option.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <span className="text-sm text-primary font-medium group-hover:underline">
                    Comenzar →
                  </span>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PublishSelector;
