
-- ============ PRODUCTS: variants, multi-subcategories ============
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS volume_variants jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS subcategories text[] DEFAULT '{}'::text[];

-- ============ ORDERS: promo & notes ============
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS promo_code text,
  ADD COLUMN IF NOT EXISTS discount numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS notes text,
  ADD COLUMN IF NOT EXISTS selected_volume text;

-- ============ PROMO CODES ============
CREATE TABLE IF NOT EXISTS public.promo_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  type text NOT NULL CHECK (type IN ('percent','fixed','free_shipping')),
  value numeric NOT NULL DEFAULT 0,
  min_order numeric DEFAULT 0,
  max_uses integer,
  uses_count integer DEFAULT 0,
  active boolean DEFAULT true,
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.promo_codes TO anon, authenticated;
GRANT ALL ON public.promo_codes TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.promo_codes TO authenticated;
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active promo codes" ON public.promo_codes FOR SELECT USING (true);
CREATE POLICY "Admins manage promo codes insert" ON public.promo_codes FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admins manage promo codes update" ON public.promo_codes FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins manage promo codes delete" ON public.promo_codes FOR DELETE TO authenticated USING (public.is_admin());

CREATE TRIGGER update_promo_codes_updated_at BEFORE UPDATE ON public.promo_codes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ SUPPORT CHAT ============
CREATE TABLE IF NOT EXISTS public.support_chats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  guest_name text,
  guest_email text,
  status text NOT NULL DEFAULT 'open',
  last_message_at timestamptz NOT NULL DEFAULT now(),
  unread_for_admin integer DEFAULT 0,
  unread_for_user integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.support_chats TO authenticated;
GRANT SELECT, INSERT ON public.support_chats TO anon;
GRANT ALL ON public.support_chats TO service_role;
ALTER TABLE public.support_chats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own chats" ON public.support_chats FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "Anon can read guest chats by id" ON public.support_chats FOR SELECT TO anon USING (user_id IS NULL);
CREATE POLICY "Anyone can start a chat" ON public.support_chats FOR INSERT TO anon WITH CHECK (user_id IS NULL);
CREATE POLICY "Auth users start chat" ON public.support_chats FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() OR user_id IS NULL);
CREATE POLICY "Admins update chats" ON public.support_chats FOR UPDATE TO authenticated USING (public.is_admin() OR user_id = auth.uid()) WITH CHECK (public.is_admin() OR user_id = auth.uid());

CREATE TABLE IF NOT EXISTS public.support_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id uuid NOT NULL REFERENCES public.support_chats(id) ON DELETE CASCADE,
  sender text NOT NULL CHECK (sender IN ('user','admin')),
  author_id uuid,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.support_messages TO authenticated, anon;
GRANT ALL ON public.support_messages TO service_role;
ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Read messages of own chat" ON public.support_messages FOR SELECT TO authenticated
  USING (public.is_admin() OR EXISTS (SELECT 1 FROM public.support_chats c WHERE c.id = chat_id AND c.user_id = auth.uid()));
CREATE POLICY "Anon read guest chat messages" ON public.support_messages FOR SELECT TO anon
  USING (EXISTS (SELECT 1 FROM public.support_chats c WHERE c.id = chat_id AND c.user_id IS NULL));
CREATE POLICY "Insert message into own chat" ON public.support_messages FOR INSERT TO authenticated
  WITH CHECK (public.is_admin() OR EXISTS (SELECT 1 FROM public.support_chats c WHERE c.id = chat_id AND c.user_id = auth.uid()));
CREATE POLICY "Anon insert message into guest chat" ON public.support_messages FOR INSERT TO anon
  WITH CHECK (sender = 'user' AND EXISTS (SELECT 1 FROM public.support_chats c WHERE c.id = chat_id AND c.user_id IS NULL));

CREATE INDEX IF NOT EXISTS support_messages_chat_id_idx ON public.support_messages(chat_id, created_at);

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.support_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.support_chats;
