
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS availability TEXT NOT NULL DEFAULT 'in_stock',
  ADD COLUMN IF NOT EXISTS subcategory TEXT;

ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_availability_check;
ALTER TABLE public.products
  ADD CONSTRAINT products_availability_check
  CHECK (availability IN ('in_stock','pre_order','out_of_stock'));

UPDATE public.products
  SET availability = CASE WHEN in_stock THEN 'in_stock' ELSE 'pre_order' END
  WHERE availability = 'in_stock' AND in_stock = false;

ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE public.orders
  ADD CONSTRAINT orders_status_check
  CHECK (status IN ('pending','processing','shipped','delivered','cancelled'));
