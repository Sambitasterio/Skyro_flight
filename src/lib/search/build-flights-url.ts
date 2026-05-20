import type { SearchQuery } from "@/types/flight";

export function buildFlightsSearchUrl(query: SearchQuery): string {
  const params = new URLSearchParams({
    from: query.origin,
    to: query.destination,
    depart: query.departDate,
    trip: query.tripType,
    pax: String(query.passengerCount),
    class: query.cabinClass,
  });

  if (query.tripType === "round" && query.returnDate) {
    params.set("return", query.returnDate);
  }

  return `/flights?${params.toString()}`;
}
