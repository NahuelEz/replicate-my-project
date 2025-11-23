-- Crear enum para roles de usuario
CREATE TYPE public.app_role AS ENUM ('admin', 'real_estate_agent', 'user');

-- Crear tabla de roles de usuario
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Habilitar RLS en user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Función de seguridad para verificar roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
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

-- Función para verificar si el usuario es admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(_user_id, 'admin')
$$;

-- Políticas RLS para user_roles
CREATE POLICY "Usuarios pueden ver sus propios roles"
  ON public.user_roles
  FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

CREATE POLICY "Solo admins pueden insertar roles"
  ON public.user_roles
  FOR INSERT
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Solo admins pueden actualizar roles"
  ON public.user_roles
  FOR UPDATE
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Solo admins pueden eliminar roles"
  ON public.user_roles
  FOR DELETE
  USING (public.is_admin(auth.uid()));

-- Actualizar políticas de properties para permitir a agentes inmobiliarios publicar
DROP POLICY IF EXISTS "Usuarios pueden insertar sus propias propiedades" ON public.properties;

CREATE POLICY "Usuarios autenticados pueden insertar propiedades"
  ON public.properties
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND 
    (public.has_role(auth.uid(), 'real_estate_agent') OR public.has_role(auth.uid(), 'admin'))
  );

-- Política para que admins puedan ver y gestionar todas las propiedades
CREATE POLICY "Admins pueden ver todas las propiedades"
  ON public.properties
  FOR SELECT
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins pueden actualizar todas las propiedades"
  ON public.properties
  FOR UPDATE
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins pueden eliminar todas las propiedades"
  ON public.properties
  FOR DELETE
  USING (public.is_admin(auth.uid()));

-- Política para investment_projects
CREATE POLICY "Admins pueden gestionar todos los proyectos"
  ON public.investment_projects
  FOR ALL
  USING (public.is_admin(auth.uid()));

-- Política para professionals
CREATE POLICY "Admins pueden gestionar todos los profesionales"
  ON public.professionals
  FOR ALL
  USING (public.is_admin(auth.uid()));

-- Índices para mejor rendimiento
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_user_roles_role ON public.user_roles(role);