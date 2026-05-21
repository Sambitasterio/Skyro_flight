import Link from "next/link";

export function FlightResultsEmpty() {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center">
      <p className="text-lg font-semibold text-foreground">No flights found</p>
      <p className="mt-2 text-sm text-muted">
        Try different airports or dates. Seed routes: DEL↔BOM, BOM↔GOA,
        DEL↔BLR, BLR↔HYD.
      </p>
      <Link
        href="/"
        className="text-primary mt-6 inline-block text-sm font-semibold hover:underline"
      >
        Back to search
      </Link>
    </div>
  );
}
