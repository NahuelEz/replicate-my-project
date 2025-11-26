import React from 'react';
import { Helmet } from 'react-helmet';
import { useData } from '@/contexts/DataContext';
import HeroSection from '@/components/home/HeroSection';
import LookingForSection from '@/components/home/LookingForSection';
import FeaturedProperties from '@/components/home/FeaturedProperties';
import LatestProperties from '@/components/home/LatestProperties';
import AdPlaceholder from '@/components/AdPlaceholder';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import PopularZones from '@/components/home/PopularZones';
import InvestmentProjectsPreview from '@/components/home/InvestmentProjectsPreview';
import Testimonials from '@/components/home/Testimonials';
import PublishCTA from '@/components/home/PublishCTA';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { properties, investmentProjects } = useData();
  const navigate = useNavigate();

  const featuredProperties = properties.filter(p => p.featured);

  return (
    <>
      <Helmet>
        <title>PropiedadesArgentinas.com - Tu próximo hogar está acá</title>
        <meta name="description" content="El portal número uno para comprar, alquilar e invertir en propiedades en Argentina. Miles de opciones disponibles." />
      </Helmet>
      
      <div className="min-h-screen">
        <HeroSection />
        <LookingForSection />
        <FeaturedProperties 
          properties={featuredProperties.length > 0 ? featuredProperties : properties}
          onSeeMore={() => navigate('/comprar')}
        />
        {properties.length > 3 && <LatestProperties properties={properties} />}
        <div className="container mx-auto px-4 py-12">
          <AdPlaceholder className="min-h-[200px]" />
        </div>
        <WhyChooseUs />
        <PopularZones />
        <InvestmentProjectsPreview projects={investmentProjects} />
        <div className="container mx-auto px-4 py-12">
          <AdPlaceholder className="min-h-[200px]" />
        </div>
        <Testimonials />
        <PublishCTA />
      </div>
    </>
  );
};

export default Home;
