import { createClient } from "@/lib/supabase/server";
import type { FlightRow, SeatRow } from "@/types/database";

export interface UserBookingPassenger {
  full_name: string;
}

export interface UserBookingItem {
  id: string;
  pnr_code: string;
  status: string;
  booked_at: string;
  total_price: number;
  flight: FlightRow;
  seat: Pick<SeatRow, "seat_number" | "class">;
  passenger: UserBookingPassenger | null;
}

interface BookingQueryRow {
  id: string;
  pnr_code: string;
  status: string;
  booked_at: string;
  total_price: number;
  flights: FlightRow | FlightRow[] | null;
  seats: Pick<SeatRow, "seat_number" | "class"> | Pick<SeatRow, "seat_number" | "class">[] | null;
  passengers: UserBookingPassenger | UserBookingPassenger[] | null;
}

function first<T>(value: T | T[] | null | undefined): T | null {
  if (value == null) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

export async function loadUserBookings(): Promise<UserBookingItem[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("bookings")
    .select(
      `
      id,
      pnr_code,
      status,
      booked_at,
      total_price,
      flight_id,
      seat_id,
      flights (
        id,
        flight_no,
        origin,
        destination,
        departs_at,
        arrives_at,
        aircraft_type,
        status,
        base_price
      ),
      seats (
        seat_number,
        class
      ),
      passengers (
        full_name
      )
    `,
    )
    .eq("user_id", user.id)
    .order("booked_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  const items: UserBookingItem[] = [];

  for (const row of data as BookingQueryRow[]) {
    const flight = first(row.flights);
    const seat = first(row.seats);
    if (!flight || !seat) continue;

    items.push({
      id: row.id,
      pnr_code: row.pnr_code,
      status: row.status,
      booked_at: row.booked_at,
      total_price: Number(row.total_price),
      flight,
      seat,
      passenger: first(row.passengers),
    });
  }

  return items;
}
