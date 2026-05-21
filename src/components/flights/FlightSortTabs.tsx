"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

import { buildFlightsResultsUrl } from "@/lib/flights/build-results-url";
import { formatInr } from "@/lib/flights/format";
import { parseFlightFilterParams } from "@/lib/flights/filter-params";
import {
  SORT_TAB_OPTIONS,
  type SortTabMeta,
  type SortTabMode,
  parseSortTab,
} from "@/lib/flights/sort-flights";
import type { FlightsSearchParams } from "@/lib/flights/parse-search-params";

interface FlightSortTabsProps {
  search: FlightsSearchParams;
  meta: Record<SortTabMode, SortTabMeta | null>;
}

export function FlightSortTabs({ search, meta }: FlightSortTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const active = parseSortTab(searchParams.get("sort") ?? undefined);
  const filters = useMemo(
    () => parseFlightFilterParams(Object.fromEntries(searchParams.entries())),
    [searchParams],
  );

  return (
    <div
      className="grid grid-cols-3 gap-2 sm:gap-3"
      role="tablist"
      aria-label="Sort flights"
    >
      {SORT_TAB_OPTIONS.map(({ value, label }) => {
        const m = meta[value];
        const isActive = active === value;
        return (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={isActive}
            disabled={!m}
            onClick={() => {
              router.replace(
                buildFlightsResultsUrl(search, filters, { sort: value }),
                { scroll: false },
              );
            }}
            className={`rounded-xl border px-3 py-3 text-left transition sm:px-4 sm:py-3.5 ${
              isActive
                ? "border-primary bg-primary text-primary-foreground shadow-md"
                : "border-slate-200 bg-white text-slate-900 hover:border-primary/40 disabled:opacity-50"
            }`}
          >
            <span className="block text-sm font-bold sm:text-base">{label}</span>
            {m ? (
              <>
                <span className="mt-1 block text-lg font-bold tabular-nums sm:text-xl">
                  {formatInr(m.price)}
                </span>
                <span
                  className={`text-xs ${isActive ? "text-indigo-100" : "text-slate-500"}`}
                >
                  {m.durationLabel} avg
                </span>
              </>
            ) : (
              <span className="mt-1 block text-xs text-slate-500">—</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
