import type { ReactNode } from "react";

interface FlightsResultsLayoutProps {
  topBar?: ReactNode;
  dateStrip?: ReactNode;
  header: ReactNode;
  sidebar: ReactNode;
  results: ReactNode;
  stickyMobileFilters?: ReactNode;
}

export function FlightsResultsLayout({
  topBar,
  dateStrip,
  header,
  sidebar,
  results,
  stickyMobileFilters,
}: FlightsResultsLayoutProps) {
  return (
    <main className="flex-1 bg-background">
      {topBar}
      {dateStrip}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:py-10">
        <div className="mb-5 lg:mb-6">{header}</div>

        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          <aside className="hidden w-[260px] shrink-0 lg:block">{sidebar}</aside>

          <div className="min-w-0 flex-1">
            {stickyMobileFilters}
            {results}
          </div>
        </div>
      </div>
    </main>
  );
}
