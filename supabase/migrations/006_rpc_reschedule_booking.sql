-- 006_rpc_reschedule_booking.sql — atomic reschedule with seat swap

CREATE OR REPLACE FUNCTION public.reschedule_booking(
  p_booking_id uuid,
  p_new_flight_id uuid,
  p_new_seat_id uuid,
  p_user_id uuid
)
RETURNS public.bookings
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_booking public.bookings%ROWTYPE;
  v_old_flight public.flights%ROWTYPE;
  v_new_flight public.flights%ROWTYPE;
  v_new_seat public.seats%ROWTYPE;
  v_new_total numeric(10, 2);
  v_fee numeric(8, 2);
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
    RAISE EXCEPTION 'Cannot reschedule a cancelled booking';
  END IF;

  SELECT *
  INTO v_old_flight
  FROM public.flights
  WHERE id = v_booking.flight_id;

  IF v_old_flight.departs_at - now() < interval '2 hours' THEN
    RAISE EXCEPTION 'Cannot reschedule within 2 hours of departure';
  END IF;

  SELECT *
  INTO v_new_flight
  FROM public.flights
  WHERE id = p_new_flight_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Flight not found';
  END IF;

  IF v_new_flight.status = 'cancelled' THEN
    RAISE EXCEPTION 'Flight is cancelled';
  END IF;

  IF v_new_flight.origin <> v_old_flight.origin
     OR v_new_flight.destination <> v_old_flight.destination THEN
    RAISE EXCEPTION 'New flight must be on the same route';
  END IF;

  IF v_new_flight.id = v_old_flight.id AND p_new_seat_id = v_booking.seat_id THEN
    RAISE EXCEPTION 'Select a different flight or seat';
  END IF;

  SELECT *
  INTO v_new_seat
  FROM public.seats
  WHERE id = p_new_seat_id
    AND flight_id = p_new_flight_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Seat not found';
  END IF;

  IF NOT v_new_seat.is_available THEN
    RAISE EXCEPTION 'Seat not available';
  END IF;

  v_new_total := v_new_flight.base_price
    + v_new_seat.extra_fee
    + round(v_new_flight.base_price * 0.12, 2);

  v_fee := GREATEST(0, v_new_total - v_booking.total_price);

  UPDATE public.seats
  SET is_available = true
  WHERE id = v_booking.seat_id;

  UPDATE public.seats
  SET is_available = false
  WHERE id = p_new_seat_id;

  INSERT INTO public.reschedules (
    booking_id,
    old_flight_id,
    new_flight_id,
    fee_charged
  )
  VALUES (
    p_booking_id,
    v_booking.flight_id,
    p_new_flight_id,
    v_fee
  );

  UPDATE public.bookings
  SET
    flight_id = p_new_flight_id,
    seat_id = p_new_seat_id,
    total_price = v_new_total,
    status = 'rescheduled'
  WHERE id = p_booking_id
  RETURNING * INTO v_booking;

  RETURN v_booking;
END;
$$;

REVOKE ALL ON FUNCTION public.reschedule_booking(uuid, uuid, uuid, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.reschedule_booking(uuid, uuid, uuid, uuid) TO authenticated;
