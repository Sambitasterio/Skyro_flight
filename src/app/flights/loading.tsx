import { FlightResultsSkeleton } from "@/components/flights/FlightResultsSkeleton";
import { FlightsResultsLayout } from "@/components/flights/FlightsResultsLayout";

function FilterSidebarSkeleton() {
  return (
    <div
      className="rounded-2xl border border-border bg-card p-4"
      aria-hidden
    >
      <div className="h-4 w-16 animate-pulse rounded bg-border" />
      <div className="mt-4 space-y-3">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="h-9 animate-pulse rounded-lg bg-border" />
        ))}
      </div>
    </div>
  );
}

export default function FlightsLoading() {
  return (
    <FlightsResultsLayout
      header={
        <div className="space-y-3" aria-busy="true" aria-label="Loading search summary">
          <div className="h-4 w-28 animate-pulse rounded bg-border" />
          <div className="h-8 w-64 max-w-full animate-pulse rounded bg-border" />
          <div className="h-4 w-full max-w-md animate-pulse rounded bg-border" />
        </div>
      }
      sidebar={<FilterSidebarSkeleton />}
      results={<FlightResultsSkeleton count={3} />}
    />
  );
}
