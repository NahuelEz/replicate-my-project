-- Eliminar la política antigua que restringe a solo agentes y admins
DROP POLICY IF EXISTS "Usuarios autenticados pueden insertar propiedades" ON public.properties;

-- Crear nueva política que permite a todos los usuarios autenticados publicar
CREATE POLICY "Usuarios autenticados pueden insertar propiedades" 
ON public.properties 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);