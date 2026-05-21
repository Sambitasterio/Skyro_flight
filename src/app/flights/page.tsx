import type { Metadata } from "next";
import { Suspense } from "react";

import { FlightsResultsPanel } from "@/components/flights/FlightsResultsPanel";
import { FlightResultsSkeleton } from "@/components/flights/FlightResultsSkeleton";
import { FlightsResultsLayout } from "@/components/flights/FlightsResultsLayout";
import { parseFlightFilterParams } from "@/lib/flights/filter-params";
import { parseFlightsSearchParams } from "@/lib/flights/parse-search-params";
import { searchFlights } from "@/lib/flights/search-flights";

export const metadata: Metadata = {
  title: "Flight results",
};

interface FlightsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function FilterSidebarSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card p-4" aria-hidden>
      <div className="h-4 w-16 animate-pulse rounded bg-border" />
      <div className="mt-4 space-y-3">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="h-9 animate-pulse rounded-lg bg-border" />
        ))}
      </div>
    </div>
  );
}

function FlightsPanelFallback() {
  return (
    <FlightsResultsLayout
      header={
        <div className="space-y-3" aria-busy="true">
          <div className="h-4 w-28 animate-pulse rounded bg-border" />
          <div className="h-8 w-64 animate-pulse rounded bg-border" />
          <div className="h-4 w-96 max-w-full animate-pulse rounded bg-border" />
        </div>
      }
      sidebar={<FilterSidebarSkeleton />}
      results={<FlightResultsSkeleton count={3} />}
    />
  );
}

async function FlightsResultsContent({ searchParams }: FlightsPageProps) {
  const raw = await searchParams;
  const params = parseFlightsSearchParams(raw);
  const filters = parseFlightFilterParams(raw);

  let flights: Awaited<ReturnType<typeof searchFlights>>["flights"] = [];
  let flexibleDate = false;
  let fetchError: string | null = null;

  try {
    const result = await searchFlights(params, filters);
    flights = result.flights;
    flexibleDate = result.flexibleDate;
  } catch (err) {
    fetchError =
      err instanceof Error ? err.message : "Could not load flights.";
  }

  return (
    <FlightsResultsPanel
      flights={flights}
      search={params}
      flexibleDate={flexibleDate}
      fetchError={fetchError}
    />
  );
}

export default function FlightsPage(props: FlightsPageProps) {
  return (
    <Suspense fallback={<FlightsPanelFallback />}>
      <FlightsResultsContent {...props} />
    </Suspense>
  );
}
