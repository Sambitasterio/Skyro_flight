import type { FlightRow } from "@/types/database";

import { priceForCabin } from "./pricing";
import type { CabinClass } from "@/types/flight";

export interface DateStripOption {
  departDate: string;
  label: string;
  price: number | null;
  isSelected: boolean;
}

function addDays(isoDate: string, days: number): string {
  const d = new Date(`${isoDate}T12:00:00.000Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function formatStripLabel(isoDate: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
  }).format(new Date(`${isoDate}T12:00:00.000Z`));
}

function flightsOnDate(flights: FlightRow[], departDate: string): FlightRow[] {
  const start = new Date(`${departDate}T00:00:00.000Z`).getTime();
  const end = start + 86_400_000;
  return flights.filter((f) => {
    const t = new Date(f.departs_at).getTime();
    return t >= start && t < end;
  });
}

export function buildDateStripOptions(
  selectedDate: string,
  flights: FlightRow[],
  cabin: CabinClass,
): DateStripOption[] {
  const offsets = [-2, -1, 0, 1, 2, 3];
  return offsets.map((offset) => {
    const departDate = addDays(selectedDate, offset);
    const onDay = flightsOnDate(flights, departDate);
    const price =
      onDay.length > 0
        ? Math.min(...onDay.map((f) => priceForCabin(Number(f.base_price), cabin)))
        : null;

    return {
      departDate,
      label: formatStripLabel(departDate),
      price,
      isSelected: departDate === selectedDate,
    };
  });
}
