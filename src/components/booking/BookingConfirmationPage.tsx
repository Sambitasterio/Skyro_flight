"use client";

import Link from "next/link";
import { useEffect } from "react";

import { BookingProgress } from "@/components/booking/BookingProgress";
import { formatInr } from "@/lib/flights/format";
import { useFlightStore } from "@/store/useFlightStore";
import type { BookingConfirmationData } from "@/lib/booking/get-booking-by-pnr";

interface BookingConfirmationPageProps {
  booking: BookingConfirmationData;
}

/** Confirmation shell — full polish in Phase 6.4. */
export function BookingConfirmationPage({
  booking,
}: BookingConfirmationPageProps) {
  const setBookingStep = useFlightStore((s) => s.setBookingStep);

  useEffect(() => {
    setBookingStep(4);
  }, [setBookingStep]);

  return (
    <main className="mx-auto flex max-w-lg flex-1 flex-col gap-6 px-4 py-10 sm:px-6">
      <BookingProgress currentStep={4} />

      <div className="rounded-2xl border border-border bg-card p-6 text-center">
        <div
          className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-2xl text-emerald-400"
          aria-hidden
        >
          ✓
        </div>
        <p className="text-sm font-semibold uppercase tracking-wide text-muted">
          Booking confirmed
        </p>
        <p className="mt-2 font-mono text-3xl font-bold tracking-wide text-primary">
          {booking.pnr_code}
        </p>
        <p className="mt-3 text-sm text-foreground">
          {booking.passenger.full_name}
        </p>
        <p className="mt-1 text-sm text-muted">
          {booking.flight.flight_no} · Seat {booking.seat.seat_number} ·{" "}
          {formatInr(booking.total_price)}
        </p>
        <p className="mt-4 text-xs text-muted">
          Full confirmation UI ships in Phase 6.4.
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link
            href="/bookings"
            className="bg-primary text-primary-foreground rounded-xl px-5 py-2.5 text-sm font-bold"
          >
            View My Bookings
          </Link>
          <Link
            href="/"
            className="rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-foreground hover:border-primary/40"
          >
            Search another flight
          </Link>
        </div>
      </div>
    </main>
  );
}
