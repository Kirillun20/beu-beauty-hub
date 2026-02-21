
CREATE OR REPLACE FUNCTION public.update_loyalty_points(
  _user_id UUID,
  _points_spent INT,
  _points_earned INT
) RETURNS void
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE profiles 
  SET loyalty_points = GREATEST(0, loyalty_points - _points_spent + _points_earned)
  WHERE user_id = _user_id;
END;
$$;
