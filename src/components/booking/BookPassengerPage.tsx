"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { BookingProgress } from "@/components/booking/BookingProgress";
import { BookingSummarySidebar } from "@/components/booking/BookingSummarySidebar";
import { PassengerForm } from "@/components/booking/PassengerForm";
import { useFlightStore } from "@/store/useFlightStore";
import type { FlightRow } from "@/types/database";

interface BookPassengerPageProps {
  flight: FlightRow;
  flightId: string;
}

export function BookPassengerPage({ flight, flightId }: BookPassengerPageProps) {
  const router = useRouter();
  const activeBooking = useFlightStore((s) => s.activeBooking);
  const selectedFlight = useFlightStore((s) => s.selectedFlight);
  const selectedSeat = useFlightStore((s) => s.selectedSeat);
  const setBookingStep = useFlightStore((s) => s.setBookingStep);

  const [storeReady, setStoreReady] = useState(false);

  useEffect(() => {
    const unsub = useFlightStore.persist.onFinishHydration(() => {
      setStoreReady(true);
    });
    if (useFlightStore.persist.hasHydrated()) {
      setStoreReady(true);
    }
    return unsub;
  }, []);

  useEffect(() => {
    setBookingStep(3);
  }, [setBookingStep]);

  useEffect(() => {
    if (!storeReady) return;

    const bookingOk =
      activeBooking !== null && activeBooking.flight_id === flightId;
    const seatOk =
      selectedSeat !== null && selectedSeat.flight_id === flightId;

    if (!bookingOk && !seatOk) {
      router.replace(`/flights/${flightId}/seats`);
    } else if (!bookingOk && seatOk) {
      router.replace(`/flights/${flightId}/seats`);
    }
  }, [storeReady, activeBooking, selectedSeat, flightId, router]);

  const flightSelected =
    selectedFlight?.id === flightId ? selectedFlight : null;
  const seatForFlight =
    selectedSeat?.flight_id === flightId ? selectedSeat : null;

  const resultsHref = flightSelected
    ? `/flights?from=${flightSelected.origin}&to=${flightSelected.destination}&depart=${new Date(flightSelected.departs_at).toISOString().slice(0, 10)}&trip=oneway&pax=1&class=${flightSelected.cabinClass}`
    : `/flights?from=${flight.origin}&to=${flight.destination}`;

  if (
    !storeReady ||
    !activeBooking ||
    activeBooking.flight_id !== flightId
  ) {
    return (
      <main className="mx-auto max-w-7xl flex-1 px-4 py-16 sm:px-6">
        <p className="text-center text-sm text-muted">Loading booking…</p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex max-w-7xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6 sm:py-10">
      <nav className="text-sm text-muted" aria-label="Breadcrumb">
        <Link href={resultsHref} className="hover:text-primary font-medium">
          Search
        </Link>
        <span className="mx-2" aria-hidden>
          →
        </span>
        <Link
          href={`/flights/${flightId}/seats`}
          className="hover:text-primary font-medium"
        >
          Select seat
        </Link>
        <span className="mx-2" aria-hidden>
          →
        </span>
        <span className="text-foreground font-medium">Passenger</span>
        <span className="mx-2" aria-hidden>
          →
        </span>
        <span>Confirm</span>
      </nav>

      <BookingProgress currentStep={3} />

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
        <div className="min-w-0 flex-1">
          <header className="mb-4">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Passenger details
            </h1>
            <p className="mt-1 text-sm text-muted">
              Step 3 of 4 — enter traveller information for PNR{" "}
              <span className="font-mono font-semibold text-primary">
                {activeBooking.pnr_code}
              </span>
            </p>
          </header>

          <PassengerForm flightId={flightId} />
        </div>

        <div className="w-full shrink-0 lg:w-80">
          <BookingSummarySidebar
            flight={flight}
            selectedFlight={flightSelected}
            selectedSeat={seatForFlight}
            activeBooking={activeBooking}
          />
        </div>
      </div>
    </main>
  );
}
