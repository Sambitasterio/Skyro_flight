import { resolveAirportInput } from "@/lib/airports";
import type { CabinClass, SearchQuery, TripType } from "@/types/flight";

export interface FlightsSearchParams {
  origin: string;
  destination: string;
  departDate: string;
  returnDate: string | null;
  passengerCount: number;
  cabinClass: CabinClass;
  tripType: TripType;
}

function firstParam(
  value: string | string[] | undefined,
): string | undefined {
  if (value === undefined) return undefined;
  return Array.isArray(value) ? value[0] : value;
}

function parseCabinClass(raw: string | undefined): CabinClass {
  if (raw === "business" || raw === "first") return raw;
  return "economy";
}

function parseTripType(raw: string | undefined): TripType {
  return raw === "round" ? "round" : "oneway";
}

function defaultDepartDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d.toISOString().slice(0, 10);
}

function clampPassengers(raw: string | undefined): number {
  const n = Number.parseInt(raw ?? "1", 10);
  if (Number.isNaN(n)) return 1;
  return Math.min(9, Math.max(1, n));
}

/** Parse `/flights` URL search params into a normalized search object. */
export function parseFlightsSearchParams(
  raw: Record<string, string | string[] | undefined>,
): FlightsSearchParams {
  const from = resolveAirportInput(firstParam(raw.from) ?? "DEL");
  const to = resolveAirportInput(firstParam(raw.to) ?? "BOM");
  const departDate = firstParam(raw.depart) ?? defaultDepartDate();
  const returnDate = firstParam(raw.return) ?? null;
  const tripType = parseTripType(firstParam(raw.trip));

  return {
    origin: from,
    destination: to,
    departDate,
    returnDate: tripType === "round" ? returnDate : null,
    passengerCount: clampPassengers(firstParam(raw.pax)),
    cabinClass: parseCabinClass(firstParam(raw.class)),
    tripType,
  };
}

export function flightsSearchParamsToQuery(
  params: FlightsSearchParams,
): SearchQuery {
  return {
    origin: params.origin,
    destination: params.destination,
    departDate: params.departDate,
    returnDate: params.returnDate ?? "",
    passengerCount: params.passengerCount,
    cabinClass: params.cabinClass,
    tripType: params.tripType,
  };
}
