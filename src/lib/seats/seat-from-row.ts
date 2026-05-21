import type { SelectedSeat } from "@/types/flight";
import type { SeatRow } from "@/types/database";

export function seatRowToSelected(seat: SeatRow): SelectedSeat {
  return {
    id: seat.id,
    flight_id: seat.flight_id,
    seat_number: seat.seat_number,
    class: seat.class,
    extra_fee: Number(seat.extra_fee),
  };
}
