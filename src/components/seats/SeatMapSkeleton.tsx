export function SeatMapSkeleton() {
  return (
    <div
      className="rounded-2xl border border-border bg-card p-6"
      aria-busy="true"
      aria-label="Loading seat map"
    >
      <div className="mx-auto max-w-md space-y-3">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="flex items-center justify-center gap-2">
            <div className="h-11 w-8 animate-pulse rounded bg-border" />
            {Array.from({ length: 6 }, (_, j) => (
              <div
                key={j}
                className="h-11 w-11 animate-pulse rounded-lg bg-border"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
