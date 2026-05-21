"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

import { applyFlightFilters, computeFilterFacets } from "@/lib/flights/apply-filters";
import { parseFlightFilterParams } from "@/lib/flights/filter-params";
import type { FlightsSearchParams } from "@/lib/flights/parse-search-params";
import type { FlightRow } from "@/types/database";

import { FlightFilters, MobileFilterSheet } from "./FlightFilters";
import { FlightResultsHeader } from "./FlightResultsHeader";
import {
  FlightResultsEmpty,
  FlightResultsFilterEmpty,
} from "./FlightResultsPlaceholderList";
import { FlightResultsList } from "./FlightResultsList";
import { FlightResultsSort } from "./FlightResultsSort";
import { FlightsResultsLayout } from "./FlightsResultsLayout";

interface FlightsResultsPanelProps {
  flights: FlightRow[];
  search: FlightsSearchParams;
  flexibleDate: boolean;
  fetchError: string | null;
}

export function FlightsResultsPanel({
  flights,
  search,
  flexibleDate,
  fetchError,
}: FlightsResultsPanelProps) {
  const searchParams = useSearchParams();
  const filters = useMemo(
    () => parseFlightFilterParams(Object.fromEntries(searchParams.entries())),
    [searchParams],
  );

  const facets = useMemo(() => computeFilterFacets(flights), [flights]);
  const filteredFlights = useMemo(
    () => applyFlightFilters(flights, filters),
    [flights, filters],
  );

  const resultsContent = fetchError ? (
    <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-6 py-8 text-center">
      <p className="font-semibold text-foreground">Something went wrong</p>
      <p className="mt-2 text-sm text-muted">{fetchError}</p>
    </div>
  ) : flights.length === 0 ? (
    <FlightResultsEmpty />
  ) : filteredFlights.length === 0 ? (
    <FlightResultsFilterEmpty />
  ) : (
    <>
      {flexibleDate ? (
        <p className="mb-4 text-sm text-muted">
          No flights on your exact date — showing upcoming flights on this route.
        </p>
      ) : null}
      <div className="space-y-4">
        <FlightResultsSort search={search} />
        <FlightResultsList
          flights={filteredFlights}
          cabinClass={search.cabinClass}
        />
      </div>
    </>
  );

  return (
    <FlightsResultsLayout
      header={
        <FlightResultsHeader
          params={search}
          count={fetchError ? 0 : filteredFlights.length}
          flexibleDate={flexibleDate && !fetchError}
          totalUnfiltered={
            fetchError || filteredFlights.length === flights.length
              ? undefined
              : flights.length
          }
        />
      }
      sidebar={<FlightFilters search={search} facets={facets} />}
      mobileFilterTrigger={
        <MobileFilterSheet search={search} facets={facets} />
      }
      results={resultsContent}
    />
  );
}
