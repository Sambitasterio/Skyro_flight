import type { CabinClass } from "@/types/flight";

export type StopFilter = "nonstop" | "1" | "2plus";

export type DepartTimeBucket = "early" | "morning" | "afternoon" | "evening";

export interface FlightFilterState {
  minPrice: number | null;
  maxPrice: number | null;
  stops: StopFilter[];
  departTimes: DepartTimeBucket[];
}

export const STOP_OPTIONS: { value: StopFilter; label: string }[] = [
  { value: "nonstop", label: "Non-stop" },
  { value: "1", label: "1 Stop" },
  { value: "2plus", label: "2+ Stops" },
];

export const TIME_OPTIONS: { value: DepartTimeBucket; label: string; hint: string }[] =
  [
    { value: "early", label: "Early Morning", hint: "00:00 – 06:00" },
    { value: "morning", label: "Morning", hint: "06:00 – 12:00" },
    { value: "afternoon", label: "Afternoon", hint: "12:00 – 18:00" },
    { value: "evening", label: "Evening", hint: "18:00 – 24:00" },
  ];

function firstParam(
  value: string | string[] | undefined,
): string | undefined {
  if (value === undefined) return undefined;
  return Array.isArray(value) ? value[0] : value;
}

function parseCsv<T extends string>(
  raw: string | undefined,
  allowed: readonly T[],
): T[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter((s): s is T => allowed.includes(s as T));
}

function parseOptionalInt(raw: string | undefined): number | null {
  if (!raw) return null;
  const n = Number.parseInt(raw, 10);
  return Number.isNaN(n) ? null : n;
}

export function parseFlightFilterParams(
  raw: Record<string, string | string[] | undefined>,
): FlightFilterState {
  return {
    minPrice: parseOptionalInt(firstParam(raw.minPrice)),
    maxPrice: parseOptionalInt(firstParam(raw.maxPrice)),
    stops: parseCsv(firstParam(raw.stops), ["nonstop", "1", "2plus"] as const),
    departTimes: parseCsv(firstParam(raw.time), [
      "early",
      "morning",
      "afternoon",
      "evening",
    ] as const),
  };
}

export function countActiveFilters(filters: FlightFilterState): number {
  let n = 0;
  if (filters.minPrice !== null) n += 1;
  if (filters.maxPrice !== null) n += 1;
  if (filters.stops.length > 0) n += 1;
  if (filters.departTimes.length > 0) n += 1;
  return n;
}

export function filtersAreDefault(filters: FlightFilterState): boolean {
  return countActiveFilters(filters) === 0;
}
