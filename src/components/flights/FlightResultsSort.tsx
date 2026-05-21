"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

import { buildFlightsResultsUrl } from "@/lib/flights/build-results-url";
import { parseFlightFilterParams } from "@/lib/flights/filter-params";
import {
  SORT_OPTIONS,
  parseSortMode,
  type FlightSortMode,
} from "@/lib/flights/sort-flights";
import type { FlightsSearchParams } from "@/lib/flights/parse-search-params";

interface FlightResultsSortProps {
  search: FlightsSearchParams;
}

export function FlightResultsSort({ search }: FlightResultsSortProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filters = useMemo(
    () => parseFlightFilterParams(Object.fromEntries(searchParams.entries())),
    [searchParams],
  );
  const sort = parseSortMode(searchParams.get("sort") ?? undefined);

  const handleChange = (value: string) => {
    const next = parseSortMode(value) as FlightSortMode;
    router.replace(
      buildFlightsResultsUrl(search, filters, { sort: next }),
      { scroll: false },
    );
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3">
      <label htmlFor="flight-sort" className="text-sm font-medium text-foreground">
        Sort by
      </label>
      <select
        id="flight-sort"
        value={sort}
        onChange={(e) => handleChange(e.target.value)}
        className="min-h-10 min-w-[12rem] rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
