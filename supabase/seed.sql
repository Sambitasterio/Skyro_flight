-- seed.sql — Skyro demo data
-- Test user: xyz123@gmail.com / 1234
-- ⚠️ Edit the password in the crypt() call below if you use a different one.

-- Fixed UUID for reproducible seed references
-- Test user id: a1111111-1111-1111-1111-111111111111

INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
)
VALUES (
  'a1111111-1111-1111-1111-111111111111',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'xyz123@gmail.com',
  crypt('1234', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  provider_id,
  last_sign_in_at,
  created_at,
  updated_at
)
VALUES (
  'b2222222-2222-2222-2222-222222222222',
  'a1111111-1111-1111-1111-111111111111',
  jsonb_build_object(
    'sub', 'a1111111-1111-1111-1111-111111111111',
    'email', 'xyz123@gmail.com',
    'email_verified', true
  ),
  'email',
  'a1111111-1111-1111-1111-111111111111',
  now(),
  now(),
  now()
)
ON CONFLICT DO NOTHING;

-- 8 flights across 4 routes (times relative to now for cancel/reschedule testing)
INSERT INTO public.flights (
  id, flight_no, origin, destination, departs_at, arrives_at, aircraft_type, status, base_price
) VALUES
  ('f1000001-0000-0000-0000-000000000001', 'SK101', 'DEL', 'BOM', now() + interval '3 days',  now() + interval '3 days 2 hours 15 minutes', 'A320', 'scheduled', 4500.00),
  ('f1000001-0000-0000-0000-000000000002', 'SK102', 'DEL', 'BOM', now() + interval '5 days',  now() + interval '5 days 2 hours 20 minutes', 'B737', 'scheduled', 5200.00),
  ('f1000001-0000-0000-0000-000000000003', 'SK201', 'BOM', 'GOA', now() + interval '4 days',  now() + interval '4 days 1 hour 10 minutes', 'A320', 'scheduled', 3800.00),
  ('f1000001-0000-0000-0000-000000000004', 'SK202', 'BOM', 'GOA', now() + interval '6 days',  now() + interval '6 days 1 hour 5 minutes',  'ATR72', 'scheduled', 3200.00),
  ('f1000001-0000-0000-0000-000000000005', 'SK301', 'DEL', 'BLR', now() + interval '2 days',  now() + interval '2 days 2 hours 30 minutes', 'A320', 'scheduled', 4100.00),
  ('f1000001-0000-0000-0000-000000000006', 'SK302', 'DEL', 'BLR', now() + interval '7 days',  now() + interval '7 days 2 hours 35 minutes', 'A321', 'scheduled', 4800.00),
  ('f1000001-0000-0000-0000-000000000007', 'SK401', 'BLR', 'HYD', now() + interval '3 days 4 hours', now() + interval '3 days 5 hours 15 minutes', 'A320', 'scheduled', 2900.00),
  ('f1000001-0000-0000-0000-000000000008', 'SK402', 'BLR', 'HYD', now() + interval '8 days',  now() + interval '8 days 1 hour 20 minutes', 'B737', 'scheduled', 3400.00)
ON CONFLICT (id) DO NOTHING;

-- Generate seat maps: first rows 1-4, business 1-8, economy 1-30 (A-F each row)
DO $$
DECLARE
  v_flight_id uuid;
  v_row int;
  v_col text;
  v_cols text[] := ARRAY['A', 'B', 'C', 'D', 'E', 'F'];
BEGIN
  FOR v_flight_id IN SELECT id FROM public.flights LOOP
    -- First class (rows 1–4)
    FOR v_row IN 1..4 LOOP
      FOREACH v_col IN ARRAY v_cols LOOP
        INSERT INTO public.seats (flight_id, seat_number, class, extra_fee)
        VALUES (v_flight_id, v_row || v_col, 'first', 8000.00)
        ON CONFLICT (flight_id, seat_number) DO NOTHING;
      END LOOP;
    END LOOP;

    -- Business (rows 5–12)
    FOR v_row IN 5..12 LOOP
      FOREACH v_col IN ARRAY v_cols LOOP
        INSERT INTO public.seats (flight_id, seat_number, class, extra_fee)
        VALUES (v_flight_id, v_row || v_col, 'business', 3500.00)
        ON CONFLICT (flight_id, seat_number) DO NOTHING;
      END LOOP;
    END LOOP;

    -- Economy (rows 13–42)
    FOR v_row IN 13..42 LOOP
      FOREACH v_col IN ARRAY v_cols LOOP
        INSERT INTO public.seats (flight_id, seat_number, class, extra_fee)
        VALUES (
          v_flight_id,
          v_row || v_col,
          'economy',
          CASE WHEN v_col IN ('A', 'F') THEN 500.00 ELSE 0.00 END
        )
        ON CONFLICT (flight_id, seat_number) DO NOTHING;
      END LOOP;
    END LOOP;
  END LOOP;
END $$;

-- Mark a few seats occupied for demo (optional visual on seat map later)
UPDATE public.seats s
SET is_available = false
FROM (
  SELECT id
  FROM public.seats
  WHERE flight_id = 'f1000001-0000-0000-0000-000000000001'
  ORDER BY seat_number
  LIMIT 5
) picked
WHERE s.id = picked.id;
