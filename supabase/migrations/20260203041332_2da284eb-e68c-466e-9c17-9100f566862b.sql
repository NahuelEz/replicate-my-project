-- Add geolocation fields to advertisements
ALTER TABLE public.advertisements
ADD COLUMN latitude DECIMAL(10, 8),
ADD COLUMN longitude DECIMAL(11, 8),
ADD COLUMN radius_km INTEGER DEFAULT 50;

-- Create storage bucket for ad images
INSERT INTO storage.buckets (id, name, public)
VALUES ('ad-images', 'ad-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to view ad images
CREATE POLICY "Public can view ad images"
ON storage.objects FOR SELECT
USING (bucket_id = 'ad-images');

-- Allow admins to upload ad images
CREATE POLICY "Admins can upload ad images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'ad-images' AND is_admin(auth.uid()));

-- Allow admins to update ad images
CREATE POLICY "Admins can update ad images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'ad-images' AND is_admin(auth.uid()));

-- Allow admins to delete ad images
CREATE POLICY "Admins can delete ad images"
ON storage.objects FOR DELETE
USING (bucket_id = 'ad-images' AND is_admin(auth.uid()));