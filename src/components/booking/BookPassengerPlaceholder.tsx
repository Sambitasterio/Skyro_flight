"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { BookingProgress } from "@/components/booking/BookingProgress";
import { useFlightStore } from "@/store/useFlightStore";

interface BookPassengerPlaceholderProps {
  flightId: string;
}

/** Minimal shell until Phase 6 passenger form ships. */
export function BookPassengerPlaceholder({ flightId }: BookPassengerPlaceholderProps) {
  const router = useRouter();
  const activeBooking = useFlightStore((s) => s.activeBooking);
  const selectedSeat = useFlightStore((s) => s.selectedSeat);
  const setBookingStep = useFlightStore((s) => s.setBookingStep);

  useEffect(() => {
    setBookingStep(3);
  }, [setBookingStep]);

  useEffect(() => {
    if (!activeBooking || activeBooking.flight_id !== flightId) {
      router.replace(`/flights/${flightId}/seats`);
    }
  }, [activeBooking, flightId, router]);

  if (!activeBooking || activeBooking.flight_id !== flightId) {
    return null;
  }

  return (
    <main className="mx-auto flex max-w-lg flex-1 flex-col gap-6 px-4 py-10 sm:px-6">
      <BookingProgress currentStep={3} />
      <div className="rounded-2xl border border-border bg-card p-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-muted">
          Seat reserved
        </p>
        <p className="mt-2 font-mono text-2xl font-bold text-primary">
          {activeBooking.pnr_code}
        </p>
        {selectedSeat ? (
          <p className="mt-2 text-sm text-muted">
            Seat {selectedSeat.seat_number} locked for this booking.
          </p>
        ) : null}
        <p className="mt-4 text-sm text-muted">
          Passenger details form ships in Phase 6.
        </p>
        <Link
          href="/flights"
          className="text-primary mt-6 inline-block text-sm font-semibold hover:underline"
        >
          ← Search flights
        </Link>
      </div>
    </main>
  );
}
