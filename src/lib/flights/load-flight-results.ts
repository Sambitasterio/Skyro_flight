import { parseFlightFilterParams } from "./filter-params";
import { parseFlightsSearchParams } from "./parse-search-params";
import { searchFlights } from "./search-flights";
import type { FlightFilterState } from "./filter-params";
import type { FlightsSearchParams } from "./parse-search-params";
import type { FlightRow } from "@/types/database";

export interface FlightResultsPayload {
  search: FlightsSearchParams;
  filters: FlightFilterState;
  flights: FlightRow[];
  flexibleDate: boolean;
  fetchError: string | null;
}

/** Server-side load for `/flights` and `/api/flights` (anon Supabase). */
export async function loadFlightResults(
  raw: Record<string, string | string[] | undefined>,
): Promise<FlightResultsPayload> {
  const search = parseFlightsSearchParams(raw);
  const filters = parseFlightFilterParams(raw);

  try {
    const result = await searchFlights(search, filters);
    return {
      search,
      filters,
      flights: result.flights,
      flexibleDate: result.flexibleDate,
      fetchError: null,
    };
  } catch (err) {
    return {
      search,
      filters,
      flights: [],
      flexibleDate: false,
      fetchError:
        err instanceof Error ? err.message : "Could not load flights.",
    };
  }
}
