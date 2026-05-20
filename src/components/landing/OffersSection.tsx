const OFFERS = [
  {
    id: "new-user",
    title: "New user flight deal",
    subtitle: "Flat ₹500 off your first booking",
    code: "SKYRO500",
    accent: "from-indigo-600 to-violet-600",
  },
  {
    id: "weekend",
    title: "Weekend getaway",
    subtitle: "Extra 8% off Delhi → Goa routes",
    code: "GOAWEEK",
    accent: "from-violet-600 to-purple-700",
  },
  {
    id: "business",
    title: "Business class upgrade",
    subtitle: "From ₹3,500 on select flights",
    code: "BIZUP",
    accent: "from-primary to-indigo-800",
  },
] as const;

export function OffersSection() {
  return (
    <section
      className="border-t border-border bg-background px-4 py-14 sm:px-6 sm:py-16"
      aria-labelledby="offers-heading"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2
              id="offers-heading"
              className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
            >
              Exclusive offers
            </h2>
            <p className="mt-1 text-sm text-muted sm:text-base">
              Apply codes at checkout when booking (demo promos)
            </p>
          </div>
          <div className="flex gap-2">
            <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
              Best offers
            </span>
            <span className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted">
              Flights
            </span>
          </div>
        </div>

        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {OFFERS.map((offer) => (
            <li
              key={offer.id}
              className={`overflow-hidden rounded-2xl bg-gradient-to-br ${offer.accent} p-5 text-white shadow-md transition hover:shadow-lg`}
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-white/80">
                Limited time
              </p>
              <h3 className="mt-2 text-lg font-bold">{offer.title}</h3>
              <p className="mt-1 text-sm text-white/90">{offer.subtitle}</p>
              <p className="mt-4 inline-flex rounded-lg bg-white/20 px-3 py-1.5 font-mono text-sm font-semibold backdrop-blur-sm">
                {offer.code}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
