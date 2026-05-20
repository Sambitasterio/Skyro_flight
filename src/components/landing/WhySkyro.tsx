const FEATURES = [
  {
    title: "Instant booking",
    description:
      "Search, pick your seat, and confirm in minutes with a clear price breakdown.",
    icon: BoltIcon,
  },
  {
    title: "Live seat map",
    description:
      "See seats update in real time so you never pick one that was just taken.",
    icon: MapIcon,
  },
  {
    title: "Free reschedule",
    description:
      "Change plans when life happens — reschedule or cancel with clear rules upfront.",
    icon: CalendarIcon,
  },
] as const;

export function WhySkyro() {
  return (
    <section
      className="border-t border-border bg-surface px-4 py-14 sm:px-6 sm:py-16"
      aria-labelledby="why-skyro-heading"
    >
      <div className="mx-auto max-w-7xl">
        <h2
          id="why-skyro-heading"
          className="text-center text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
        >
          Why book with Skyro?
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-center text-sm text-muted sm:text-base">
          Built for speed, clarity, and control — from search to boarding pass.
        </p>

        <ul className="mt-10 grid gap-6 sm:grid-cols-3">
          {FEATURES.map(({ title, description, icon: Icon }) => (
            <li
              key={title}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:border-primary/30 hover:shadow-md"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <Icon />
              </span>
              <h3 className="mt-4 text-lg font-semibold text-foreground">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function BoltIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MapIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M4 6h16M4 12h10M4 18h6" strokeLinecap="round" />
      <rect x="2" y="4" width="20" height="16" rx="2" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
    </svg>
  );
}
