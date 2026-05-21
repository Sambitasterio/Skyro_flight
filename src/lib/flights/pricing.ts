import type { CabinClass } from "@/types/flight";

const CLASS_MULTIPLIERS: Record<CabinClass, number> = {
  economy: 1,
  business: 2.4,
  first: 4.5,
};

export function priceForCabin(basePrice: number, cabin: CabinClass): number {
  return Math.round(basePrice * CLASS_MULTIPLIERS[cabin]);
}
