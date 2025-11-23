-- Crear tabla de propiedades
CREATE TABLE public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  price TEXT NOT NULL,
  location TEXT NOT NULL,
  bedrooms INTEGER NOT NULL,
  bathrooms INTEGER NOT NULL,
  area NUMERIC NOT NULL,
  status TEXT DEFAULT 'activa',
  operation TEXT NOT NULL, -- 'Venta' o 'Alquiler'
  type TEXT NOT NULL, -- 'departamento', 'casa', 'oficina', etc.
  rental_type TEXT, -- 'tradicional' o 'temporal' (solo para alquileres)
  description TEXT,
  surface NUMERIC,
  covered_surface NUMERIC,
  rooms INTEGER,
  baths INTEGER,
  garage INTEGER,
  featured BOOLEAN DEFAULT false,
  images TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Crear índices para búsquedas comunes
CREATE INDEX idx_properties_user_id ON public.properties(user_id);
CREATE INDEX idx_properties_operation ON public.properties(operation);
CREATE INDEX idx_properties_type ON public.properties(type);
CREATE INDEX idx_properties_slug ON public.properties(slug);

-- Habilitar RLS
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Políticas RLS: Todos pueden ver propiedades activas
CREATE POLICY "Todos pueden ver propiedades activas"
ON public.properties
FOR SELECT
USING (status = 'activa' OR auth.uid() = user_id);

-- Solo el dueño puede insertar sus propias propiedades
CREATE POLICY "Usuarios pueden insertar sus propias propiedades"
ON public.properties
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Solo el dueño puede actualizar sus propiedades
CREATE POLICY "Usuarios pueden actualizar sus propias propiedades"
ON public.properties
FOR UPDATE
USING (auth.uid() = user_id);

-- Solo el dueño puede eliminar sus propiedades
CREATE POLICY "Usuarios pueden eliminar sus propias propiedades"
ON public.properties
FOR DELETE
USING (auth.uid() = user_id);

-- Trigger para actualizar updated_at
CREATE TRIGGER update_properties_updated_at
BEFORE UPDATE ON public.properties
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Crear tabla de proyectos de inversión
CREATE TABLE public.investment_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL, -- 'En pozo', 'En construcción', 'Entrega inmediata'
  delivery_date DATE NOT NULL,
  location TEXT NOT NULL,
  unit_types TEXT[] NOT NULL,
  min_investment NUMERIC NOT NULL,
  annual_return NUMERIC NOT NULL,
  capital_gain NUMERIC NOT NULL,
  modality TEXT NOT NULL, -- 'Fideicomiso', 'Renta garantizada', 'Reventa'
  description TEXT NOT NULL,
  images TEXT[] DEFAULT ARRAY[]::TEXT[],
  coordinates JSONB, -- {lat: number, lng: number}
  publisher JSONB, -- {name, avatar, reputation, memberSince, profileUrl}
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Índices
CREATE INDEX idx_investment_projects_user_id ON public.investment_projects(user_id);
CREATE INDEX idx_investment_projects_slug ON public.investment_projects(slug);
CREATE INDEX idx_investment_projects_status ON public.investment_projects(status);

-- Habilitar RLS
ALTER TABLE public.investment_projects ENABLE ROW LEVEL SECURITY;

-- Políticas: Todos pueden ver proyectos
CREATE POLICY "Todos pueden ver proyectos de inversión"
ON public.investment_projects
FOR SELECT
USING (true);

-- Solo el dueño puede insertar
CREATE POLICY "Usuarios pueden insertar sus propios proyectos"
ON public.investment_projects
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Solo el dueño puede actualizar
CREATE POLICY "Usuarios pueden actualizar sus propios proyectos"
ON public.investment_projects
FOR UPDATE
USING (auth.uid() = user_id);

-- Solo el dueño puede eliminar
CREATE POLICY "Usuarios pueden eliminar sus propios proyectos"
ON public.investment_projects
FOR DELETE
USING (auth.uid() = user_id);

-- Trigger para updated_at
CREATE TRIGGER update_investment_projects_updated_at
BEFORE UPDATE ON public.investment_projects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Crear tabla de profesionales
CREATE TABLE public.professionals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  avatar TEXT,
  specialty TEXT NOT NULL,
  category_slug TEXT NOT NULL,
  location TEXT NOT NULL,
  reputation JSONB NOT NULL, -- {rating: number, level: string}
  profile_reviews JSONB DEFAULT '[]'::JSONB, -- array de reviews
  services JSONB DEFAULT '[]'::JSONB, -- array de servicios
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Índices
CREATE INDEX idx_professionals_user_id ON public.professionals(user_id);
CREATE INDEX idx_professionals_category_slug ON public.professionals(category_slug);

-- Habilitar RLS
ALTER TABLE public.professionals ENABLE ROW LEVEL SECURITY;

-- Políticas: Todos pueden ver profesionales
CREATE POLICY "Todos pueden ver profesionales"
ON public.professionals
FOR SELECT
USING (true);

-- Solo el dueño puede insertar
CREATE POLICY "Usuarios pueden insertar su propio perfil profesional"
ON public.professionals
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Solo el dueño puede actualizar
CREATE POLICY "Usuarios pueden actualizar su propio perfil profesional"
ON public.professionals
FOR UPDATE
USING (auth.uid() = user_id);

-- Solo el dueño puede eliminar
CREATE POLICY "Usuarios pueden eliminar su propio perfil profesional"
ON public.professionals
FOR DELETE
USING (auth.uid() = user_id);

-- Trigger para updated_at
CREATE TRIGGER update_professionals_updated_at
BEFORE UPDATE ON public.professionals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Crear bucket de storage para imágenes de propiedades
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-images', 'property-images', true);

-- Políticas de storage: Todos pueden ver las imágenes
CREATE POLICY "Las imágenes son públicamente visibles"
ON storage.objects
FOR SELECT
USING (bucket_id = 'property-images');

-- Solo usuarios autenticados pueden subir imágenes
CREATE POLICY "Usuarios autenticados pueden subir imágenes"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'property-images' 
  AND auth.uid() IS NOT NULL
);

-- Solo el dueño puede actualizar sus imágenes
CREATE POLICY "Usuarios pueden actualizar sus propias imágenes"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'property-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Solo el dueño puede eliminar sus imágenes
CREATE POLICY "Usuarios pueden eliminar sus propias imágenes"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'property-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);