/** Tax rate applied to base fare (matches `reserve_seat` RPC). */
const TAX_RATE = 0.12;

export interface PriceBreakdown {
  baseFare: number;
  seatFee: number;
  taxes: number;
  total: number;
}

export function calculatePriceBreakdown(
  baseFare: number,
  seatExtraFee: number,
): PriceBreakdown {
  const taxes = Math.round(baseFare * TAX_RATE);
  const seatFee = Number(seatExtraFee) || 0;
  return {
    baseFare,
    seatFee,
    taxes,
    total: baseFare + seatFee + taxes,
  };
}
