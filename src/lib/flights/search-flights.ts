import { createClient } from "@/lib/supabase/server";
import type { FlightRow } from "@/types/database";

import type { FlightFilterState } from "./filter-params";
import type { FlightsSearchParams } from "./parse-search-params";

export interface SearchFlightsResult {
  flights: FlightRow[];
  /** True when exact depart date had no rows and upcoming route flights were returned. */
  flexibleDate: boolean;
}

function departDayBounds(departDate: string): { start: string; end: string } {
  const start = new Date(`${departDate}T00:00:00.000Z`);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);
  return { start: start.toISOString(), end: end.toISOString() };
}

async function queryFlights(
  params: FlightsSearchParams,
  options: { dateFilter: boolean; filters?: FlightFilterState },
): Promise<FlightRow[]> {
  const supabase = await createClient();
  let query = supabase
    .from("flights")
    .select(
      "id, flight_no, origin, destination, departs_at, arrives_at, aircraft_type, status, base_price",
    )
    .eq("origin", params.origin)
    .eq("destination", params.destination)
    .eq("status", "scheduled");

  if (options.dateFilter) {
    const { start, end } = departDayBounds(params.departDate);
    query = query.gte("departs_at", start).lt("departs_at", end);
  } else {
    query = query.gte("departs_at", new Date().toISOString());
  }

  const filters = options.filters;
  if (filters?.minPrice !== null && filters?.minPrice !== undefined) {
    query = query.gte("base_price", filters.minPrice);
  }
  if (filters?.maxPrice !== null && filters?.maxPrice !== undefined) {
    query = query.lte("base_price", filters.maxPrice);
  }

  query = query.order("departs_at", { ascending: true });

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as FlightRow[];
}

/**
 * Fetch flights for the search route.
 * Price filters run on Supabase; stops/time stay client-side (Phase 4.2).
 * Falls back to upcoming flights when the selected day has no rows (seed dates).
 */
export async function searchFlights(
  params: FlightsSearchParams,
  filters?: FlightFilterState,
): Promise<SearchFlightsResult> {
  const onDate = await queryFlights(params, {
    dateFilter: true,
    filters,
  });
  if (onDate.length > 0) {
    return { flights: onDate, flexibleDate: false };
  }

  const upcoming = await queryFlights(params, {
    dateFilter: false,
    filters,
  });
  return {
    flights: upcoming,
    flexibleDate: upcoming.length > 0,
  };
}
