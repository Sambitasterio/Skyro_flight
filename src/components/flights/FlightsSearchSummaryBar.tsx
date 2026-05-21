import Link from "next/link";

import {
  airportLabel,
  cabinClassLabel,
  formatFlightDate,
  passengerLabel,
} from "@/lib/flights/format";
import type { FlightsSearchParams } from "@/lib/flights/parse-search-params";

interface FlightsSearchSummaryBarProps {
  params: FlightsSearchParams;
}

export function FlightsSearchSummaryBar({ params }: FlightsSearchSummaryBarProps) {
  const route = `${params.origin} → ${params.destination}`;
  const dateLabel = formatFlightDate(`${params.departDate}T12:00:00.000Z`);
  const trip =
    params.tripType === "round" && params.returnDate
      ? `${dateLabel} – ${formatFlightDate(`${params.returnDate}T12:00:00.000Z`)}`
      : dateLabel;

  return (
    <div className="border-b border-indigo-900/50 bg-gradient-to-r from-indigo-950 via-primary to-indigo-900">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-indigo-200/90">
            Your search
          </p>
          <p className="truncate text-lg font-bold text-white sm:text-xl">
            {route}
          </p>
          <p className="mt-0.5 text-sm text-indigo-100/90">
            {trip}
            {" · "}
            {passengerLabel(params.passengerCount)}
            {" · "}
            {cabinClassLabel(params.cabinClass)}
          </p>
        </div>
        <Link
          href="/"
          className="shrink-0 rounded-lg border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Modify search
        </Link>
      </div>
    </div>
  );
}
