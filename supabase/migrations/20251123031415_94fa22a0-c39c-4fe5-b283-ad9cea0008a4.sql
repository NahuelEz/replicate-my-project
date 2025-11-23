-- Tabla de favoritos
CREATE TABLE public.favorites (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id uuid NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, property_id)
);

-- Habilitar RLS en favorites
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para favorites
CREATE POLICY "Usuarios pueden ver sus propios favoritos"
ON public.favorites
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden agregar favoritos"
ON public.favorites
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden eliminar sus propios favoritos"
ON public.favorites
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Tabla de consultas sobre propiedades
CREATE TABLE public.property_inquiries (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id uuid NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text NOT NULL,
  inquiry_type text NOT NULL DEFAULT 'info',
  status text NOT NULL DEFAULT 'pending',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Habilitar RLS en property_inquiries
ALTER TABLE public.property_inquiries ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para property_inquiries
CREATE POLICY "Propietarios pueden ver consultas de sus propiedades"
ON public.property_inquiries
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.properties
    WHERE properties.id = property_inquiries.property_id
    AND properties.user_id = auth.uid()
  )
);

CREATE POLICY "Usuarios pueden ver sus propias consultas"
ON public.property_inquiries
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Cualquiera puede crear consultas"
ON public.property_inquiries
FOR INSERT
TO authenticated, anon
WITH CHECK (true);

CREATE POLICY "Propietarios pueden actualizar estado de consultas"
ON public.property_inquiries
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.properties
    WHERE properties.id = property_inquiries.property_id
    AND properties.user_id = auth.uid()
  )
);

-- Tabla de reseñas de profesionales
CREATE TABLE public.professional_reviews (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  professional_id uuid NOT NULL REFERENCES public.professionals(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text NOT NULL,
  service_type text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(professional_id, user_id)
);

-- Habilitar RLS en professional_reviews
ALTER TABLE public.professional_reviews ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para professional_reviews
CREATE POLICY "Todos pueden ver reseñas"
ON public.professional_reviews
FOR SELECT
TO authenticated, anon
USING (true);

CREATE POLICY "Usuarios autenticados pueden crear reseñas"
ON public.professional_reviews
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden actualizar sus propias reseñas"
ON public.professional_reviews
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden eliminar sus propias reseñas"
ON public.professional_reviews
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Trigger para actualizar updated_at en property_inquiries
CREATE TRIGGER update_property_inquiries_updated_at
BEFORE UPDATE ON public.property_inquiries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger para actualizar updated_at en professional_reviews
CREATE TRIGGER update_professional_reviews_updated_at
BEFORE UPDATE ON public.professional_reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Índices para mejorar el rendimiento
CREATE INDEX idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX idx_favorites_property_id ON public.favorites(property_id);
CREATE INDEX idx_property_inquiries_property_id ON public.property_inquiries(property_id);
CREATE INDEX idx_property_inquiries_user_id ON public.property_inquiries(user_id);
CREATE INDEX idx_professional_reviews_professional_id ON public.professional_reviews(professional_id);
CREATE INDEX idx_professional_reviews_user_id ON public.professional_reviews(user_id);