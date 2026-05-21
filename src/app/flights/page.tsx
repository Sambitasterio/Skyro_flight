import type { Metadata } from "next";
import { Suspense } from "react";

import { FilterSidebarPlaceholder } from "@/components/flights/FilterSidebarPlaceholder";
import {
  FlightResultsEmpty,
  FlightResultsPlaceholderList,
} from "@/components/flights/FlightResultsPlaceholderList";
import { FlightResultsHeader } from "@/components/flights/FlightResultsHeader";
import { FlightResultsSkeleton } from "@/components/flights/FlightResultsSkeleton";
import { FlightsResultsLayout } from "@/components/flights/FlightsResultsLayout";
import { parseFlightsSearchParams } from "@/lib/flights/parse-search-params";
import { searchFlights } from "@/lib/flights/search-flights";

export const metadata: Metadata = {
  title: "Flight results",
};

interface FlightsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

async function FlightsResults({ searchParams }: FlightsPageProps) {
  const raw = await searchParams;
  const params = parseFlightsSearchParams(raw);

  let flights: Awaited<ReturnType<typeof searchFlights>>["flights"] = [];
  let flexibleDate = false;
  let fetchError: string | null = null;

  try {
    const result = await searchFlights(params);
    flights = result.flights;
    flexibleDate = result.flexibleDate;
  } catch (err) {
    fetchError =
      err instanceof Error ? err.message : "Could not load flights.";
  }

  const resultsContent = fetchError ? (
    <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-6 py-8 text-center">
      <p className="font-semibold text-foreground">Something went wrong</p>
      <p className="mt-2 text-sm text-muted">{fetchError}</p>
    </div>
  ) : flights.length === 0 ? (
    <FlightResultsEmpty />
  ) : (
    <FlightResultsPlaceholderList flights={flights} />
  );

  return (
    <FlightsResultsLayout
      sidebar={<FilterSidebarPlaceholder />}
      header={
        <FlightResultsHeader
          params={params}
          count={fetchError ? 0 : flights.length}
          flexibleDate={flexibleDate}
        />
      }
      mobileFilterTrigger={
        <button
          type="button"
          disabled
          className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-muted"
          aria-disabled
        >
          Filters (Phase 4.2)
        </button>
      }
      results={resultsContent}
    />
  );
}

export default function FlightsPage(props: FlightsPageProps) {
  return (
    <Suspense fallback={<FlightsPageSuspenseFallback />}>
      <FlightsResults {...props} />
    </Suspense>
  );
}

function FlightsPageSuspenseFallback() {
  return (
    <FlightsResultsLayout
      sidebar={<FilterSidebarPlaceholder />}
      header={
        <div className="space-y-3" aria-busy="true">
          <div className="h-4 w-28 animate-pulse rounded bg-border" />
          <div className="h-8 w-64 animate-pulse rounded bg-border" />
          <div className="h-4 w-96 max-w-full animate-pulse rounded bg-border" />
        </div>
      }
      results={<FlightResultsSkeleton count={3} />}
    />
  );
}
