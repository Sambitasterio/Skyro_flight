/** Matches `reserve_seat` / `reschedule_booking` RPC total formula. */
export function calculateBookingTotal(
  basePrice: number,
  seatExtraFee: number,
): number {
  const base = Number(basePrice);
  const extra = Number(seatExtraFee) || 0;
  const taxes = Math.round(base * 0.12);
  return base + extra + taxes;
}

export function rescheduleFeeDelta(
  newTotal: number,
  currentTotal: number,
): number {
  return Math.max(0, newTotal - currentTotal);
}
