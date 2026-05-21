import type { Metadata } from "next";
import { Suspense } from "react";

import { FlightsResultsPanel } from "@/components/flights/FlightsResultsPanel";
import { FlightResultsSkeleton } from "@/components/flights/FlightResultsSkeleton";
import { FlightsResultsLayout } from "@/components/flights/FlightsResultsLayout";
import { loadFlightResults } from "@/lib/flights/load-flight-results";

export const metadata: Metadata = {
  title: "Flight results",
};

/** Always read fresh search params + Supabase data (no static cache). */
export const dynamic = "force-dynamic";

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
      topBar={<div className="h-24 animate-pulse bg-indigo-950/80" aria-hidden />}
      dateStrip={
        <div className="h-16 animate-pulse border-b border-border bg-surface/50" aria-hidden />
      }
      header={
        <div className="h-8 w-48 animate-pulse rounded bg-border" aria-hidden />
      }
      sidebar={<FilterSidebarSkeleton />}
      results={<FlightResultsSkeleton count={3} />}
    />
  );
}

async function FlightsResultsContent({ searchParams }: FlightsPageProps) {
  const raw = await searchParams;
  const initial = await loadFlightResults(raw);

  return <FlightsResultsPanel initial={initial} />;
}

export default function FlightsPage(props: FlightsPageProps) {
  return (
    <Suspense fallback={<FlightsPanelFallback />}>
      <FlightsResultsContent {...props} />
    </Suspense>
  );
}
