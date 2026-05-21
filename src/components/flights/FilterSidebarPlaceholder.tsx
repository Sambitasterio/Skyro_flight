export function FilterSidebarPlaceholder() {
  return (
    <div
      className="rounded-2xl border border-border bg-card p-4"
      aria-label="Filters"
    >
      <h2 className="text-sm font-semibold text-foreground">Filters</h2>
      <p className="mt-2 text-xs leading-relaxed text-muted">
        Price, stops, class, and departure time filters ship in Phase 4.2.
      </p>
      <div className="mt-4 space-y-3">
        {["Stops", "Price range", "Cabin class", "Departure time"].map(
          (label) => (
            <div
              key={label}
              className="h-9 rounded-lg border border-dashed border-border bg-background/50"
              aria-hidden
            />
          ),
        )}
      </div>
    </div>
  );
}
