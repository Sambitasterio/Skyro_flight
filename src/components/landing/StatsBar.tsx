const STATS = [
  {
    value: "500+",
    label: "Destinations",
    hint: "Domestic & international",
    icon: GlobeIcon,
  },
  {
    value: "120+",
    label: "Airlines",
    hint: "Compare fares in one search",
    icon: PlaneIcon,
  },
  {
    value: "2M+",
    label: "Happy travelers",
    hint: "Booked on Skyro",
    icon: UsersIcon,
  },
  {
    value: "24/7",
    label: "Support",
    hint: "Help when you need it",
    icon: HeadsetIcon,
  },
] as const;

export function StatsBar() {
  return (
    <section
      className="relative overflow-hidden bg-gradient-to-r from-primary via-indigo-600 to-accent px-4 py-8 sm:px-6 sm:py-10"
      aria-label="Skyro highlights"
    >
      {/* Subtle pattern so the band feels less flat */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative mx-auto max-w-7xl">
        <p className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
          Why travelers choose Skyro
        </p>

        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {STATS.map(({ value, label, hint, icon: Icon }) => (
            <li key={label}>
              <div className="flex h-full items-center gap-4 rounded-xl border border-white/20 bg-white/10 px-4 py-4 backdrop-blur-sm sm:px-5 sm:py-5">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white ring-1 ring-white/20">
                  <Icon />
                </span>
                <div className="min-w-0 text-left">
                  <p className="text-2xl font-bold leading-none text-white sm:text-[1.75rem]">
                    {value}
                  </p>
                  <p className="mt-1.5 text-sm font-semibold text-white">{label}</p>
                  <p className="mt-0.5 text-xs leading-snug text-white/75">{hint}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function GlobeIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function PlaneIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 20 3c-1.5-1-2.5 0-4.5 1.5L12 8 3.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 5 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function HeadsetIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H3v-7zM18 11h3v7h-3a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2z" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
