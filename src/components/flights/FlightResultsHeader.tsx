import Link from "next/link";

import {
  airportLabel,
  cabinClassLabel,
  formatFlightDate,
  passengerLabel,
} from "@/lib/flights/format";
import type { FlightsSearchParams } from "@/lib/flights/parse-search-params";

interface FlightResultsHeaderProps {
  params: FlightsSearchParams;
  count: number;
  flexibleDate?: boolean;
  /** Shown when filters reduce the list below the fetched total. */
  totalUnfiltered?: number;
}

export function FlightResultsHeader({
  params,
  count,
  flexibleDate = false,
  totalUnfiltered,
}: FlightResultsHeaderProps) {
  const routeLabel = `${airportLabel(params.origin)} → ${airportLabel(params.destination)}`;
  const dateLabel = formatFlightDate(`${params.departDate}T12:00:00.000Z`);

  return (
    <header className="space-y-3">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <Link
          href="/"
          className="text-muted hover:text-primary font-medium transition-colors"
        >
          ← Modify search
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {count === 0
            ? "No flights found"
            : `${count} flight${count === 1 ? "" : "s"} found`}
        </h1>
        <p className="mt-1 text-sm text-muted sm:text-base">
          <span className="text-foreground font-medium">{routeLabel}</span>
          {" · "}
          {dateLabel}
          {" · "}
          {passengerLabel(params.passengerCount)}
          {" · "}
          {cabinClassLabel(params.cabinClass)}
        </p>
        {flexibleDate && count > 0 ? (
          <p className="mt-2 text-xs text-muted sm:text-sm">
            No flights on your exact date — showing upcoming flights on this
            route.
          </p>
        ) : null}
        {totalUnfiltered !== undefined &&
        totalUnfiltered > count &&
        count > 0 ? (
          <p className="mt-2 text-xs text-muted sm:text-sm">
            Showing {count} of {totalUnfiltered} flights after filters.
          </p>
        ) : null}
      </div>
    </header>
  );
}
