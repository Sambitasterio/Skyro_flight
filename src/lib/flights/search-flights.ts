import { createClient } from "@/lib/supabase/server";
import type { FlightRow } from "@/types/database";

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
  options: { dateFilter: boolean },
): Promise<FlightRow[]> {
  const supabase = await createClient();
  let query = supabase
    .from("flights")
    .select(
      "id, flight_no, origin, destination, departs_at, arrives_at, aircraft_type, status, base_price",
    )
    .eq("origin", params.origin)
    .eq("destination", params.destination)
    .eq("status", "scheduled")
    .order("departs_at", { ascending: true });

  if (options.dateFilter) {
    const { start, end } = departDayBounds(params.departDate);
    query = query.gte("departs_at", start).lt("departs_at", end);
  } else {
    query = query.gte("departs_at", new Date().toISOString());
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as FlightRow[];
}

/**
 * Fetch flights for the search route.
 * Seed depart times are relative to `now()`, so we fall back to upcoming
 * flights on the same route when the selected calendar day has no matches.
 */
export async function searchFlights(
  params: FlightsSearchParams,
): Promise<SearchFlightsResult> {
  const onDate = await queryFlights(params, { dateFilter: true });
  if (onDate.length > 0) {
    return { flights: onDate, flexibleDate: false };
  }

  const upcoming = await queryFlights(params, { dateFilter: false });
  return {
    flights: upcoming,
    flexibleDate: upcoming.length > 0,
  };
}
