import { createClient } from "@/lib/supabase/server";
import type { FlightRow, SeatRow } from "@/types/database";

export interface PassengerRow {
  id: string;
  booking_id: string;
  full_name: string;
  passport_no: string;
  nationality: string;
  dob: string;
}

export interface BookingConfirmationData {
  id: string;
  pnr_code: string;
  total_price: number;
  status: string;
  booked_at: string;
  flight: FlightRow;
  seat: SeatRow;
  passenger: PassengerRow;
}

export async function getBookingByPnr(
  pnr: string,
): Promise<BookingConfirmationData | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: booking, error: bookingErr } = await supabase
    .from("bookings")
    .select(
      "id, pnr_code, total_price, status, booked_at, flight_id, seat_id",
    )
    .eq("pnr_code", pnr.toUpperCase())
    .eq("user_id", user.id)
    .maybeSingle();

  if (bookingErr || !booking) {
    return null;
  }

  const [{ data: flight }, { data: seat }, { data: passenger }] =
    await Promise.all([
      supabase
        .from("flights")
        .select(
          "id, flight_no, origin, destination, departs_at, arrives_at, aircraft_type, status, base_price",
        )
        .eq("id", booking.flight_id)
        .maybeSingle(),
      supabase
        .from("seats")
        .select("id, flight_id, seat_number, class, is_available, extra_fee")
        .eq("id", booking.seat_id)
        .maybeSingle(),
      supabase
        .from("passengers")
        .select("id, booking_id, full_name, passport_no, nationality, dob")
        .eq("booking_id", booking.id)
        .maybeSingle(),
    ]);

  if (!flight || !seat || !passenger) {
    return null;
  }

  return {
    id: booking.id,
    pnr_code: booking.pnr_code,
    total_price: Number(booking.total_price),
    status: booking.status,
    booked_at: booking.booked_at,
    flight: flight as FlightRow,
    seat: seat as SeatRow,
    passenger: passenger as PassengerRow,
  };
}
