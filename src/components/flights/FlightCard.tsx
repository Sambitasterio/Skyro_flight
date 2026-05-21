"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  cabinClassLabel,
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
  /** Cabin class from search URL (`class` param). */
  searchCabinClass: CabinClass;
  bestValue?: boolean;
}

export function FlightCard({
  flight,
  searchCabinClass,
  bestValue = false,
}: FlightCardProps) {
  const router = useRouter();
  const setSelectedFlight = useFlightStore((s) => s.setSelectedFlight);
  const setBookingStep = useFlightStore((s) => s.setBookingStep);
  const [cabin, setCabin] = useState<CabinClass>(searchCabinClass);

  useEffect(() => {
    setCabin(searchCabinClass);
  }, [searchCabinClass]);

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
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-sm transition hover:border-primary/30 hover:shadow-md">
      {bestValue ? (
        <div className="bg-amber-500 px-4 py-1 text-xs font-bold uppercase tracking-wide text-white">
          Best value · Non-stop
        </div>
      ) : null}
      <div className="flex flex-col gap-4 p-4 sm:p-5 lg:flex-row lg:items-stretch lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-lg text-primary"
              aria-hidden
            >
              ✈
            </span>
            <div>
              <p className="font-bold text-slate-900">Skyro Airlines</p>
              <p className="text-sm text-slate-500">
                {flight.flight_no} · {flight.aircraft_type}
              </p>
            </div>
            <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800">
              Non-stop
            </span>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-4 sm:gap-8">
            <div>
              <p className="text-xl font-bold tabular-nums text-slate-900 sm:text-2xl">
                {formatFlightTime(flight.departs_at)}
              </p>
              <p className="text-sm font-medium text-slate-600">{flight.origin}</p>
            </div>

            <div className="flex min-w-[7rem] flex-col items-center text-center">
              <p className="text-xs font-medium text-slate-500">{duration}</p>
              <div className="my-1.5 flex w-full max-w-[8rem] items-center gap-1.5">
                <span className="h-px flex-1 bg-slate-300" />
                <span className="text-primary text-sm" aria-hidden>
                  ✈
                </span>
                <span className="h-px flex-1 bg-slate-300" />
              </div>
              <p className="text-xs text-slate-500">Direct</p>
            </div>

            <div>
              <p className="text-xl font-bold tabular-nums text-slate-900 sm:text-2xl">
                {formatFlightTime(flight.arrives_at)}
              </p>
              <p className="text-sm font-medium text-slate-600">
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
              const fromSearch = tab.value === searchCabinClass;
              return (
                <button
                  key={tab.value}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setCabin(tab.value)}
                  className={`rounded-xl border px-3 py-2 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                    active
                      ? "border-primary bg-indigo-50 ring-1 ring-primary/30"
                      : "border-slate-200 bg-slate-50 hover:border-primary/30"
                  }`}
                >
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                    {tab.label}
                    {fromSearch ? (
                      <span className="rounded bg-primary/15 px-1 py-0.5 text-[10px] font-bold uppercase text-primary">
                        Search
                      </span>
                    ) : null}
                  </span>
                  <span className="block text-sm font-bold tabular-nums text-slate-900">
                    {formatInr(tabPrice)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-row items-center justify-between gap-4 border-t border-slate-100 pt-4 lg:w-44 lg:flex-col lg:items-end lg:justify-center lg:border-t-0 lg:border-l lg:pt-0 lg:pl-5">
          <div className="lg:text-right">
            <p className="text-2xl font-bold tabular-nums text-slate-900">
              {formatInr(displayPrice)}
            </p>
            <p className="text-xs text-slate-500">
              per adult · {cabinClassLabel(cabin)}
            </p>
          </div>
          <button
            type="button"
            onClick={handleSelect}
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-1 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-600 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Select
            <span aria-hidden>→</span>
          </button>
        </div>
      </div>

      <footer className="flex flex-wrap gap-x-3 gap-y-1 border-t border-slate-100 bg-slate-50 px-4 py-2.5 text-xs text-slate-600 sm:px-5">
        <span>Free cancellation</span>
        <span aria-hidden>·</span>
        <span>Meal</span>
        <span aria-hidden>·</span>
        <span>15 kg baggage</span>
      </footer>
    </article>
  );
}
