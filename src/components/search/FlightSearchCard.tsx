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

const INTERACTIVE =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

interface FlightSearchCardProps {
  className?: string;
}

export function FlightSearchCard({ className = "" }: FlightSearchCardProps) {
  const router = useRouter();
  const formId = useId();
  const listId = useId();
  const originId = `${formId}-origin`;
  const destId = `${formId}-destination`;
  const departId = `${formId}-depart`;
  const returnId = `${formId}-return`;
  const paxId = `${formId}-pax`;
  const errorId = `${formId}-error`;

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
      aria-label="Flight search"
      aria-describedby={error ? errorId : undefined}
      className={`w-full max-w-5xl rounded-2xl bg-white text-slate-900 shadow-2xl ring-1 ring-white/20 ${className}`}
    >
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 px-4 py-4 sm:px-6">
        <div
          role="radiogroup"
          aria-label="Trip type"
          className="flex flex-wrap gap-2"
        >
          {TRIP_TYPES.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={tripType === value}
              onClick={() => setTripType(value)}
              className={`min-h-11 rounded-full px-4 py-2.5 text-sm font-semibold transition ${INTERACTIVE} ${
                tripType === value
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:text-slate-900"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <span className="ml-auto hidden text-xs text-slate-500 sm:inline">
          Search domestic & international routes
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.2fr)_auto_minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.1fr)]">
        <FieldBlock label="From" htmlFor={originId} className="md:border-r md:border-slate-200">
          <input
            id={originId}
            type="text"
            list={listId}
            value={originInput}
            onChange={(e) => setOriginInput(e.target.value.toUpperCase())}
            placeholder="DEL"
            autoComplete="off"
            className={`search-field w-full min-h-11 bg-transparent text-xl font-bold text-slate-900 placeholder:text-slate-400 ${INTERACTIVE}`}
          />
          <Hint airport={originAirport} fallback="City or airport code" />
        </FieldBlock>

        <div className="flex min-h-[3.5rem] items-center justify-center border-b border-slate-200 px-2 py-3 md:border-b-0 md:border-r md:border-slate-200">
          <button
            type="button"
            onClick={swapLocations}
            aria-label="Swap origin and destination"
            className={`flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-primary transition hover:bg-indigo-50 active:rotate-180 ${INTERACTIVE}`}
          >
            <SwapIcon />
          </button>
        </div>

        <FieldBlock label="To" htmlFor={destId} className="md:border-r md:border-slate-200">
          <input
            id={destId}
            type="text"
            list={listId}
            value={destInput}
            onChange={(e) => setDestInput(e.target.value.toUpperCase())}
            placeholder="BOM"
            autoComplete="off"
            className={`search-field w-full min-h-11 bg-transparent text-xl font-bold text-slate-900 placeholder:text-slate-400 ${INTERACTIVE}`}
          />
          <Hint airport={destAirport} fallback="City or airport code" />
        </FieldBlock>

        <FieldBlock label="Depart" htmlFor={departId} className="md:border-r md:border-slate-200">
          <input
            id={departId}
            type="date"
            value={departDate}
            min={new Date().toISOString().slice(0, 10)}
            onChange={(e) => setDepartDate(e.target.value)}
            className={`search-field w-full min-h-11 bg-transparent text-lg font-bold text-slate-900 [color-scheme:light] ${INTERACTIVE}`}
          />
          <span className="text-xs text-slate-500">
            {departDate ? formatDay(departDate) : "Add date"}
          </span>
        </FieldBlock>

        <FieldBlock
          label="Return"
          htmlFor={returnId}
          className={`md:border-r md:border-slate-200 ${
            tripType === "oneway" ? "opacity-50" : ""
          }`}
        >
          <input
            id={returnId}
            type="date"
            value={returnDate}
            min={departDate || new Date().toISOString().slice(0, 10)}
            disabled={tripType === "oneway"}
            onChange={(e) => setReturnDate(e.target.value)}
            aria-disabled={tripType === "oneway"}
            className={`search-field w-full min-h-11 bg-transparent text-lg font-bold text-slate-900 [color-scheme:light] disabled:cursor-not-allowed ${INTERACTIVE}`}
          />
          <span className="text-xs text-slate-500">
            {tripType === "oneway"
              ? "One way only"
              : returnDate
                ? formatDay(returnDate)
                : "Add return"}
          </span>
        </FieldBlock>

        <FieldBlock label="Travellers & class" htmlFor={paxId} className="relative">
          <button
            id={paxId}
            type="button"
            onClick={() => setPaxOpen((o) => !o)}
            className={`w-full min-h-11 text-left ${INTERACTIVE}`}
            aria-expanded={paxOpen}
            aria-haspopup="dialog"
            aria-controls={`${formId}-pax-panel`}
          >
            <span className="block text-lg font-bold text-slate-900">
              {passengerCount} Traveller{passengerCount > 1 ? "s" : ""}
            </span>
            <span className="text-xs text-slate-500">{paxLabel}</span>
          </button>

          {paxOpen && (
            <>
              <div
                className="fixed inset-0 z-40 bg-black/40 md:bg-transparent"
                aria-hidden
                onClick={() => setPaxOpen(false)}
              />
              <div
                id={`${formId}-pax-panel`}
                role="dialog"
                aria-label="Travellers and cabin class"
                className="fixed inset-x-0 bottom-0 z-50 max-h-[70vh] overflow-y-auto rounded-t-2xl border border-slate-200 bg-white p-5 shadow-2xl md:absolute md:inset-x-0 md:bottom-auto md:left-0 md:right-0 md:top-full md:mt-2 md:max-h-none md:rounded-xl md:p-4"
              >
                <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-slate-200 md:hidden" />
                <PaxFields
                  passengerCount={passengerCount}
                  cabinClass={cabinClass}
                  onPassengerChange={setPassengerCount}
                  onClassChange={setCabinClass}
                />
                <button
                  type="button"
                  className={`mt-4 w-full min-h-11 rounded-xl bg-primary text-sm font-semibold text-primary-foreground md:hidden ${INTERACTIVE}`}
                  onClick={() => setPaxOpen(false)}
                >
                  Done
                </button>
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
        <p
          id={errorId}
          className="px-4 pb-2 text-sm text-red-600 sm:px-6"
          role="alert"
        >
          {error}
        </p>
      )}

      <div className="border-t border-slate-200 px-4 py-4 sm:px-6 sm:py-5">
        <button
          type="submit"
          className={`w-full min-h-[3rem] rounded-xl bg-gradient-to-r from-primary to-accent px-6 py-4 text-base font-bold text-primary-foreground shadow-lg transition hover:opacity-95 active:scale-[0.99] sm:min-h-[3.25rem] sm:text-lg ${INTERACTIVE}`}
        >
          Search flights
        </button>
      </div>
    </form>
  );
}

function PaxFields({
  passengerCount,
  cabinClass,
  onPassengerChange,
  onClassChange,
}: {
  passengerCount: number;
  cabinClass: CabinClass;
  onPassengerChange: (n: number) => void;
  onClassChange: (c: CabinClass) => void;
}) {
  const adultsId = useId();
  const classId = useId();

  return (
    <>
      <label htmlFor={adultsId} className="mb-2 block text-xs font-medium text-slate-500">
        Adults
      </label>
      <select
        id={adultsId}
        value={passengerCount}
        onChange={(e) => onPassengerChange(Number(e.target.value))}
        className={`mb-4 w-full min-h-11 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 ${INTERACTIVE}`}
      >
        {Array.from({ length: 9 }, (_, i) => i + 1).map((n) => (
          <option key={n} value={n}>
            {n} Adult{n > 1 ? "s" : ""}
          </option>
        ))}
      </select>
      <label htmlFor={classId} className="mb-2 block text-xs font-medium text-slate-500">
        Cabin class
      </label>
      <select
        id={classId}
        value={cabinClass}
        onChange={(e) => onClassChange(e.target.value as CabinClass)}
        className={`w-full min-h-11 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 ${INTERACTIVE}`}
      >
        {CABIN_CLASSES.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </>
  );
}

function FieldBlock({
  label,
  htmlFor,
  children,
  className = "",
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`border-b border-slate-200 px-4 py-4 last:border-b-0 sm:px-5 ${className}`}
    >
      <label
        htmlFor={htmlFor}
        className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500"
      >
        {label}
      </label>
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
      <p className="mt-0.5 truncate text-xs text-slate-500">
        {airport.code}, {airport.name}
      </p>
    );
  }
  return <p className="mt-0.5 text-xs text-slate-500">{fallback}</p>;
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
