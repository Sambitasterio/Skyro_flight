"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  formatDuration,
  formatFlightTime,
  formatInr,
} from "@/lib/flights/format";
import { priceForCabin } from "@/lib/flights/pricing";
import { useFlightStore } from "@/store/useFlightStore";
import type { CabinClass, SelectedFlight } from "@/types/flight";
import type { FlightRow } from "@/types/database";

const CABIN_TABS: { value: CabinClass; label: string }[] = [
  { value: "economy", label: "Economy" },
  { value: "business", label: "Business" },
  { value: "first", label: "First" },
];

interface FlightCardProps {
  flight: FlightRow;
  /** Cabin from search URL — initial tab selection. */
  defaultCabin: CabinClass;
}

export function FlightCard({ flight, defaultCabin }: FlightCardProps) {
  const router = useRouter();
  const setSelectedFlight = useFlightStore((s) => s.setSelectedFlight);
  const setBookingStep = useFlightStore((s) => s.setBookingStep);
  const [cabin, setCabin] = useState<CabinClass>(defaultCabin);

  const basePrice = Number(flight.base_price);
  const displayPrice = priceForCabin(basePrice, cabin);
  const duration = formatDuration(flight.departs_at, flight.arrives_at);

  const handleSelect = () => {
    const selected: SelectedFlight = {
      id: flight.id,
      flight_no: flight.flight_no,
      origin: flight.origin,
      destination: flight.destination,
      departs_at: flight.departs_at,
      arrives_at: flight.arrives_at,
      aircraft_type: flight.aircraft_type,
      base_price: basePrice,
      cabinClass: cabin,
      displayPrice,
    };
    setSelectedFlight(selected);
    setBookingStep(2);
    router.push(`/flights/${flight.id}/seats`);
  };

  return (
    <article className="rounded-2xl border border-border bg-card transition hover:border-primary/40 hover:shadow-md hover:shadow-primary/5">
      <div className="flex flex-col gap-4 p-4 sm:p-5 lg:flex-row lg:items-stretch lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-lg"
              aria-hidden
            >
              ✈
            </span>
            <div>
              <p className="font-bold text-foreground">Skyro Airlines</p>
              <p className="text-sm text-muted">
                {flight.flight_no} · {flight.aircraft_type}
              </p>
            </div>
            <span className="rounded-md bg-emerald-500/15 px-2 py-0.5 text-xs font-semibold text-emerald-400">
              Non-stop
            </span>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-4 sm:gap-8">
            <div>
              <p className="text-xl font-bold tabular-nums text-foreground sm:text-2xl">
                {formatFlightTime(flight.departs_at)}
              </p>
              <p className="text-sm font-medium text-muted">{flight.origin}</p>
            </div>

            <div className="flex min-w-[7rem] flex-col items-center text-center">
              <p className="text-xs font-medium text-muted">{duration}</p>
              <div className="my-1.5 flex w-full max-w-[8rem] items-center gap-1.5">
                <span className="h-px flex-1 bg-border" />
                <span className="text-primary text-sm" aria-hidden>
                  ✈
                </span>
                <span className="h-px flex-1 bg-border" />
              </div>
              <p className="text-xs text-muted">Direct</p>
            </div>

            <div>
              <p className="text-xl font-bold tabular-nums text-foreground sm:text-2xl">
                {formatFlightTime(flight.arrives_at)}
              </p>
              <p className="text-sm font-medium text-muted">
                {flight.destination}
              </p>
            </div>
          </div>

          <div
            className="mt-4 flex flex-wrap gap-2"
            role="tablist"
            aria-label="Cabin class and fare"
          >
            {CABIN_TABS.map((tab) => {
              const tabPrice = priceForCabin(basePrice, tab.value);
              const active = cabin === tab.value;
              return (
                <button
                  key={tab.value}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setCabin(tab.value)}
                  className={`rounded-xl border px-3 py-2 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
                    active
                      ? "border-primary bg-primary/10 ring-1 ring-primary/30"
                      : "border-border bg-background/50 hover:border-primary/30"
                  }`}
                >
                  <span className="block text-xs font-semibold text-muted">
                    {tab.label}
                  </span>
                  <span className="block text-sm font-bold tabular-nums text-foreground">
                    {formatInr(tabPrice)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-row items-center justify-between gap-4 border-t border-border pt-4 lg:w-44 lg:flex-col lg:items-end lg:justify-center lg:border-t-0 lg:border-l lg:pt-0 lg:pl-5">
          <div className="lg:text-right">
            <p className="text-2xl font-bold tabular-nums text-primary">
              {formatInr(displayPrice)}
            </p>
            <p className="text-xs text-muted">per adult · {cabin}</p>
          </div>
          <button
            type="button"
            onClick={handleSelect}
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-1 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-sm transition hover:opacity-95 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Select
            <span aria-hidden>→</span>
          </button>
        </div>
      </div>

      <footer className="flex flex-wrap gap-x-3 gap-y-1 border-t border-border px-4 py-2.5 text-xs text-muted sm:px-5">
        <span>Free cancellation</span>
        <span aria-hidden>·</span>
        <span>Meal</span>
        <span aria-hidden>·</span>
        <span>15 kg baggage</span>
      </footer>
    </article>
  );
}
