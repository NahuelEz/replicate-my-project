import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Helmet } from "react-helmet";
import { DataProvider } from "@/contexts/DataContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageLoader from "@/components/PageLoader";
import CookieConsent from "@/components/CookieConsent";
import ProtectedRoute from "@/components/ProtectedRoute";

// Lazy load pages
const Home = lazy(() => import("./pages/Home"));
const BuyProperties = lazy(() => import("./pages/BuyProperties"));
const RentProperties = lazy(() => import("./pages/RentProperties"));
const Investments = lazy(() => import("./pages/Investments"));
const Blog = lazy(() => import("./pages/Blog"));
const Contact = lazy(() => import("./pages/Contact"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const PublishProperty = lazy(() => import("./pages/PublishProperty"));
const PublishSelector = lazy(() => import("./pages/PublishSelector"));
const Admin = lazy(() => import("./pages/Admin"));
const ForDevelopers = lazy(() => import("./pages/ForDevelopers"));
const ForRealEstate = lazy(() => import("./pages/ForRealEstate"));
const Services = lazy(() => import("./pages/Services"));
const Professionals = lazy(() => import("./pages/services/Professionals"));
const ProfessionalProfile = lazy(() => import("./pages/services/ProfessionalProfile"));
const ServiceDetail = lazy(() => import("./pages/services/ServiceDetail"));
const PropertyDetail = lazy(() => import("./pages/PropertyDetail"));
const Auth = lazy(() => import("./pages/Auth"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <DataProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="flex flex-col min-h-screen">
              <Helmet>
                <title>PropiedadesArgentinas.com - Propiedades en Venta y Alquiler</title>
                <meta name="description" content="Encontrá tu propiedad ideal en Argentina. Miles de casas, departamentos y terrenos en venta y alquiler. La plataforma inmobiliaria líder del país." />
              </Helmet>
              
              <Header />
              
              <main className="flex-1">
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/comprar" element={<BuyProperties />} />
                    <Route path="/comprar/departamento" element={<BuyProperties />} />
                    <Route path="/comprar/casa" element={<BuyProperties />} />
                    <Route path="/comprar/ph" element={<BuyProperties />} />
                    <Route path="/comprar/terreno" element={<BuyProperties />} />
                    <Route path="/alquilar" element={<RentProperties />} />
                    <Route path="/alquiler-temporal" element={<RentProperties />} />
                    <Route path="/alquilar/oficina" element={<RentProperties />} />
                    <Route path="/alquilar/local" element={<RentProperties />} />
                    <Route path="/inversiones" element={<Investments />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/contacto" element={<Contact />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/login" element={<Auth />} />
                    <Route path="/registro" element={<Auth />} />
                    <Route path="/panel" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/publicar" element={<ProtectedRoute><PublishSelector /></ProtectedRoute>} />
                    <Route path="/publicar/propiedad" element={<ProtectedRoute><PublishProperty /></ProtectedRoute>} />
                    <Route path="/publicar/inversion" element={<ProtectedRoute><PublishProperty /></ProtectedRoute>} />
                    <Route path="/publicar/servicio" element={<ProtectedRoute><PublishProperty /></ProtectedRoute>} />
                    <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
                    <Route path="/para-desarrolladores" element={<ForDevelopers />} />
                    <Route path="/para-inmobiliarias" element={<ForRealEstate />} />
                    <Route path="/servicios" element={<Services />} />
                    <Route path="/servicios/arquitectura-proyectos" element={<Professionals />} />
                    <Route path="/servicios/electricistas" element={<Professionals />} />
                    <Route path="/servicios/consultores-inmobiliarios" element={<Professionals />} />
                    <Route path="/servicios/:categorySlug" element={<Professionals />} />
                    <Route path="/servicios/profesionales/:professionalId" element={<ProfessionalProfile />} />
                    <Route path="/servicio/:professionalId/:serviceId" element={<ServiceDetail />} />
                    <Route path="/propiedad/:id" element={<PropertyDetail />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </main>
              
              <Footer />
              <CookieConsent />
            </div>
          </BrowserRouter>
        </DataProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
