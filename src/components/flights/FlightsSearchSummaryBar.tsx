"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

import { FlightSearchCard } from "@/components/search/FlightSearchCard";
import {
  airportLabel,
  cabinClassLabel,
  formatFlightDate,
  passengerLabel,
} from "@/lib/flights/format";
import { buildFlightsResultsUrl } from "@/lib/flights/build-results-url";
import { parseFlightFilterParams } from "@/lib/flights/filter-params";
import {
  flightsSearchParamsToQuery,
  type FlightsSearchParams,
} from "@/lib/flights/parse-search-params";
import { parseSortTab } from "@/lib/flights/sort-flights";
import type { SearchQuery } from "@/types/flight";

interface FlightsSearchSummaryBarProps {
  params: FlightsSearchParams;
}

export function FlightsSearchSummaryBar({ params }: FlightsSearchSummaryBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [modifyOpen, setModifyOpen] = useState(false);

  const route = `${airportLabel(params.origin)} → ${airportLabel(params.destination)}`;
  const dateLabel = formatFlightDate(`${params.departDate}T12:00:00.000Z`);
  const trip =
    params.tripType === "round" && params.returnDate
      ? `${dateLabel} – ${formatFlightDate(`${params.returnDate}T12:00:00.000Z`)}`
      : dateLabel;

  const seedQuery = flightsSearchParamsToQuery(params);

  const handleSubmitQuery = useCallback(
    (query: SearchQuery) => {
      const filters = parseFlightFilterParams(
        Object.fromEntries(searchParams.entries()),
      );
      const sort = parseSortTab(searchParams.get("sort") ?? undefined);
      const nextSearch: FlightsSearchParams = {
        origin: query.origin,
        destination: query.destination,
        departDate: query.departDate,
        returnDate: query.tripType === "round" ? query.returnDate : null,
        passengerCount: query.passengerCount,
        cabinClass: query.cabinClass,
        tripType: query.tripType,
      };
      router.push(
        buildFlightsResultsUrl(nextSearch, filters, {
          sort,
          cabinClass: query.cabinClass,
        }),
      );
    },
    [router, searchParams],
  );

  return (
    <div className="border-b border-indigo-900/50 bg-gradient-to-r from-indigo-950 via-primary to-indigo-900">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
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
          <button
            type="button"
            onClick={() => setModifyOpen((o) => !o)}
            aria-expanded={modifyOpen}
            aria-controls="modify-search-panel"
            className="shrink-0 rounded-lg border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {modifyOpen ? "Close" : "Modify search"}
          </button>
        </div>

        {modifyOpen ? (
          <div
            id="modify-search-panel"
            className="mt-4 border-t border-white/20 pt-4"
          >
            <FlightSearchCard
              seedQuery={seedQuery}
              onSubmitQuery={handleSubmitQuery}
              onSubmitted={() => setModifyOpen(false)}
              submitLabel="Update results"
              className="mx-auto shadow-xl"
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
