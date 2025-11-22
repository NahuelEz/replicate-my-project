import React from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import HeroSection from '@/components/home/HeroSection';
import LookingForSection from '@/components/home/LookingForSection';
import FeaturedProperties from '@/components/home/FeaturedProperties';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import InvestmentProjectsPreview from '@/components/home/InvestmentProjectsPreview';
import PublishCTA from '@/components/home/PublishCTA';
import Testimonials from '@/components/home/Testimonials';

const Home = () => {
  const { properties, investmentProjects } = useData();
  const navigate = useNavigate();

  const featuredProperties = properties.filter(p => p.featured);

  return (
    <>
      <Helmet>
        <title>PropiedadesArgentinas.com - Tu hogar ideal te está esperando</title>
        <meta name="description" content="Encontrá tu propiedad ideal en Argentina. Miles de casas, departamentos y terrenos en venta y alquiler. Proyectos de inversión con alta rentabilidad." />
      </Helmet>
      
      <div className="min-h-screen">
        <HeroSection />
        <LookingForSection />
        <FeaturedProperties 
          properties={featuredProperties.length > 0 ? featuredProperties : properties}
          onSeeMore={() => navigate('/comprar')}
        />
        <WhyChooseUs />
        <InvestmentProjectsPreview projects={investmentProjects} />
        <PublishCTA />
        <Testimonials />
      </div>
    </>
  );
};

export default Home;
