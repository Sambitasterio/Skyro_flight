"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

import { buildDateStripOptions } from "@/lib/flights/date-strip";
import { buildFlightsResultsUrl } from "@/lib/flights/build-results-url";
import { formatInrCompact } from "@/lib/flights/format";
import { parseFlightFilterParams } from "@/lib/flights/filter-params";
import { parseSortTab, type SortTabMode } from "@/lib/flights/sort-flights";
import type { FlightsSearchParams } from "@/lib/flights/parse-search-params";
import type { FlightRow } from "@/types/database";

interface FlightDateStripProps {
  search: FlightsSearchParams;
  flights: FlightRow[];
}

export function FlightDateStrip({ search, flights }: FlightDateStripProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filters = useMemo(
    () => parseFlightFilterParams(Object.fromEntries(searchParams.entries())),
    [searchParams],
  );
  const sort = parseSortTab(searchParams.get("sort") ?? undefined) as SortTabMode;

  const options = useMemo(
    () => buildDateStripOptions(search.departDate, flights, search.cabinClass),
    [search.departDate, flights, search.cabinClass],
  );

  return (
    <div className="border-b border-border bg-surface/80">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {options.map((opt) => (
            <button
              key={opt.departDate}
              type="button"
              onClick={() => {
                router.replace(
                  buildFlightsResultsUrl(search, filters, {
                    departDate: opt.departDate,
                    sort,
                  }),
                  { scroll: false },
                );
              }}
              className={`flex min-w-[5.5rem] shrink-0 flex-col rounded-xl border px-3 py-2 text-left transition ${
                opt.isSelected
                  ? "border-primary bg-primary text-primary-foreground shadow-md"
                  : "border-border bg-card text-foreground hover:border-primary/50"
              }`}
            >
              <span className="text-xs font-medium opacity-90">{opt.label}</span>
              <span className="text-sm font-bold tabular-nums">
                {opt.price !== null ? formatInrCompact(opt.price) : "—"}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
