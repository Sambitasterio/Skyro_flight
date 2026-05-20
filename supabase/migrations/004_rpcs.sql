-- 004_rpcs.sql — atomic seat reserve & cancel

CREATE OR REPLACE FUNCTION public.generate_pnr_code()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  v_pnr text;
BEGIN
  LOOP
    v_pnr := 'SKY' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6));
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.bookings WHERE pnr_code = v_pnr);
  END LOOP;
  RETURN v_pnr;
END;
$$;

CREATE OR REPLACE FUNCTION public.reserve_seat(
  p_flight_id uuid,
  p_seat_id uuid,
  p_user_id uuid
)
RETURNS public.bookings
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_seat public.seats%ROWTYPE;
  v_flight public.flights%ROWTYPE;
  v_booking public.bookings%ROWTYPE;
  v_total numeric(10, 2);
BEGIN
  IF p_user_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  SELECT *
  INTO v_flight
  FROM public.flights
  WHERE id = p_flight_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Flight not found';
  END IF;

  IF v_flight.status = 'cancelled' THEN
    RAISE EXCEPTION 'Flight is cancelled';
  END IF;

  SELECT *
  INTO v_seat
  FROM public.seats
  WHERE id = p_seat_id
    AND flight_id = p_flight_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Seat not found';
  END IF;

  IF NOT v_seat.is_available THEN
    RAISE EXCEPTION 'Seat not available';
  END IF;

  v_total := v_flight.base_price + v_seat.extra_fee + round(v_flight.base_price * 0.12, 2);

  UPDATE public.seats
  SET is_available = false
  WHERE id = p_seat_id;

  INSERT INTO public.bookings (
    user_id,
    flight_id,
    seat_id,
    status,
    total_price,
    pnr_code
  )
  VALUES (
    p_user_id,
    p_flight_id,
    p_seat_id,
    'confirmed',
    v_total,
    public.generate_pnr_code()
  )
  RETURNING * INTO v_booking;

  RETURN v_booking;
END;
$$;

CREATE OR REPLACE FUNCTION public.cancel_booking(
  p_booking_id uuid,
  p_user_id uuid
)
RETURNS public.bookings
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_booking public.bookings%ROWTYPE;
  v_departs_at timestamptz;
BEGIN
  IF p_user_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  SELECT *
  INTO v_booking
  FROM public.bookings
  WHERE id = p_booking_id
    AND user_id = p_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Booking not found';
  END IF;

  IF v_booking.status = 'cancelled' THEN
    RAISE EXCEPTION 'Booking already cancelled';
  END IF;

  SELECT f.departs_at
  INTO v_departs_at
  FROM public.flights f
  WHERE f.id = v_booking.flight_id;

  IF v_departs_at - now() < interval '2 hours' THEN
    RAISE EXCEPTION 'Cannot cancel within 2 hours of departure';
  END IF;

  UPDATE public.bookings
  SET status = 'cancelled'
  WHERE id = p_booking_id
  RETURNING * INTO v_booking;

  UPDATE public.seats
  SET is_available = true
  WHERE id = v_booking.seat_id;

  RETURN v_booking;
END;
$$;

REVOKE ALL ON FUNCTION public.generate_pnr_code() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.generate_pnr_code() TO authenticated;

REVOKE ALL ON FUNCTION public.reserve_seat(uuid, uuid, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.reserve_seat(uuid, uuid, uuid) TO authenticated;

REVOKE ALL ON FUNCTION public.cancel_booking(uuid, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.cancel_booking(uuid, uuid) TO authenticated;
