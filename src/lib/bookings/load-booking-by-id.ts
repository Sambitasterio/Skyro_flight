import { createClient } from "@/lib/supabase/server";
import type { PassengerRow } from "@/lib/booking/get-booking-by-pnr";
import type { FlightRow, SeatRow } from "@/types/database";

export interface RescheduleHistoryItem {
  id: string;
  requested_at: string;
  fee_charged: number;
  old_flight: FlightRow;
  new_flight: FlightRow;
}

export interface BookingDetailData {
  id: string;
  pnr_code: string;
  total_price: number;
  status: string;
  booked_at: string;
  flight: FlightRow;
  seat: SeatRow;
  passenger: PassengerRow;
  reschedules: RescheduleHistoryItem[];
}

export async function loadBookingById(
  bookingId: string,
): Promise<BookingDetailData | null> {
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
      "id, pnr_code, total_price, status, booked_at, flight_id, seat_id, user_id",
    )
    .eq("id", bookingId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (bookingErr || !booking) {
    return null;
  }

  const [{ data: flight }, { data: seat }, { data: passenger }, { data: rescheduleRows }] =
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
      supabase
        .from("reschedules")
        .select("id, old_flight_id, new_flight_id, requested_at, fee_charged")
        .eq("booking_id", booking.id)
        .order("requested_at", { ascending: false }),
    ]);

  if (!flight || !seat || !passenger) {
    return null;
  }

  const reschedules: RescheduleHistoryItem[] = [];

  if (rescheduleRows?.length) {
    const flightIds = [
      ...new Set(
        rescheduleRows.flatMap((r) => [r.old_flight_id, r.new_flight_id]),
      ),
    ];

    const { data: flightsData } = await supabase
      .from("flights")
      .select(
        "id, flight_no, origin, destination, departs_at, arrives_at, aircraft_type, status, base_price",
      )
      .in("id", flightIds);

    const flightMap = new Map(
      (flightsData ?? []).map((f) => [f.id as string, f as FlightRow]),
    );

    for (const row of rescheduleRows) {
      const oldFlight = flightMap.get(row.old_flight_id);
      const newFlight = flightMap.get(row.new_flight_id);
      if (!oldFlight || !newFlight) continue;

      reschedules.push({
        id: row.id,
        requested_at: row.requested_at,
        fee_charged: Number(row.fee_charged),
        old_flight: oldFlight,
        new_flight: newFlight,
      });
    }
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
    reschedules,
  };
}
