"use client";

import { useMemo } from "react";

import { useFlightResultsData } from "@/hooks/useFlightResultsData";
import { applyFlightFilters, computeFilterFacets } from "@/lib/flights/apply-filters";
import { computeSortTabMeta } from "@/lib/flights/sort-flights";
import type { FlightResultsPayload } from "@/lib/flights/load-flight-results";

import { FlightDateStrip } from "./FlightDateStrip";
import { FlightFilters, MobileFilterSheet } from "./FlightFilters";
import { FlightResultsHeader } from "./FlightResultsHeader";
import {
  FlightResultsEmpty,
  FlightResultsFilterEmpty,
} from "./FlightResultsPlaceholderList";
import { FlightResultsList } from "./FlightResultsList";
import { FlightResultsSkeleton } from "./FlightResultsSkeleton";
import { FlightResultsToast } from "./FlightResultsToast";
import { FlightSortTabs } from "./FlightSortTabs";
import { FlightsResultsLayout } from "./FlightsResultsLayout";
import { FlightsSearchSummaryBar } from "./FlightsSearchSummaryBar";
import { StickyMobileFilters } from "./StickyMobileFilters";

interface FlightsResultsPanelProps {
  initial: FlightResultsPayload;
}

export function FlightsResultsPanel({ initial }: FlightsResultsPanelProps) {
  const { data, isRefetching, fetchError } = useFlightResultsData({ initial });
  const { search, flights, flexibleDate } = data;

  const filteredFlights = useMemo(
    () => applyFlightFilters(flights, data.filters),
    [flights, data.filters],
  );

  const facets = useMemo(() => computeFilterFacets(flights), [flights]);
  const sortMeta = useMemo(
    () => computeSortTabMeta(filteredFlights, search.cabinClass),
    [filteredFlights, search.cabinClass],
  );

  const resultsContent = fetchError && flights.length === 0 ? (
    <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-6 py-8 text-center">
      <p className="font-semibold text-foreground">Something went wrong</p>
      <p className="mt-2 text-sm text-muted">{fetchError}</p>
    </div>
  ) : flights.length === 0 ? (
    <FlightResultsEmpty />
  ) : filteredFlights.length === 0 ? (
    <FlightResultsFilterEmpty />
  ) : (
    <div className="relative space-y-4">
      {isRefetching ? (
        <div
          className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-background/70 backdrop-blur-[2px]"
          aria-busy="true"
          aria-label="Updating flights"
        >
          <p className="text-sm font-medium text-muted">Updating results…</p>
        </div>
      ) : null}
      <FlightSortTabs search={search} meta={sortMeta} />
      <FlightResultsList
        flights={filteredFlights}
        cabinClass={search.cabinClass}
      />
    </div>
  );

  return (
    <>
      <FlightResultsToast message={fetchError} />
      <FlightsResultsLayout
        topBar={<FlightsSearchSummaryBar params={search} />}
        dateStrip={
          !fetchError && flights.length > 0 ? (
            <FlightDateStrip search={search} flights={flights} />
          ) : null
        }
        header={
          <FlightResultsHeader
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
        stickyMobileFilters={
          <StickyMobileFilters>
            <MobileFilterSheet search={search} facets={facets} />
          </StickyMobileFilters>
        }
        results={
          isRefetching && flights.length === 0 ? (
            <FlightResultsSkeleton count={3} />
          ) : (
            resultsContent
          )
        }
      />
    </>
  );
}
