"use client";

import { useRouter } from "next/navigation";
import { useCallback, useId, useMemo, useState } from "react";

import { AIRPORTS, findAirport, resolveAirportInput } from "@/lib/airports";
import { buildFlightsSearchUrl } from "@/lib/search/build-flights-url";
import { useFlightStore } from "@/store/useFlightStore";
import type { CabinClass, TripType } from "@/types/flight";

const TRIP_TYPES: { value: TripType; label: string }[] = [
  { value: "oneway", label: "One Way" },
  { value: "round", label: "Round Trip" },
];

const CABIN_CLASSES: { value: CabinClass; label: string }[] = [
  { value: "economy", label: "Economy" },
  { value: "business", label: "Business" },
  { value: "first", label: "First" },
];

interface FlightSearchCardProps {
  className?: string;
}

export function FlightSearchCard({ className = "" }: FlightSearchCardProps) {
  const router = useRouter();
  const listId = useId();
  const storedQuery = useFlightStore((s) => s.searchQuery);
  const setSearchQuery = useFlightStore((s) => s.setSearchQuery);

  const [originInput, setOriginInput] = useState(storedQuery.origin);
  const [destInput, setDestInput] = useState(storedQuery.destination);
  const [departDate, setDepartDate] = useState(storedQuery.departDate);
  const [returnDate, setReturnDate] = useState(storedQuery.returnDate);
  const [tripType, setTripType] = useState<TripType>(storedQuery.tripType);
  const [passengerCount, setPassengerCount] = useState(
    storedQuery.passengerCount,
  );
  const [cabinClass, setCabinClass] = useState<CabinClass>(storedQuery.cabinClass);
  const [paxOpen, setPaxOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const originAirport = useMemo(
    () => findAirport(resolveAirportInput(originInput)),
    [originInput],
  );
  const destAirport = useMemo(
    () => findAirport(resolveAirportInput(destInput)),
    [destInput],
  );

  const swapLocations = useCallback(() => {
    setOriginInput(destInput);
    setDestInput(originInput);
  }, [originInput, destInput]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const origin = resolveAirportInput(originInput);
    const destination = resolveAirportInput(destInput);

    if (!origin || !destination) {
      setError("Enter valid origin and destination.");
      return;
    }
    if (origin === destination) {
      setError("Origin and destination must be different.");
      return;
    }
    if (!departDate) {
      setError("Select a departure date.");
      return;
    }
    if (tripType === "round") {
      if (!returnDate) {
        setError("Select a return date for round trip.");
        return;
      }
      if (returnDate < departDate) {
        setError("Return date must be on or after departure.");
        return;
      }
    }

    const query = {
      origin,
      destination,
      departDate,
      returnDate: tripType === "round" ? returnDate : "",
      passengerCount,
      cabinClass,
      tripType,
    };

    setSearchQuery(query);
    router.push(buildFlightsSearchUrl(query));
  };

  const paxLabel = `${passengerCount} Adult${passengerCount > 1 ? "s" : ""}, ${
    CABIN_CLASSES.find((c) => c.value === cabinClass)?.label ?? "Economy"
  }`;

  return (
    <form
      onSubmit={handleSubmit}
      className={`w-full max-w-5xl rounded-2xl bg-card shadow-2xl ring-1 ring-black/5 ${className}`}
    >
      {/* Trip type — EaseMyTrip-style pills inside card */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-4 sm:px-6">
        {TRIP_TYPES.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => setTripType(value)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              tripType === value
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-surface text-muted hover:text-foreground"
            }`}
          >
            {label}
          </button>
        ))}
        <span className="ml-auto hidden text-xs text-muted sm:inline">
          Search domestic & international routes
        </span>
      </div>

      {/* Main fields — Skyscanner / ixigo unified strip */}
      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.2fr)_auto_minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.1fr)]">
        <FieldBlock label="From" className="md:border-r md:border-border">
          <input
            type="text"
            list={listId}
            value={originInput}
            onChange={(e) => setOriginInput(e.target.value.toUpperCase())}
            placeholder="DEL"
            autoComplete="off"
            className="w-full bg-transparent text-xl font-bold text-foreground outline-none placeholder:text-muted-foreground/50"
            aria-label="Origin airport"
          />
          <Hint airport={originAirport} fallback="City or airport code" />
        </FieldBlock>

        <div className="flex items-center justify-center border-b border-border px-2 py-3 md:border-b-0 md:border-r md:border-border">
          <button
            type="button"
            onClick={swapLocations}
            aria-label="Swap origin and destination"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-primary transition hover:bg-primary/10 hover:rotate-180"
          >
            <SwapIcon />
          </button>
        </div>

        <FieldBlock label="To" className="md:border-r md:border-border">
          <input
            type="text"
            list={listId}
            value={destInput}
            onChange={(e) => setDestInput(e.target.value.toUpperCase())}
            placeholder="BOM"
            autoComplete="off"
            className="w-full bg-transparent text-xl font-bold text-foreground outline-none placeholder:text-muted-foreground/50"
            aria-label="Destination airport"
          />
          <Hint airport={destAirport} fallback="City or airport code" />
        </FieldBlock>

        <FieldBlock label="Depart" className="md:border-r md:border-border">
          <input
            type="date"
            value={departDate}
            min={new Date().toISOString().slice(0, 10)}
            onChange={(e) => setDepartDate(e.target.value)}
            className="w-full bg-transparent text-lg font-bold text-foreground outline-none [color-scheme:light] dark:[color-scheme:dark]"
            aria-label="Departure date"
          />
          <span className="text-xs text-muted">
            {departDate ? formatDay(departDate) : "Add date"}
          </span>
        </FieldBlock>

        <FieldBlock
          label="Return"
          className={`md:border-r md:border-border ${
            tripType === "oneway" ? "opacity-50" : ""
          }`}
        >
          <input
            type="date"
            value={returnDate}
            min={departDate || new Date().toISOString().slice(0, 10)}
            disabled={tripType === "oneway"}
            onChange={(e) => setReturnDate(e.target.value)}
            className="w-full bg-transparent text-lg font-bold text-foreground outline-none disabled:cursor-not-allowed [color-scheme:light] dark:[color-scheme:dark]"
            aria-label="Return date"
          />
          <span className="text-xs text-muted">
            {tripType === "oneway"
              ? "One way only"
              : returnDate
                ? formatDay(returnDate)
                : "Add return"}
          </span>
        </FieldBlock>

        <FieldBlock label="Travellers & class" className="relative">
          <button
            type="button"
            onClick={() => setPaxOpen((o) => !o)}
            className="w-full text-left"
            aria-expanded={paxOpen}
            aria-haspopup="listbox"
          >
            <span className="block text-lg font-bold text-foreground">
              {passengerCount} Traveller{passengerCount > 1 ? "s" : ""}
            </span>
            <span className="text-xs text-muted">{paxLabel}</span>
          </button>

          {paxOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                aria-hidden
                onClick={() => setPaxOpen(false)}
              />
              <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-xl border border-border bg-card p-4 shadow-xl">
                <label className="mb-2 block text-xs font-medium text-muted">
                  Adults
                </label>
                <select
                  value={passengerCount}
                  onChange={(e) =>
                    setPassengerCount(Number(e.target.value))
                  }
                  className="mb-4 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
                >
                  {Array.from({ length: 9 }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      {n} Adult{n > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
                <label className="mb-2 block text-xs font-medium text-muted">
                  Cabin class
                </label>
                <select
                  value={cabinClass}
                  onChange={(e) =>
                    setCabinClass(e.target.value as CabinClass)
                  }
                  className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
                >
                  {CABIN_CLASSES.map(({ value, label }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
        </FieldBlock>
      </div>

      <datalist id={listId}>
        {AIRPORTS.map((a) => (
          <option key={a.code} value={a.code}>
            {a.city}
          </option>
        ))}
      </datalist>

      {error && (
        <p className="px-4 pb-2 text-sm text-red-600 sm:px-6" role="alert">
          {error}
        </p>
      )}

      {/* CTA — indigo gradient Search */}
      <div className="border-t border-border px-4 py-4 sm:px-6 sm:py-5">
        <button
          type="submit"
          className="w-full rounded-xl bg-gradient-to-r from-primary to-accent px-6 py-4 text-base font-bold text-primary-foreground shadow-lg transition hover:opacity-95 active:scale-[0.99] sm:text-lg"
        >
          Search flights
        </button>
      </div>
    </form>
  );
}

function FieldBlock({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`border-b border-border px-4 py-4 last:border-b-0 sm:px-5 ${className}`}
    >
      <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-muted">
        {label}
      </span>
      {children}
    </div>
  );
}

function Hint({
  airport,
  fallback,
}: {
  airport: ReturnType<typeof findAirport>;
  fallback: string;
}) {
  if (airport) {
    return (
      <p className="mt-0.5 truncate text-xs text-muted">
        {airport.code}, {airport.name}
      </p>
    );
  }
  return <p className="mt-0.5 text-xs text-muted">{fallback}</p>;
}

function formatDay(isoDate: string): string {
  try {
    return new Date(isoDate + "T12:00:00").toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  } catch {
    return "";
  }
}

function SwapIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="M7 16V4M7 4 3 8M7 4l4 4M17 8v12M17 20l4-4M17 20l-4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
