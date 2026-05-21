import type { FlightRow } from "@/types/database";

import type {
  DepartTimeBucket,
  FlightFilterState,
  StopFilter,
} from "./filter-params";

/** Seed data has no layovers — all flights are non-stop. */
function stopCount(_flight: FlightRow): number {
  return 0;
}

function matchesStops(flight: FlightRow, stops: StopFilter[]): boolean {
  if (stops.length === 0) return true;
  const count = stopCount(flight);
  return stops.some((s) => {
    if (s === "nonstop") return count === 0;
    if (s === "1") return count === 1;
    return count >= 2;
  });
}

function departBucket(iso: string): DepartTimeBucket {
  const hour = new Date(iso).getHours();
  if (hour < 6) return "early";
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  return "evening";
}

function matchesDepartTime(
  flight: FlightRow,
  buckets: DepartTimeBucket[],
): boolean {
  if (buckets.length === 0) return true;
  return buckets.includes(departBucket(flight.departs_at));
}

function matchesPrice(
  flight: FlightRow,
  minPrice: number | null,
  maxPrice: number | null,
): boolean {
  const price = Number(flight.base_price);
  if (minPrice !== null && price < minPrice) return false;
  if (maxPrice !== null && price > maxPrice) return false;
  return true;
}

export function applyFlightFilters(
  flights: FlightRow[],
  filters: FlightFilterState,
): FlightRow[] {
  return flights.filter(
    (f) =>
      matchesPrice(f, filters.minPrice, filters.maxPrice) &&
      matchesStops(f, filters.stops) &&
      matchesDepartTime(f, filters.departTimes),
  );
}

export interface FilterFacets {
  stops: Record<StopFilter, number>;
  times: Record<DepartTimeBucket, number>;
  minPrice: number;
  maxPrice: number;
}

export function computeFilterFacets(flights: FlightRow[]): FilterFacets {
  const stops: Record<StopFilter, number> = { nonstop: 0, "1": 0, "2plus": 0 };
  const times: Record<DepartTimeBucket, number> = {
    early: 0,
    morning: 0,
    afternoon: 0,
    evening: 0,
  };

  for (const flight of flights) {
    const count = stopCount(flight);
    if (count === 0) stops.nonstop += 1;
    else if (count === 1) stops["1"] += 1;
    else stops["2plus"] += 1;
    times[departBucket(flight.departs_at)] += 1;
  }

  const prices = flights.map((f) => Number(f.base_price));
  const minPrice = prices.length ? Math.min(...prices) : 0;
  const maxPrice = prices.length ? Math.max(...prices) : 10000;

  return { stops, times, minPrice, maxPrice };
}
