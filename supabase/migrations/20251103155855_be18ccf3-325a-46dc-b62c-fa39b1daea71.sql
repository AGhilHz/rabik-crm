-- Fix user_roles table policies
-- Allow the security definer function to read roles
CREATE POLICY "Allow role checks via security definer" ON public.user_roles
FOR SELECT TO authenticated
USING (true);

-- Only admins can manage roles
CREATE POLICY "Admins manage roles" ON public.user_roles
FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));