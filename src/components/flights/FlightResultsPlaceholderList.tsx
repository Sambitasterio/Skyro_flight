import Link from "next/link";

import {
  formatDuration,
  formatFlightTime,
  formatInr,
} from "@/lib/flights/format";
import type { FlightRow } from "@/types/database";

interface FlightResultsPlaceholderListProps {
  flights: FlightRow[];
}

/** Minimal rows until FlightCard ships in 4.3. */
export function FlightResultsPlaceholderList({
  flights,
}: FlightResultsPlaceholderListProps) {
  return (
    <ul className="flex flex-col gap-4">
      {flights.map((flight) => (
        <li key={flight.id}>
          <article className="rounded-2xl border border-border bg-card p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-foreground">
                  Skyro · {flight.flight_no}
                </p>
                <p className="mt-1 text-sm text-muted">
                  {flight.origin} → {flight.destination} ·{" "}
                  {flight.aircraft_type}
                </p>
                <p className="mt-2 text-lg font-bold tabular-nums text-foreground">
                  {formatFlightTime(flight.departs_at)}
                  <span className="mx-2 text-muted font-normal">→</span>
                  {formatFlightTime(flight.arrives_at)}
                  <span className="ml-2 text-sm font-normal text-muted">
                    ({formatDuration(flight.departs_at, flight.arrives_at)})
                  </span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-primary">
                  {formatInr(flight.base_price)}
                </p>
                <p className="text-xs text-muted">from · economy base</p>
              </div>
            </div>
            <p className="mt-3 text-xs text-muted">
              Full flight card + Select → seat map in Phase 4.3
            </p>
          </article>
        </li>
      ))}
    </ul>
  );
}

export function FlightResultsEmpty() {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center">
      <p className="text-lg font-semibold text-foreground">No flights found</p>
      <p className="mt-2 text-sm text-muted">
        Try different airports or dates. Seed routes: DEL↔BOM, BOM↔GOA,
        DEL↔BLR, BLR↔HYD.
      </p>
      <Link
        href="/"
        className="text-primary mt-6 inline-block text-sm font-semibold hover:underline"
      >
        Back to search
      </Link>
    </div>
  );
}
