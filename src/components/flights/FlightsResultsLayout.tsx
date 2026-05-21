import type { ReactNode } from "react";

interface FlightsResultsLayoutProps {
  sidebar: ReactNode;
  header: ReactNode;
  results: ReactNode;
  mobileFilterTrigger?: ReactNode;
}

export function FlightsResultsLayout({
  sidebar,
  header,
  results,
  mobileFilterTrigger,
}: FlightsResultsLayoutProps) {
  return (
    <main className="flex-1 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:py-12">
        <div className="mb-6 lg:mb-8">{header}</div>

        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          <aside className="hidden w-[260px] shrink-0 lg:block">{sidebar}</aside>

          <div className="min-w-0 flex-1">
            {mobileFilterTrigger ? (
              <div className="mb-4 lg:hidden">{mobileFilterTrigger}</div>
            ) : null}
            {results}
          </div>
        </div>
      </div>
    </main>
  );
}
