import type { ReactNode } from "react";

interface StickyMobileFiltersProps {
  children: ReactNode;
}

/** Stays visible under the navbar while scrolling results on mobile. */
export function StickyMobileFilters({ children }: StickyMobileFiltersProps) {
  return (
    <div className="sticky top-16 z-30 -mx-4 border-b border-border bg-background/95 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6 lg:hidden">
      {children}
    </div>
  );
}
