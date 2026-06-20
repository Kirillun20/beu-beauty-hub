
-- Make reviews publicly readable so product pages can show them
DROP POLICY IF EXISTS "Users can read own reviews" ON public.reviews;
CREATE POLICY "Anyone can read reviews" ON public.reviews FOR SELECT USING (true);

-- Restrict storage listing on public product-images bucket (files still served via public URL)
DROP POLICY IF EXISTS "Anyone can view product images" ON storage.objects;

-- Lock down SECURITY DEFINER function execution
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.update_loyalty_points(uuid, integer, integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_loyalty_points(uuid, integer, integer) TO authenticated;
