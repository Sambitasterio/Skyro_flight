import { FlightResultsSkeleton } from "@/components/flights/FlightResultsSkeleton";
import { FilterSidebarPlaceholder } from "@/components/flights/FilterSidebarPlaceholder";
import { FlightsResultsLayout } from "@/components/flights/FlightsResultsLayout";

export default function FlightsLoading() {
  return (
    <FlightsResultsLayout
      sidebar={<FilterSidebarPlaceholder />}
      header={
        <div className="space-y-3" aria-busy="true" aria-label="Loading search summary">
          <div className="h-4 w-28 animate-pulse rounded bg-border" />
          <div className="h-8 w-64 max-w-full animate-pulse rounded bg-border" />
          <div className="h-4 w-full max-w-md animate-pulse rounded bg-border" />
        </div>
      }
      results={<FlightResultsSkeleton count={3} />}
    />
  );
}
