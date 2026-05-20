import type { Airport } from "@/types/flight";

/** Airports aligned with seed routes (DEL, BOM, GOA, BLR, HYD). */
export const AIRPORTS: Airport[] = [
  { code: "DEL", city: "Delhi", name: "Indira Gandhi International" },
  { code: "BOM", city: "Mumbai", name: "Chhatrapati Shivaji International" },
  { code: "GOA", city: "Goa", name: "Manohar International" },
  { code: "BLR", city: "Bengaluru", name: "Kempegowda International" },
  { code: "HYD", city: "Hyderabad", name: "Rajiv Gandhi International" },
  { code: "CCU", city: "Kolkata", name: "Netaji Subhas Chandra Bose" },
  { code: "SIN", city: "Singapore", name: "Changi Airport" },
  { code: "DXB", city: "Dubai", name: "Dubai International" },
];

export function findAirport(code: string): Airport | undefined {
  return AIRPORTS.find(
    (a) => a.code.toUpperCase() === code.trim().toUpperCase(),
  );
}

export function resolveAirportInput(value: string): string {
  const trimmed = value.trim().toUpperCase();
  const byCode = findAirport(trimmed);
  if (byCode) return byCode.code;
  const byCity = AIRPORTS.find(
    (a) => a.city.toUpperCase() === trimmed,
  );
  return byCity?.code ?? trimmed.slice(0, 3);
}
