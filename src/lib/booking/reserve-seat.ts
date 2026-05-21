import { createClient } from "@/lib/supabase/client";
import type { ActiveBooking } from "@/types/booking";
import type { BookingRow } from "@/types/database";

function toActiveBooking(row: BookingRow): ActiveBooking {
  return {
    id: row.id,
    pnr_code: row.pnr_code,
    flight_id: row.flight_id,
    seat_id: row.seat_id,
    total_price: Number(row.total_price),
  };
}

export function reserveSeatErrorMessage(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("seat not available")) {
    return "That seat was just taken. Please choose another.";
  }
  if (lower.includes("unauthorized")) {
    return "Please sign in again to continue.";
  }
  if (lower.includes("flight not found") || lower.includes("cancelled")) {
    return "This flight is no longer available.";
  }
  return "Could not reserve your seat. Please try again.";
}

export async function reserveSeat(
  flightId: string,
  seatId: string,
  userId: string,
): Promise<ActiveBooking> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("reserve_seat", {
    p_flight_id: flightId,
    p_seat_id: seatId,
    p_user_id: userId,
  });

  if (error) {
    throw new Error(reserveSeatErrorMessage(error.message));
  }

  if (!data || typeof data !== "object") {
    throw new Error("Could not reserve your seat. Please try again.");
  }

  return toActiveBooking(data as BookingRow);
}
