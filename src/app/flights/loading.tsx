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

function SummaryBarSkeleton() {
  return <div className="h-24 animate-pulse bg-indigo-950/80" aria-hidden />;
}

function DateStripSkeleton() {
  return (
    <div className="border-b border-border bg-surface/80 py-3" aria-hidden>
      <div className="mx-auto flex max-w-7xl gap-2 px-4 sm:px-6">
        {Array.from({ length: 5 }, (_, i) => (
          <div
            key={i}
            className="h-14 w-20 shrink-0 animate-pulse rounded-xl bg-border"
          />
        ))}
      </div>
    </div>
  );
}

export default function FlightsLoading() {
  return (
    <FlightsResultsLayout
      topBar={<SummaryBarSkeleton />}
      dateStrip={<DateStripSkeleton />}
      header={
        <div className="h-8 w-48 animate-pulse rounded bg-border" aria-hidden />
      }
      sidebar={<FilterSidebarSkeleton />}
      results={<FlightResultsSkeleton count={3} />}
    />
  );
}
