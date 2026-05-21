export function FlightCardSkeleton() {
  return (
    <div
      className="rounded-2xl border border-border bg-card p-4 sm:p-5"
      aria-hidden
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3">
          <div className="h-4 w-32 animate-pulse rounded bg-border" />
          <div className="flex items-center gap-4">
            <div className="h-8 w-16 animate-pulse rounded bg-border" />
            <div className="h-2 flex-1 max-w-[120px] animate-pulse rounded bg-border" />
            <div className="h-8 w-16 animate-pulse rounded bg-border" />
          </div>
          <div className="h-3 w-48 animate-pulse rounded bg-border" />
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="h-6 w-24 animate-pulse rounded bg-border" />
          <div className="h-10 w-28 animate-pulse rounded-lg bg-border" />
        </div>
      </div>
    </div>
  );
}

export function FlightResultsSkeleton({ count = 3 }: { count?: number }) {
  return (
    <ul className="flex flex-col gap-4" aria-busy="true" aria-label="Loading flights">
      {Array.from({ length: count }, (_, i) => (
        <li key={i}>
          <FlightCardSkeleton />
        </li>
      ))}
    </ul>
  );
}
