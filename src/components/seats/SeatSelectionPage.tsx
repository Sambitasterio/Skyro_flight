"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { AuthModal } from "@/components/auth/AuthModal";
import { BookingProgress } from "@/components/booking/BookingProgress";
import { useFlightStore } from "@/store/useFlightStore";
import { useUserStore } from "@/store/useUserStore";
import type { FlightRow } from "@/types/database";

import { SeatFlightSummary } from "./SeatFlightSummary";

interface SeatSelectionPageProps {
  flight: FlightRow;
  flightId: string;
}

export function SeatSelectionPage({ flight, flightId }: SeatSelectionPageProps) {
  const pathname = usePathname();
  const session = useUserStore((s) => s.session);
  const selectedFlight = useFlightStore((s) => s.selectedFlight);
  const setBookingStep = useFlightStore((s) => s.setBookingStep);

  const [authReady, setAuthReady] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const isLoggedIn = Boolean(session?.user);

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
      <main className="mx-auto flex max-w-7xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6 sm:py-10">
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
              className={`relative rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center ${
                !isLoggedIn ? "pointer-events-none opacity-60" : ""
              }`}
              aria-hidden={!isLoggedIn}
            >
              {!isLoggedIn ? (
                <p className="text-sm font-medium text-muted">
                  Sign in to view and select seats
                </p>
              ) : (
                <>
                  <p className="text-lg font-semibold text-foreground">
                    Seat map coming next
                  </p>
                  <p className="mt-2 text-sm text-muted">
                    Seat map grid loads in the next step.
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="w-full shrink-0 lg:w-80">
            <SeatFlightSummary
              flight={flight}
              selectedFlight={
                selectedFlight?.id === flightId ? selectedFlight : null
              }
            />
          </div>
        </div>
      </main>

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
