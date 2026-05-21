"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { AuthModal } from "@/components/auth/AuthModal";
import { BookingProgress } from "@/components/booking/BookingProgress";
import { useFlightStore } from "@/store/useFlightStore";
import { useUserStore } from "@/store/useUserStore";
import type { FlightRow } from "@/types/database";

import { SeatContinueBar } from "./SeatContinueBar";
import { SeatFlightSummary } from "./SeatFlightSummary";
import { SeatMap } from "./SeatMap";

interface SeatSelectionPageProps {
  flight: FlightRow;
  flightId: string;
}

export function SeatSelectionPage({ flight, flightId }: SeatSelectionPageProps) {
  const pathname = usePathname();
  const session = useUserStore((s) => s.session);
  const selectedFlight = useFlightStore((s) => s.selectedFlight);
  const selectedSeat = useFlightStore((s) => s.selectedSeat);
  const setBookingStep = useFlightStore((s) => s.setBookingStep);

  const [authReady, setAuthReady] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const refreshSeatsRef = useRef<(() => void) | null>(null);

  const registerSeatRefresh = useCallback((refresh: () => void) => {
    refreshSeatsRef.current = refresh;
  }, []);

  const isLoggedIn = Boolean(session?.user);
  const seatForFlight =
    selectedSeat?.flight_id === flightId ? selectedSeat : null;

  useEffect(() => {
    setBookingStep(2);
  }, [setBookingStep]);

  useEffect(() => {
    const unsub = useUserStore.persist.onFinishHydration(() => {
      setAuthReady(true);
    });
    if (useUserStore.persist.hasHydrated()) {
      setAuthReady(true);
    }
    return unsub;
  }, []);

  useEffect(() => {
    if (!authReady) return;
    if (!isLoggedIn) {
      setAuthModalOpen(true);
    } else {
      setAuthModalOpen(false);
    }
  }, [authReady, isLoggedIn]);

  const resultsHref = selectedFlight
    ? `/flights?from=${selectedFlight.origin}&to=${selectedFlight.destination}&depart=${new Date(selectedFlight.departs_at).toISOString().slice(0, 10)}&trip=oneway&pax=1&class=${selectedFlight.cabinClass}`
    : "/flights";

  return (
    <>
      <main className="mx-auto flex max-w-7xl flex-1 flex-col gap-6 px-4 py-8 pb-28 sm:px-6 sm:py-10 sm:pb-28">
        <nav className="text-sm text-muted" aria-label="Breadcrumb">
          <Link href={resultsHref} className="hover:text-primary font-medium">
            Search
          </Link>
          <span className="mx-2" aria-hidden>
            →
          </span>
          <span className="text-foreground font-medium">Select seat</span>
          <span className="mx-2" aria-hidden>
            →
          </span>
          <span>Passenger</span>
          <span className="mx-2" aria-hidden>
            →
          </span>
          <span>Confirm</span>
        </nav>

        <BookingProgress currentStep={2} />

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
          <div className="min-w-0 flex-1">
            <header className="mb-4">
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Select your seat
              </h1>
              <p className="mt-1 text-sm text-muted">
                Choose an available seat for flight {flight.flight_no}.
              </p>
            </header>

            <div
              className={
                !isLoggedIn ? "pointer-events-none opacity-60" : undefined
              }
              aria-hidden={!isLoggedIn}
            >
              {!isLoggedIn ? (
                <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
                  <p className="text-sm font-medium text-muted">
                    Sign in to view and select seats
                  </p>
                </div>
              ) : (
                <SeatMap
                  flightId={flightId}
                  cabinClass={
                    selectedFlight?.id === flightId
                      ? selectedFlight.cabinClass
                      : "economy"
                  }
                  registerRefresh={registerSeatRefresh}
                />
              )}
            </div>
          </div>

          <div className="w-full shrink-0 lg:w-80">
            <SeatFlightSummary
              flight={flight}
              selectedFlight={
                selectedFlight?.id === flightId ? selectedFlight : null
              }
              selectedSeat={
                selectedSeat?.flight_id === flightId ? selectedSeat : null
              }
            />
          </div>
        </div>
      </main>

      {isLoggedIn ? (
        <SeatContinueBar
          flightId={flightId}
          selectedSeat={seatForFlight}
          disabled={!isLoggedIn}
          onReserveFailed={() => refreshSeatsRef.current?.()}
        />
      ) : null}

      <AuthModal
        open={authModalOpen}
        onClose={() => {
          if (isLoggedIn) setAuthModalOpen(false);
        }}
        redirectTo={pathname}
      />
    </>
  );
}
