ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_availability_check;
UPDATE public.products SET availability = 'preorder' WHERE availability = 'pre_order';
ALTER TABLE public.products ADD CONSTRAINT products_availability_check CHECK (availability = ANY (ARRAY['in_stock'::text, 'preorder'::text, 'out_of_stock'::text]));