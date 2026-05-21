import type { FlightRow } from "@/types/database";

import { priceForCabin } from "./pricing";
import type { CabinClass } from "@/types/flight";

export type FlightSortMode = "best" | "cheapest" | "fastest";

export function parseSortMode(raw: string | undefined): FlightSortMode {
  if (raw === "cheapest" || raw === "fastest") return raw;
  return "best";
}

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

export function sortFlights(
  flights: FlightRow[],
  mode: FlightSortMode,
  cabin: CabinClass,
): FlightRow[] {
  const copy = [...flights];
  if (mode === "cheapest") {
    return copy.sort(
      (a, b) => displayPrice(a, cabin) - displayPrice(b, cabin),
    );
  }
  if (mode === "fastest") {
    return copy.sort((a, b) => durationMinutes(a) - durationMinutes(b));
  }
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

export interface SortTabMeta {
  price: number;
  durationLabel: string;
}

export function computeSortTabMeta(
  flights: FlightRow[],
  cabin: CabinClass,
): Record<FlightSortMode, SortTabMeta | null> {
  if (flights.length === 0) {
    return { best: null, cheapest: null, fastest: null };
  }

  const best = sortFlights(flights, "best", cabin)[0];
  const cheapest = sortFlights(flights, "cheapest", cabin)[0];
  const fastest = sortFlights(flights, "fastest", cabin)[0];

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
  const direct = flights;
  if (direct.length === 0) return null;
  return direct.reduce((a, b) =>
    Number(a.base_price) <= Number(b.base_price) ? a : b,
  ).id;
}
