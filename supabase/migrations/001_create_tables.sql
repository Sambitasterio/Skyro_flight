-- 001_create_tables.sql — Skyro core schema

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Flights
CREATE TABLE public.flights (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  flight_no     text NOT NULL,
  origin        text NOT NULL,
  destination   text NOT NULL,
  departs_at    timestamptz NOT NULL,
  arrives_at    timestamptz NOT NULL,
  aircraft_type text NOT NULL,
  status        text NOT NULL DEFAULT 'scheduled'
                CHECK (status IN ('scheduled', 'delayed', 'cancelled')),
  base_price    numeric(10, 2) NOT NULL CHECK (base_price >= 0)
);

CREATE INDEX flights_route_depart_idx ON public.flights (origin, destination, departs_at);

-- Seats
CREATE TABLE public.seats (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  flight_id     uuid NOT NULL REFERENCES public.flights (id) ON DELETE CASCADE,
  seat_number   text NOT NULL,
  class         text NOT NULL CHECK (class IN ('economy', 'business', 'first')),
  is_available  boolean NOT NULL DEFAULT true,
  extra_fee     numeric(8, 2) NOT NULL DEFAULT 0 CHECK (extra_fee >= 0),
  UNIQUE (flight_id, seat_number)
);

CREATE INDEX seats_flight_id_idx ON public.seats (flight_id);
CREATE INDEX seats_flight_available_idx ON public.seats (flight_id, is_available);

-- Bookings
CREATE TABLE public.bookings (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  flight_id   uuid NOT NULL REFERENCES public.flights (id),
  seat_id     uuid NOT NULL REFERENCES public.seats (id),
  status      text NOT NULL DEFAULT 'confirmed'
              CHECK (status IN ('confirmed', 'rescheduled', 'cancelled')),
  booked_at   timestamptz NOT NULL DEFAULT now(),
  total_price numeric(10, 2) NOT NULL CHECK (total_price >= 0),
  pnr_code    text NOT NULL UNIQUE
);

CREATE INDEX bookings_user_id_idx ON public.bookings (user_id);
CREATE INDEX bookings_flight_id_idx ON public.bookings (flight_id);
CREATE UNIQUE INDEX bookings_active_seat_uidx
  ON public.bookings (seat_id)
  WHERE status IN ('confirmed', 'rescheduled');

-- Passengers
CREATE TABLE public.passengers (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id  uuid NOT NULL REFERENCES public.bookings (id) ON DELETE CASCADE,
  full_name   text NOT NULL,
  passport_no text NOT NULL,
  nationality text NOT NULL,
  dob         date NOT NULL
);

CREATE INDEX passengers_booking_id_idx ON public.passengers (booking_id);

-- Reschedules
CREATE TABLE public.reschedules (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id     uuid NOT NULL REFERENCES public.bookings (id) ON DELETE CASCADE,
  old_flight_id  uuid NOT NULL REFERENCES public.flights (id),
  new_flight_id  uuid NOT NULL REFERENCES public.flights (id),
  requested_at   timestamptz NOT NULL DEFAULT now(),
  fee_charged    numeric(8, 2) NOT NULL DEFAULT 0 CHECK (fee_charged >= 0)
);

CREATE INDEX reschedules_booking_id_idx ON public.reschedules (booking_id);
