ALTER TABLE public.products ADD COLUMN IF NOT EXISTS preorder_days INTEGER;
ALTER TABLE public.products ALTER COLUMN availability SET DEFAULT 'in_stock';
UPDATE public.products SET availability = CASE WHEN availability IS NOT NULL THEN availability WHEN in_stock = true THEN 'in_stock' ELSE 'preorder' END WHERE availability IS NULL;