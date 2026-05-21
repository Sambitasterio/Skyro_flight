import type { FlightsSearchParams } from "@/lib/flights/parse-search-params";

interface FlightResultsHeaderProps {
  count: number;
  flexibleDate?: boolean;
  totalUnfiltered?: number;
}

/** Compact count line below summary bar (route lives in summary bar). */
export function FlightResultsHeader({
  count,
  flexibleDate = false,
  totalUnfiltered,
}: FlightResultsHeaderProps) {
  return (
    <header className="space-y-1">
      <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
        {count === 0
          ? "No flights found"
          : `${count} flight${count === 1 ? "" : "s"} found`}
      </h1>
      {flexibleDate && count > 0 ? (
        <p className="text-sm text-muted">
          No flights on your exact date — showing upcoming flights on this route.
        </p>
      ) : null}
      {totalUnfiltered !== undefined &&
      totalUnfiltered > count &&
      count > 0 ? (
        <p className="text-sm text-muted">
          Showing {count} of {totalUnfiltered} after filters.
        </p>
      ) : null}
    </header>
  );
}
