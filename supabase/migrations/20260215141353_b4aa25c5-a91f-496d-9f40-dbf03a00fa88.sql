
-- Fix 1: Make orders.user_id NOT NULL to prevent bypass of RLS
ALTER TABLE public.orders ALTER COLUMN user_id SET NOT NULL;

-- Fix 2: Create a public view for reviews that excludes user_id
CREATE VIEW public.reviews_public
WITH (security_invoker=on) AS
  SELECT id, product_id, rating, text, author_name, created_at
  FROM public.reviews;

-- Drop the old permissive SELECT policy on reviews
DROP POLICY "Anyone can view reviews" ON public.reviews;

-- Add restrictive SELECT: only the review owner can read via base table
CREATE POLICY "Users can read own reviews"
  ON public.reviews FOR SELECT
  USING (auth.uid() = user_id);

-- Grant SELECT on the view to anon and authenticated
GRANT SELECT ON public.reviews_public TO anon, authenticated;
