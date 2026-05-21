import type { CabinClass } from "@/types/flight";

import type { FlightFilterState } from "./filter-params";
import type { FlightsSearchParams } from "./parse-search-params";
import type { FlightSortMode } from "./sort-flights";

export function buildFlightsResultsUrl(
  search: FlightsSearchParams,
  filters: FlightFilterState,
  options?: { cabinClass?: CabinClass; sort?: FlightSortMode; departDate?: string },
): string {
  const cabinClass = options?.cabinClass ?? search.cabinClass;
  const depart = options?.departDate ?? search.departDate;
  const params = new URLSearchParams({
    from: search.origin,
    to: search.destination,
    depart,
    trip: search.tripType,
    pax: String(search.passengerCount),
    class: cabinClass,
  });

  const sort = options?.sort ?? "price_asc";
  if (sort !== "price_asc") {
    params.set("sort", sort);
  }

  if (search.tripType === "round" && search.returnDate) {
    params.set("return", search.returnDate);
  }

  if (filters.minPrice !== null) {
    params.set("minPrice", String(filters.minPrice));
  }
  if (filters.maxPrice !== null) {
    params.set("maxPrice", String(filters.maxPrice));
  }
  if (filters.stops.length > 0) {
    params.set("stops", filters.stops.join(","));
  }
  if (filters.departTimes.length > 0) {
    params.set("time", filters.departTimes.join(","));
  }

  return `/flights?${params.toString()}`;
}
