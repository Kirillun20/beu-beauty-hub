
-- Add composition, application, and volumes array columns to products
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS composition text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS application text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS volumes text[] DEFAULT '{}'::text[];
