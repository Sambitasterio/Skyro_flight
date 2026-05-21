import type { CabinClass } from "@/types/flight";
import type { FlightRow } from "@/types/database";

import { FlightCard } from "./FlightCard";

interface FlightResultsListProps {
  flights: FlightRow[];
  cabinClass: CabinClass;
}

/** Renders flight cards in server fetch order (sort ships in Phase 4.4). */
export function FlightResultsList({
  flights,
  cabinClass,
}: FlightResultsListProps) {
  return (
    <ul className="flex flex-col gap-4">
      {flights.map((flight) => (
        <li key={flight.id}>
          <FlightCard flight={flight} defaultCabin={cabinClass} />
        </li>
      ))}
    </ul>
  );
}
