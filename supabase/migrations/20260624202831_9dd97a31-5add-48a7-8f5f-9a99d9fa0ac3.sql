
-- =====================================================
-- 1. PROMO CODES: remove public exposure, add validator
-- =====================================================
DROP POLICY IF EXISTS "Anyone can read active promo codes" ON public.promo_codes;

CREATE POLICY "Admins can read promo codes"
  ON public.promo_codes FOR SELECT
  TO authenticated
  USING (is_admin());

REVOKE SELECT ON public.promo_codes FROM anon;

CREATE OR REPLACE FUNCTION public.validate_promo_code(p_code text, p_order_total numeric)
RETURNS TABLE (
  valid boolean,
  code text,
  type text,
  value numeric,
  min_order numeric,
  message text
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  r public.promo_codes%ROWTYPE;
BEGIN
  SELECT * INTO r FROM public.promo_codes WHERE upper(promo_codes.code) = upper(p_code) LIMIT 1;
  IF NOT FOUND THEN
    RETURN QUERY SELECT false, p_code, NULL::text, NULL::numeric, NULL::numeric, 'Промокод не найден'::text;
    RETURN;
  END IF;
  IF COALESCE(r.active, false) = false THEN
    RETURN QUERY SELECT false, r.code, r.type, r.value, r.min_order, 'Промокод неактивен'::text;
    RETURN;
  END IF;
  IF r.expires_at IS NOT NULL AND r.expires_at < now() THEN
    RETURN QUERY SELECT false, r.code, r.type, r.value, r.min_order, 'Срок действия истёк'::text;
    RETURN;
  END IF;
  IF r.max_uses IS NOT NULL AND COALESCE(r.uses_count, 0) >= r.max_uses THEN
    RETURN QUERY SELECT false, r.code, r.type, r.value, r.min_order, 'Лимит использований исчерпан'::text;
    RETURN;
  END IF;
  IF r.min_order IS NOT NULL AND p_order_total < r.min_order THEN
    RETURN QUERY SELECT false, r.code, r.type, r.value, r.min_order,
      ('Минимальная сумма: ' || r.min_order::text || ' BYN')::text;
    RETURN;
  END IF;
  RETURN QUERY SELECT true, r.code, r.type, r.value, COALESCE(r.min_order, 0), NULL::text;
END;
$$;

REVOKE ALL ON FUNCTION public.validate_promo_code(text, numeric) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.validate_promo_code(text, numeric) TO anon, authenticated;

-- =====================================================
-- 2. SUPPORT CHATS: add secret guest_token, lock anon SELECTs
-- =====================================================
ALTER TABLE public.support_chats
  ADD COLUMN IF NOT EXISTS guest_token uuid DEFAULT gen_random_uuid();

-- Drop overly-broad anon policies
DROP POLICY IF EXISTS "Anon can read guest chats by id" ON public.support_chats;
DROP POLICY IF EXISTS "Anyone can start a chat" ON public.support_chats;
DROP POLICY IF EXISTS "Anon read guest chat messages" ON public.support_messages;
DROP POLICY IF EXISTS "Anon insert message into guest chat" ON public.support_messages;

-- Revoke direct table access for anon (anon uses RPCs only)
REVOKE SELECT, INSERT, UPDATE, DELETE ON public.support_chats FROM anon;
REVOKE SELECT, INSERT, UPDATE, DELETE ON public.support_messages FROM anon;

-- =====================================================
-- 3. SECURITY DEFINER RPCs for guest chat access
-- =====================================================
CREATE OR REPLACE FUNCTION public.create_guest_chat(p_guest_name text)
RETURNS TABLE (id uuid, guest_token uuid)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id uuid;
  new_token uuid;
BEGIN
  IF p_guest_name IS NULL OR length(btrim(p_guest_name)) = 0 THEN
    RAISE EXCEPTION 'guest_name required';
  END IF;
  new_token := gen_random_uuid();
  INSERT INTO public.support_chats (user_id, guest_name, guest_token)
  VALUES (NULL, left(btrim(p_guest_name), 100), new_token)
  RETURNING support_chats.id INTO new_id;
  RETURN QUERY SELECT new_id, new_token;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_guest_chat(p_chat_id uuid, p_token uuid)
RETURNS TABLE (
  id uuid,
  guest_name text,
  status text,
  last_message_at timestamptz,
  created_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT c.id, c.guest_name, c.status, c.last_message_at, c.created_at
  FROM public.support_chats c
  WHERE c.id = p_chat_id AND c.user_id IS NULL AND c.guest_token = p_token;
$$;

CREATE OR REPLACE FUNCTION public.get_guest_messages(p_chat_id uuid, p_token uuid)
RETURNS TABLE (
  id uuid,
  chat_id uuid,
  sender text,
  body text,
  created_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT m.id, m.chat_id, m.sender, m.body, m.created_at
  FROM public.support_messages m
  WHERE m.chat_id = p_chat_id
    AND EXISTS (
      SELECT 1 FROM public.support_chats c
      WHERE c.id = p_chat_id AND c.user_id IS NULL AND c.guest_token = p_token
    )
  ORDER BY m.created_at ASC;
$$;

CREATE OR REPLACE FUNCTION public.send_guest_message(p_chat_id uuid, p_token uuid, p_body text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id uuid;
BEGIN
  IF p_body IS NULL OR length(btrim(p_body)) = 0 THEN
    RAISE EXCEPTION 'body required';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM public.support_chats c
    WHERE c.id = p_chat_id AND c.user_id IS NULL AND c.guest_token = p_token
  ) THEN
    RAISE EXCEPTION 'invalid chat or token';
  END IF;
  INSERT INTO public.support_messages (chat_id, sender, author_id, body)
  VALUES (p_chat_id, 'user', NULL, left(btrim(p_body), 2000))
  RETURNING id INTO new_id;
  UPDATE public.support_chats
     SET last_message_at = now(), unread_for_admin = COALESCE(unread_for_admin, 0) + 1
   WHERE id = p_chat_id;
  RETURN new_id;
END;
$$;

REVOKE ALL ON FUNCTION public.create_guest_chat(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_guest_chat(uuid, uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_guest_messages(uuid, uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.send_guest_message(uuid, uuid, text) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.create_guest_chat(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_guest_chat(uuid, uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_guest_messages(uuid, uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.send_guest_message(uuid, uuid, text) TO anon, authenticated;
