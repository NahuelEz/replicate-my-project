-- Create advertisements table
CREATE TABLE public.advertisements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  image_url TEXT,
  link_url TEXT,
  location TEXT NOT NULL DEFAULT 'sidebar',
  is_active BOOLEAN NOT NULL DEFAULT true,
  start_date DATE,
  end_date DATE,
  clicks INTEGER NOT NULL DEFAULT 0,
  impressions INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.advertisements ENABLE ROW LEVEL SECURITY;

-- Everyone can view active advertisements
CREATE POLICY "Todos pueden ver anuncios activos"
ON public.advertisements
FOR SELECT
USING (is_active = true);

-- Admins can manage all advertisements
CREATE POLICY "Admins pueden gestionar todos los anuncios"
ON public.advertisements
FOR ALL
USING (is_admin(auth.uid()));

-- Create trigger for updated_at
CREATE TRIGGER update_advertisements_updated_at
BEFORE UPDATE ON public.advertisements
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();