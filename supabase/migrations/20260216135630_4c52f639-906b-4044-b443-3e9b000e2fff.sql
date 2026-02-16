
-- Input validation: add length constraints
ALTER TABLE public.reviews ADD CONSTRAINT review_text_length CHECK (length(text) <= 2000);
ALTER TABLE public.reviews ADD CONSTRAINT review_author_name_length CHECK (length(author_name) <= 200);

ALTER TABLE public.orders ADD CONSTRAINT customer_name_length CHECK (length(customer_name) <= 200);
ALTER TABLE public.orders ADD CONSTRAINT customer_phone_length CHECK (length(customer_phone) <= 50);
ALTER TABLE public.orders ADD CONSTRAINT delivery_address_length CHECK (length(delivery_address) <= 500);
ALTER TABLE public.orders ADD CONSTRAINT customer_email_length CHECK (length(customer_email) <= 255);

ALTER TABLE public.profiles ADD CONSTRAINT display_name_length CHECK (length(display_name) <= 200);
ALTER TABLE public.profiles ADD CONSTRAINT phone_length CHECK (length(phone) <= 50);
ALTER TABLE public.profiles ADD CONSTRAINT address_length CHECK (length(address) <= 500);

-- Admin route bypass: create server-side is_admin() RPC
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT has_role(auth.uid(), 'admin'::app_role);
$$;
