import { findAirport } from "@/lib/airports";
import type { CabinClass } from "@/types/flight";

export function formatInr(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatFlightTime(iso: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(iso));
}

export function formatFlightDate(iso: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(new Date(iso));
}

export function formatDuration(departsAt: string, arrivesAt: string): string {
  const ms = new Date(arrivesAt).getTime() - new Date(departsAt).getTime();
  const totalMinutes = Math.max(0, Math.round(ms / 60_000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}

export function airportLabel(code: string): string {
  const airport = findAirport(code);
  return airport ? `${airport.city} (${code})` : code;
}

export function cabinClassLabel(cabin: CabinClass): string {
  const labels: Record<CabinClass, string> = {
    economy: "Economy",
    business: "Business",
    first: "First",
  };
  return labels[cabin];
}

export function passengerLabel(count: number): string {
  return count === 1 ? "1 Adult" : `${count} Adults`;
}
