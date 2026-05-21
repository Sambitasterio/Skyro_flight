import type { CabinClass } from "@/types/flight";

/** Row shape from `public.flights` (Supabase). */
export interface FlightRow {
  id: string;
  flight_no: string;
  origin: string;
  destination: string;
  departs_at: string;
  arrives_at: string;
  aircraft_type: string;
  status: string;
  base_price: number;
}

/** Row shape from `public.seats` (Supabase). */
export interface SeatRow {
  id: string;
  flight_id: string;
  seat_number: string;
  class: CabinClass;
  is_available: boolean;
  extra_fee: number;
}
