import type { FlightRow } from "@/types/database";

import { priceForCabin } from "./pricing";
import type { CabinClass } from "@/types/flight";

/** Primary sort modes (Skyscanner tabs + advanced). */
export type FlightSortMode =
  | "best"
  | "price_asc"
  | "price_desc"
  | "depart_asc"
  | "depart_desc"
  | "duration_asc";

/** URL values for Best / Cheapest / Fastest tabs. */
export type SortTabMode = "best" | "cheapest" | "fastest";

export const SORT_TAB_OPTIONS: { value: SortTabMode; label: string }[] = [
  { value: "best", label: "Best" },
  { value: "cheapest", label: "Cheapest" },
  { value: "fastest", label: "Fastest" },
];

export const SORT_OPTIONS: { value: FlightSortMode; label: string }[] = [
  { value: "price_asc", label: "Cheapest first" },
  { value: "price_desc", label: "Price: high to low" },
  { value: "depart_asc", label: "Departure (earliest)" },
  { value: "depart_desc", label: "Departure (latest)" },
  { value: "duration_asc", label: "Shortest duration" },
];

const VALID_SORTS = new Set<string>([
  "best",
  ...SORT_OPTIONS.map((o) => o.value),
  "cheapest",
  "fastest",
]);

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

export function sortTabToSortMode(tab: SortTabMode): FlightSortMode {
  if (tab === "cheapest") return "price_asc";
  if (tab === "fastest") return "duration_asc";
  return "best";
}

export function parseSortTab(raw: string | undefined): SortTabMode {
  if (raw === "cheapest" || raw === "price_asc") return "cheapest";
  if (raw === "fastest" || raw === "duration_asc") return "fastest";
  return "best";
}

/** Parse `sort` URL param. */
export function parseSortMode(raw: string | undefined): FlightSortMode {
  if (raw && VALID_SORTS.has(raw)) {
    if (raw === "cheapest") return "price_asc";
    if (raw === "fastest") return "duration_asc";
    return raw as FlightSortMode;
  }
  return "best";
}

function sortByBest(
  flights: FlightRow[],
  cabin: CabinClass,
): FlightRow[] {
  const copy = [...flights];
  const prices = copy.map((f) => displayPrice(f, cabin));
  const durations = copy.map((f) => durationMinutes(f));
  const minP = Math.min(...prices);
  const maxP = Math.max(...prices) || 1;
  const minD = Math.min(...durations);
  const maxD = Math.max(...durations) || 1;

  return copy.sort((a, b) => {
    const scoreA =
      ((displayPrice(a, cabin) - minP) / (maxP - minP || 1)) * 0.55 +
      ((durationMinutes(a) - minD) / (maxD - minD || 1)) * 0.45;
    const scoreB =
      ((displayPrice(b, cabin) - minP) / (maxP - minP || 1)) * 0.55 +
      ((durationMinutes(b) - minD) / (maxD - minD || 1)) * 0.45;
    return scoreA - scoreB;
  });
}

export function sortFlights(
  flights: FlightRow[],
  mode: FlightSortMode,
  cabin: CabinClass,
): FlightRow[] {
  const copy = [...flights];

  switch (mode) {
    case "best":
      return sortByBest(copy, cabin);
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

export interface SortTabMeta {
  price: number;
  durationLabel: string;
}

export function computeSortTabMeta(
  flights: FlightRow[],
  cabin: CabinClass,
): Record<SortTabMode, SortTabMeta | null> {
  if (flights.length === 0) {
    return { best: null, cheapest: null, fastest: null };
  }

  const best = sortFlights(flights, "best", cabin)[0];
  const cheapest = sortFlights(flights, "price_asc", cabin)[0];
  const fastest = sortFlights(flights, "duration_asc", cabin)[0];

  const fmtDuration = (f: FlightRow) => {
    const m = durationMinutes(f);
    const h = Math.floor(m / 60);
    const min = m % 60;
    return h > 0 ? `${h}h ${min}m` : `${min}m`;
  };

  return {
    best: {
      price: displayPrice(best, cabin),
      durationLabel: fmtDuration(best),
    },
    cheapest: {
      price: displayPrice(cheapest, cabin),
      durationLabel: fmtDuration(cheapest),
    },
    fastest: {
      price: displayPrice(fastest, cabin),
      durationLabel: fmtDuration(fastest),
    },
  };
}

export function cheapestNonStopFlightId(flights: FlightRow[]): string | null {
  if (flights.length === 0) return null;
  return flights.reduce((a, b) =>
    Number(a.base_price) <= Number(b.base_price) ? a : b,
  ).id;
}
