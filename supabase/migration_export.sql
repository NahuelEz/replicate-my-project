-- ============================================
-- MIGRATION EXPORT FOR REAL ESTATE PLATFORM
-- ============================================
-- This file contains the complete database schema
-- Use this to migrate the project to another account
-- 
-- INSTRUCTIONS:
-- 1. Create a new Supabase project
-- 2. Run this SQL in the SQL Editor
-- 3. Configure authentication settings (enable auto-confirm)
-- 4. Create storage bucket: property-images (public)
-- ============================================

-- ============================================
-- 1. CREATE ENUMS
-- ============================================

CREATE TYPE public.app_role AS ENUM ('admin', 'real_estate_agent', 'user');

-- ============================================
-- 2. CREATE TABLES
-- ============================================

-- Profiles table
CREATE TABLE public.profiles (
  id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  phone text,
  whatsapp text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- User roles table
CREATE TABLE public.user_roles (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role app_role NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id),
  UNIQUE (user_id, role)
);

-- Properties table
CREATE TABLE public.properties (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  slug text NOT NULL,
  description text,
  price text NOT NULL,
  location text NOT NULL,
  type text NOT NULL,
  operation text NOT NULL,
  rental_type text,
  status text DEFAULT 'activa',
  area numeric NOT NULL,
  surface numeric,
  covered_surface numeric,
  bedrooms integer NOT NULL,
  bathrooms integer NOT NULL,
  rooms integer,
  baths integer,
  garage integer,
  featured boolean DEFAULT false,
  images text[] DEFAULT ARRAY[]::text[],
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id),
  UNIQUE (slug)
);

-- Favorites table
CREATE TABLE public.favorites (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  property_id uuid NOT NULL REFERENCES public.properties ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (id),
  UNIQUE (user_id, property_id)
);

-- Property inquiries table
CREATE TABLE public.property_inquiries (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES public.properties ON DELETE CASCADE,
  user_id uuid,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text NOT NULL,
  inquiry_type text NOT NULL DEFAULT 'info',
  status text NOT NULL DEFAULT 'pending',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Investment projects table
CREATE TABLE public.investment_projects (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  slug text NOT NULL,
  description text NOT NULL,
  location text NOT NULL,
  status text NOT NULL,
  modality text NOT NULL,
  unit_types text[] NOT NULL,
  min_investment numeric NOT NULL,
  annual_return numeric NOT NULL,
  capital_gain numeric NOT NULL,
  delivery_date date NOT NULL,
  images text[] DEFAULT ARRAY[]::text[],
  coordinates jsonb,
  publisher jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id),
  UNIQUE (slug)
);

-- Professionals table
CREATE TABLE public.professionals (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  specialty text NOT NULL,
  category_slug text NOT NULL,
  location text NOT NULL,
  avatar text,
  reputation jsonb NOT NULL,
  services jsonb DEFAULT '[]'::jsonb,
  profile_reviews jsonb DEFAULT '[]'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id)
);

-- Professional reviews table
CREATE TABLE public.professional_reviews (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  professional_id uuid NOT NULL REFERENCES public.professionals ON DELETE CASCADE,
  user_id uuid NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text NOT NULL,
  service_type text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- ============================================
-- 3. CREATE FUNCTIONS
-- ============================================

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', 'Usuario')
  );
  RETURN new;
END;
$$;

-- Function to check if user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(_user_id, 'admin')
$$;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ============================================
-- 4. CREATE TRIGGERS
-- ============================================

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Triggers for updated_at columns
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_investment_projects_updated_at
  BEFORE UPDATE ON public.investment_projects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_professionals_updated_at
  BEFORE UPDATE ON public.professionals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_property_inquiries_updated_at
  BEFORE UPDATE ON public.property_inquiries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_professional_reviews_updated_at
  BEFORE UPDATE ON public.professional_reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- 5. ENABLE ROW LEVEL SECURITY
-- ============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investment_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_reviews ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 6. CREATE RLS POLICIES
-- ============================================

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- User roles policies
CREATE POLICY "Usuarios pueden ver sus propios roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id OR is_admin(auth.uid()));

CREATE POLICY "Solo admins pueden insertar roles"
  ON public.user_roles FOR INSERT
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Solo admins pueden actualizar roles"
  ON public.user_roles FOR UPDATE
  USING (is_admin(auth.uid()));

CREATE POLICY "Solo admins pueden eliminar roles"
  ON public.user_roles FOR DELETE
  USING (is_admin(auth.uid()));

-- Properties policies
CREATE POLICY "Todos pueden ver propiedades activas"
  ON public.properties FOR SELECT
  USING (status = 'activa' OR auth.uid() = user_id);

CREATE POLICY "Admins pueden ver todas las propiedades"
  ON public.properties FOR SELECT
  USING (is_admin(auth.uid()));

CREATE POLICY "Usuarios autenticados pueden insertar propiedades"
  ON public.properties FOR INSERT
  WITH CHECK (
    auth.uid() = user_id 
    AND (has_role(auth.uid(), 'real_estate_agent') OR has_role(auth.uid(), 'admin'))
  );

CREATE POLICY "Usuarios pueden actualizar sus propias propiedades"
  ON public.properties FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins pueden actualizar todas las propiedades"
  ON public.properties FOR UPDATE
  USING (is_admin(auth.uid()));

CREATE POLICY "Usuarios pueden eliminar sus propias propiedades"
  ON public.properties FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins pueden eliminar todas las propiedades"
  ON public.properties FOR DELETE
  USING (is_admin(auth.uid()));

-- Favorites policies
CREATE POLICY "Usuarios pueden ver sus propios favoritos"
  ON public.favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden agregar favoritos"
  ON public.favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden eliminar sus propios favoritos"
  ON public.favorites FOR DELETE
  USING (auth.uid() = user_id);

-- Property inquiries policies
CREATE POLICY "Cualquiera puede crear consultas"
  ON public.property_inquiries FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Usuarios pueden ver sus propias consultas"
  ON public.property_inquiries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Propietarios pueden ver consultas de sus propiedades"
  ON public.property_inquiries FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.properties
      WHERE properties.id = property_inquiries.property_id
      AND properties.user_id = auth.uid()
    )
  );

CREATE POLICY "Propietarios pueden actualizar estado de consultas"
  ON public.property_inquiries FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.properties
      WHERE properties.id = property_inquiries.property_id
      AND properties.user_id = auth.uid()
    )
  );

-- Investment projects policies
CREATE POLICY "Todos pueden ver proyectos de inversión"
  ON public.investment_projects FOR SELECT
  USING (true);

CREATE POLICY "Usuarios pueden insertar sus propios proyectos"
  ON public.investment_projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden actualizar sus propios proyectos"
  ON public.investment_projects FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden eliminar sus propios proyectos"
  ON public.investment_projects FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins pueden gestionar todos los proyectos"
  ON public.investment_projects FOR ALL
  USING (is_admin(auth.uid()));

-- Professionals policies
CREATE POLICY "Todos pueden ver profesionales"
  ON public.professionals FOR SELECT
  USING (true);

CREATE POLICY "Usuarios pueden insertar su propio perfil profesional"
  ON public.professionals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden actualizar su propio perfil profesional"
  ON public.professionals FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden eliminar su propio perfil profesional"
  ON public.professionals FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins pueden gestionar todos los profesionales"
  ON public.professionals FOR ALL
  USING (is_admin(auth.uid()));

-- Professional reviews policies
CREATE POLICY "Todos pueden ver reseñas"
  ON public.professional_reviews FOR SELECT
  USING (true);

CREATE POLICY "Usuarios autenticados pueden crear reseñas"
  ON public.professional_reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden actualizar sus propias reseñas"
  ON public.professional_reviews FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden eliminar sus propias reseñas"
  ON public.professional_reviews FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- 7. CREATE INDEXES
-- ============================================

CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_user_roles_role ON public.user_roles(role);
CREATE INDEX idx_properties_user_id ON public.properties(user_id);
CREATE INDEX idx_properties_status ON public.properties(status);
CREATE INDEX idx_properties_operation ON public.properties(operation);
CREATE INDEX idx_properties_type ON public.properties(type);
CREATE INDEX idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX idx_favorites_property_id ON public.favorites(property_id);
CREATE INDEX idx_property_inquiries_property_id ON public.property_inquiries(property_id);
CREATE INDEX idx_property_inquiries_user_id ON public.property_inquiries(user_id);
CREATE INDEX idx_investment_projects_user_id ON public.investment_projects(user_id);
CREATE INDEX idx_professionals_user_id ON public.professionals(user_id);
CREATE INDEX idx_professionals_category_slug ON public.professionals(category_slug);
CREATE INDEX idx_professional_reviews_professional_id ON public.professional_reviews(professional_id);
CREATE INDEX idx_professional_reviews_user_id ON public.professional_reviews(user_id);

-- ============================================
-- 8. STORAGE CONFIGURATION (Manual Step)
-- ============================================

-- NOTE: Storage buckets must be created manually in the Supabase Dashboard
-- Create a bucket named: property-images
-- Set it as PUBLIC
-- Then run these storage policies:

/*
CREATE POLICY "Public Access"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'property-images');

CREATE POLICY "Authenticated users can upload"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'property-images' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update their own files"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'property-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own files"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'property-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
*/

-- ============================================
-- MIGRATION COMPLETE
-- ============================================
-- Next steps:
-- 1. Configure authentication settings (auto-confirm email)
-- 2. Create storage bucket: property-images (public)
-- 3. Apply storage policies (see section 8 above)
-- 4. Update environment variables in your app
-- 5. Test all functionality
-- ============================================
