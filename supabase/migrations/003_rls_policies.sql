-- 003_rls_policies.sql — RLS policies

-- Flights & seats: public read (search without login)
CREATE POLICY flights_public_select
  ON public.flights
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY seats_public_select
  ON public.seats
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Bookings: owner read / insert / update (reschedule from app)
CREATE POLICY bookings_select_own
  ON public.bookings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY bookings_insert_own
  ON public.bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY bookings_update_own
  ON public.bookings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Passengers: via booking owner
CREATE POLICY passengers_select_own
  ON public.passengers
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.bookings b
      WHERE b.id = passengers.booking_id
        AND b.user_id = auth.uid()
    )
  );

CREATE POLICY passengers_insert_own
  ON public.passengers
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.bookings b
      WHERE b.id = passengers.booking_id
        AND b.user_id = auth.uid()
    )
  );

-- Reschedules: via booking owner
CREATE POLICY reschedules_select_own
  ON public.reschedules
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.bookings b
      WHERE b.id = reschedules.booking_id
        AND b.user_id = auth.uid()
    )
  );

CREATE POLICY reschedules_insert_own
  ON public.reschedules
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.bookings b
      WHERE b.id = reschedules.booking_id
        AND b.user_id = auth.uid()
    )
  );
