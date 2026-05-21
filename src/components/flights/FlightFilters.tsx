"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { buildFlightsResultsUrl } from "@/lib/flights/build-results-url";
import { parseSortTab } from "@/lib/flights/sort-flights";
import {
  STOP_OPTIONS,
  TIME_OPTIONS,
  countActiveFilters,
  filtersAreDefault,
  parseFlightFilterParams,
  type DepartTimeBucket,
  type FlightFilterState,
  type StopFilter,
} from "@/lib/flights/filter-params";
import type { FilterFacets } from "@/lib/flights/apply-filters";
import { formatInr } from "@/lib/flights/format";
import type { FlightsSearchParams } from "@/lib/flights/parse-search-params";
import type { CabinClass } from "@/types/flight";

const CABIN_OPTIONS: { value: CabinClass; label: string }[] = [
  { value: "economy", label: "Economy" },
  { value: "business", label: "Business" },
  { value: "first", label: "First" },
];

interface FlightFiltersProps {
  search: FlightsSearchParams;
  facets: FilterFacets;
  /** When true, render only inner content (for bottom sheet). */
  embedded?: boolean;
}

export function FlightFilters({
  search,
  facets,
  embedded = false,
}: FlightFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const filters = useMemo(
    () => parseFlightFilterParams(Object.fromEntries(searchParams.entries())),
    [searchParams],
  );

  const priceMin = facets.minPrice;
  const priceMax = facets.maxPrice;
  const sliderMin = filters.minPrice ?? priceMin;
  const sliderMax = filters.maxPrice ?? priceMax;

  const sort = parseSortTab(searchParams.get("sort") ?? undefined);

  const pushFilters = useCallback(
    (next: FlightFilterState, cabin?: CabinClass) => {
      router.replace(
        buildFlightsResultsUrl(search, next, { cabinClass: cabin, sort }),
        { scroll: false },
      );
    },
    [router, search, sort],
  );

  const toggleStop = (stop: StopFilter) => {
    const stops = filters.stops.includes(stop)
      ? filters.stops.filter((s) => s !== stop)
      : [...filters.stops, stop];
    pushFilters({ ...filters, stops });
  };

  const toggleTime = (bucket: DepartTimeBucket) => {
    const departTimes = filters.departTimes.includes(bucket)
      ? filters.departTimes.filter((t) => t !== bucket)
      : [...filters.departTimes, bucket];
    pushFilters({ ...filters, departTimes });
  };

  const setCabin = (cabinClass: CabinClass) => {
    pushFilters(filters, cabinClass);
  };

  const setPriceRange = (min: number, max: number) => {
    const atBounds = min <= priceMin && max >= priceMax;
    pushFilters({
      ...filters,
      minPrice: atBounds ? null : min,
      maxPrice: atBounds ? null : max,
    });
  };

  const clearAll = () => {
    pushFilters({
      minPrice: null,
      maxPrice: null,
      stops: [],
      departTimes: [],
    });
  };

  const content = (
    <div className={embedded ? "space-y-6" : "space-y-6"}>
      <FilterSection title="Stops">
        <ul className="space-y-2">
          {STOP_OPTIONS.map((opt) => (
            <li key={opt.value}>
              <FilterCheckbox
                id={`stop-${opt.value}`}
                label={opt.label}
                count={facets.stops[opt.value]}
                checked={filters.stops.includes(opt.value)}
                onChange={() => toggleStop(opt.value)}
              />
            </li>
          ))}
        </ul>
      </FilterSection>

      <FilterSection title="Price range">
        <PriceRangeFilter
          boundsMin={priceMin}
          boundsMax={priceMax}
          valueMin={sliderMin}
          valueMax={sliderMax}
          onChange={setPriceRange}
        />
      </FilterSection>

      <FilterSection title="Departure time">
        <ul className="space-y-2">
          {TIME_OPTIONS.map((opt) => (
            <li key={opt.value}>
              <FilterCheckbox
                id={`time-${opt.value}`}
                label={opt.label}
                hint={opt.hint}
                count={facets.times[opt.value]}
                checked={filters.departTimes.includes(opt.value)}
                onChange={() => toggleTime(opt.value)}
              />
            </li>
          ))}
        </ul>
      </FilterSection>

      <FilterSection title="Cabin class">
        <fieldset className="space-y-2">
          <legend className="sr-only">Cabin class</legend>
          {CABIN_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className="flex cursor-pointer items-center gap-2 rounded-lg px-1 py-1.5 text-sm hover:bg-background/60"
            >
              <input
                type="radio"
                name="cabin-filter"
                value={opt.value}
                checked={search.cabinClass === opt.value}
                onChange={() => setCabin(opt.value)}
                className="h-4 w-4 border-border text-primary focus-visible:ring-2 focus-visible:ring-ring"
              />
              <span className="text-foreground">{opt.label}</span>
            </label>
          ))}
        </fieldset>
      </FilterSection>

      <FilterSection title="Airline">
        <FilterCheckbox
          id="airline-skyro"
          label="Skyro"
          count={null}
          checked
          disabled
          onChange={() => {}}
        />
        <p className="mt-1 text-xs text-muted">All seed flights are Skyro operated.</p>
      </FilterSection>

      {!filtersAreDefault(filters) ? (
        <button
          type="button"
          onClick={clearAll}
          className="text-primary text-sm font-semibold hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          Clear all filters
        </button>
      ) : null}
    </div>
  );

  if (embedded) return content;

  return (
    <div
      className="sticky top-20 rounded-2xl border border-border bg-card p-4"
      aria-label="Filters"
    >
      <h2 className="text-sm font-semibold text-foreground">Filters</h2>
      <div className="mt-4">{content}</div>
    </div>
  );
}

export function MobileFilterSheet({
  search,
  facets,
}: {
  search: FlightsSearchParams;
  facets: FilterFacets;
}) {
  const searchParams = useSearchParams();
  const filters = useMemo(
    () => parseFlightFilterParams(Object.fromEntries(searchParams.entries())),
    [searchParams],
  );
  const activeCount = countActiveFilters(filters);
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-between rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <span>Filters</span>
        {activeCount > 0 ? (
          <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">
            {activeCount}
          </span>
        ) : null}
      </button>

      {open ? (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50"
            aria-hidden
            onClick={() => setOpen(false)}
          />
          <div
            role="dialog"
            aria-label="Flight filters"
            className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-2xl border border-border bg-card p-5 shadow-2xl"
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border" />
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">Filters</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-sm font-semibold text-primary"
              >
                Done
              </button>
            </div>
            <FlightFilters search={search} facets={facets} embedded />
          </div>
        </>
      ) : null}
    </>
  );
}

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
        {title}
      </h3>
      {children}
    </section>
  );
}

function FilterCheckbox({
  id,
  label,
  hint,
  count,
  checked,
  disabled,
  onChange,
}: {
  id: string;
  label: string;
  hint?: string;
  count: number | null;
  checked: boolean;
  disabled?: boolean;
  onChange: () => void;
}) {
  return (
    <label
      htmlFor={id}
      className={`flex cursor-pointer items-center justify-between gap-2 rounded-lg px-1 py-1.5 text-sm ${
        disabled ? "cursor-default opacity-70" : "hover:bg-background/60"
      }`}
    >
      <span className="flex items-center gap-2">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={onChange}
          className="h-4 w-4 rounded border-border text-primary focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
        />
        <span>
          <span className="text-foreground">{label}</span>
          {hint ? (
            <span className="block text-xs text-muted">{hint}</span>
          ) : null}
        </span>
      </span>
      {count !== null ? (
        <span className="shrink-0 rounded-md bg-background px-2 py-0.5 text-xs tabular-nums text-muted">
          {count}
        </span>
      ) : null}
    </label>
  );
}

function PriceRangeFilter({
  boundsMin,
  boundsMax,
  valueMin,
  valueMax,
  onChange,
}: {
  boundsMin: number;
  boundsMax: number;
  valueMin: number;
  valueMax: number;
  onChange: (min: number, max: number) => void;
}) {
  const span = Math.max(boundsMax - boundsMin, 1);
  const step = Math.max(100, Math.round(span / 50));
  const disabled = boundsMin >= boundsMax;

  const [localMin, setLocalMin] = useState(valueMin);
  const [localMax, setLocalMax] = useState(valueMax);

  useEffect(() => {
    setLocalMin(valueMin);
    setLocalMax(valueMax);
  }, [valueMin, valueMax]);

  const commitRange = useCallback(
    (min: number, max: number) => {
      const nextMin = Math.min(min, max);
      const nextMax = Math.max(min, max);
      onChange(nextMin, nextMax);
    },
    [onChange],
  );

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-foreground">
        {formatInr(localMin)} – {formatInr(localMax)}
      </p>
      <div className="space-y-4">
        <div>
          <span
            id="price-min-label"
            className="block text-xs text-muted"
          >
            Min price
          </span>
          <input
            id="price-min-range"
            type="range"
            min={boundsMin}
            max={boundsMax}
            step={step}
            value={localMin}
            disabled={disabled}
            aria-labelledby="price-min-label"
            onInput={(e) => {
              const min = Number(e.currentTarget.value);
              setLocalMin(Math.min(min, localMax));
            }}
            onPointerUp={(e) => {
              const min = Number(e.currentTarget.value);
              commitRange(min, Math.max(min, localMax));
            }}
            onKeyUp={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                commitRange(localMin, localMax);
              }
            }}
            className="price-range-input mt-2 w-full"
          />
        </div>
        <div>
          <span
            id="price-max-label"
            className="block text-xs text-muted"
          >
            Max price
          </span>
          <input
            id="price-max-range"
            type="range"
            min={boundsMin}
            max={boundsMax}
            step={step}
            value={localMax}
            disabled={disabled}
            aria-labelledby="price-max-label"
            onInput={(e) => {
              const max = Number(e.currentTarget.value);
              setLocalMax(Math.max(max, localMin));
            }}
            onPointerUp={(e) => {
              commitRange(localMin, Number(e.currentTarget.value));
            }}
            onKeyUp={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                commitRange(localMin, localMax);
              }
            }}
            className="price-range-input mt-2 w-full"
          />
        </div>
      </div>
    </div>
  );
}
