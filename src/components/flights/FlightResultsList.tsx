"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

import {
  cheapestNonStopFlightId,
  parseSortMode,
  sortFlights,
} from "@/lib/flights/sort-flights";
import type { CabinClass } from "@/types/flight";
import type { FlightRow } from "@/types/database";

import { FlightCard } from "./FlightCard";

interface FlightResultsListProps {
  flights: FlightRow[];
  cabinClass: CabinClass;
}

export function FlightResultsList({
  flights,
  cabinClass,
}: FlightResultsListProps) {
  const searchParams = useSearchParams();
  const sort = parseSortMode(searchParams.get("sort") ?? undefined);

  const sorted = useMemo(
    () => sortFlights(flights, sort, cabinClass),
    [flights, sort, cabinClass],
  );

  const bestValueId = useMemo(
    () => cheapestNonStopFlightId(flights),
    [flights],
  );

  return (
    <ul className="flex flex-col gap-4">
      {sorted.map((flight) => (
        <li key={flight.id}>
          <FlightCard
            flight={flight}
            defaultCabin={cabinClass}
            bestValue={flight.id === bestValueId && sort === "price_asc"}
          />
        </li>
      ))}
    </ul>
  );
}
