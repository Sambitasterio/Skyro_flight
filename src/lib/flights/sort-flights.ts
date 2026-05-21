import type { FlightRow } from "@/types/database";

import { priceForCabin } from "./pricing";
import type { CabinClass } from "@/types/flight";

export type FlightSortMode =
  | "price_asc"
  | "price_desc"
  | "depart_asc"
  | "depart_desc"
  | "duration_asc";

export const SORT_OPTIONS: { value: FlightSortMode; label: string }[] = [
  { value: "price_asc", label: "Cheapest first" },
  { value: "price_desc", label: "Price: high to low" },
  { value: "depart_asc", label: "Departure (earliest)" },
  { value: "depart_desc", label: "Departure (latest)" },
  { value: "duration_asc", label: "Shortest duration" },
];

const VALID_SORTS = new Set<string>(SORT_OPTIONS.map((o) => o.value));

function durationMinutes(flight: FlightRow): number {
  return (
    (new Date(flight.arrives_at).getTime() -
      new Date(flight.departs_at).getTime()) /
    60_000
  );
}

function displayPrice(flight: FlightRow, cabin: CabinClass): number {
  return priceForCabin(Number(flight.base_price), cabin);
}

/** Parse `sort` URL param (includes legacy best/cheapest/fastest). */
export function parseSortMode(raw: string | undefined): FlightSortMode {
  if (raw && VALID_SORTS.has(raw)) return raw as FlightSortMode;
  if (raw === "cheapest") return "price_asc";
  if (raw === "fastest") return "duration_asc";
  if (raw === "best") return "price_asc";
  return "price_asc";
}

export function sortFlights(
  flights: FlightRow[],
  mode: FlightSortMode,
  cabin: CabinClass,
): FlightRow[] {
  const copy = [...flights];

  switch (mode) {
    case "price_asc":
      return copy.sort(
        (a, b) => displayPrice(a, cabin) - displayPrice(b, cabin),
      );
    case "price_desc":
      return copy.sort(
        (a, b) => displayPrice(b, cabin) - displayPrice(a, cabin),
      );
    case "depart_asc":
      return copy.sort(
        (a, b) =>
          new Date(a.departs_at).getTime() - new Date(b.departs_at).getTime(),
      );
    case "depart_desc":
      return copy.sort(
        (a, b) =>
          new Date(b.departs_at).getTime() - new Date(a.departs_at).getTime(),
      );
    case "duration_asc":
      return copy.sort((a, b) => durationMinutes(a) - durationMinutes(b));
    default:
      return copy;
  }
}

export function cheapestNonStopFlightId(flights: FlightRow[]): string | null {
  if (flights.length === 0) return null;
  return flights.reduce((a, b) =>
    Number(a.base_price) <= Number(b.base_price) ? a : b,
  ).id;
}
