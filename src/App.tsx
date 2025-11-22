import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DataProvider } from "@/contexts/DataContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Home from "./pages/Home";
import BuyProperties from "./pages/BuyProperties";
import RentProperties from "./pages/RentProperties";
import Investments from "./pages/Investments";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import ForDevelopers from "./pages/ForDevelopers";
import ForRealEstate from "./pages/ForRealEstate";
import Services from "./pages/Services";
import NotFound from "./pages/NotFound";

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
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/comprar" element={<BuyProperties />} />
                  <Route path="/alquilar" element={<RentProperties />} />
                  <Route path="/inversiones" element={<Investments />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/contacto" element={<Contact />} />
                  <Route path="/panel" element={<Dashboard />} />
                  <Route path="/para-desarrolladores" element={<ForDevelopers />} />
                  <Route path="/para-inmobiliarias" element={<ForRealEstate />} />
                  <Route path="/servicios" element={<Services />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </BrowserRouter>
        </DataProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
