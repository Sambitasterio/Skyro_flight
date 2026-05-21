export function SeatMapLegend() {
  const items = [
    { label: "Available", className: "bg-slate-200 dark:bg-slate-600" },
    { label: "Premium", className: "bg-amber-200 ring-1 ring-amber-500/60" },
    { label: "Selected", className: "bg-primary ring-2 ring-indigo-300" },
    { label: "Taken", className: "bg-slate-400 opacity-50" },
  ] as const;

  return (
    <div
      className="flex flex-wrap gap-4 rounded-xl border border-border bg-card/80 px-4 py-3 text-xs"
      aria-label="Seat map legend"
    >
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <span
            className={`h-5 w-5 rounded-md ${item.className}`}
            aria-hidden
          />
          <span className="font-medium text-foreground">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
