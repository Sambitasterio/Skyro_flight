-- 005_triggers.sql — reject cancellations within 2 hours of departure (DB-level guard)

CREATE OR REPLACE FUNCTION public.check_cancellation_window()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  v_departs_at timestamptz;
BEGIN
  IF NEW.status = 'cancelled' AND OLD.status IS DISTINCT FROM 'cancelled' THEN
    SELECT f.departs_at
    INTO v_departs_at
    FROM public.flights f
    WHERE f.id = NEW.flight_id;

    IF v_departs_at IS NOT NULL AND v_departs_at - now() < interval '2 hours' THEN
      RAISE EXCEPTION 'Cannot cancel within 2 hours of departure';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_check_cancellation_window ON public.bookings;

CREATE TRIGGER trg_check_cancellation_window
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.check_cancellation_window();
