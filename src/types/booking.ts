/** Booking created by `reserve_seat` — held in store for passenger step. */
export interface ActiveBooking {
  id: string;
  pnr_code: string;
  flight_id: string;
  seat_id: string;
  total_price: number;
}
