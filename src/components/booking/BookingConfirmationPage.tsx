"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { BookingProgress } from "@/components/booking/BookingProgress";
import { CopyPnrButton } from "@/components/booking/CopyPnrButton";
import { formatStoredDocument } from "@/lib/booking/format-document";
import type { BookingConfirmationData } from "@/lib/booking/get-booking-by-pnr";
import {
  airportLabel,
  cabinClassLabel,
  formatDuration,
  formatFlightDate,
  formatFlightTime,
  formatInr,
} from "@/lib/flights/format";
import { useFlightStore } from "@/store/useFlightStore";

interface BookingConfirmationPageProps {
  booking: BookingConfirmationData;
}

function formatBookedAt(iso: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(iso));
}

export function BookingConfirmationPage({
  booking,
}: BookingConfirmationPageProps) {
  const router = useRouter();
  const setBookingStep = useFlightStore((s) => s.setBookingStep);
  const resetBooking = useFlightStore((s) => s.resetBooking);

  const doc = formatStoredDocument(booking.passenger.passport_no);

  useEffect(() => {
    setBookingStep(4);
  }, [setBookingStep]);

  const handleLeave = (href: string) => {
    resetBooking();
    router.push(href);
  };

  return (
    <main className="mx-auto flex max-w-3xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6 sm:py-10">
      <nav className="text-sm text-muted" aria-label="Breadcrumb">
        <span className="text-foreground font-medium">Booking confirmed</span>
      </nav>

      <BookingProgress currentStep={4} />

      <header className="text-center">
        <div
          className="confirmation-check mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20"
          aria-hidden
        >
          <svg
            className="h-8 w-8 text-emerald-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path
              className="confirmation-check-path"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          You&apos;re all set!
        </h1>
        <p className="mt-2 text-sm text-muted">
          Booking confirmed · {formatBookedAt(booking.booked_at)}
        </p>
      </header>

      <section className="rounded-2xl border border-primary/30 bg-primary/5 p-5 text-center sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted">
          Booking reference (PNR)
        </p>
        <p className="mt-2 font-mono text-4xl font-bold tracking-wider text-primary sm:text-5xl">
          {booking.pnr_code}
        </p>
        <div className="mt-4 flex justify-center">
          <CopyPnrButton pnr={booking.pnr_code} />
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-5">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">
            Flight
          </h2>
          <p className="mt-2 text-lg font-bold text-foreground">
            {airportLabel(booking.flight.origin)} →{" "}
            {airportLabel(booking.flight.destination)}
          </p>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between gap-2">
              <dt className="text-muted">Date</dt>
              <dd className="font-medium text-foreground">
                {formatFlightDate(booking.flight.departs_at)}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted">Departure</dt>
              <dd className="font-medium tabular-nums text-foreground">
                {formatFlightTime(booking.flight.departs_at)}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted">Arrival</dt>
              <dd className="font-medium tabular-nums text-foreground">
                {formatFlightTime(booking.flight.arrives_at)}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted">Duration</dt>
              <dd className="font-medium text-foreground">
                {formatDuration(
                  booking.flight.departs_at,
                  booking.flight.arrives_at,
                )}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted">Flight</dt>
              <dd className="font-medium text-foreground">
                {booking.flight.flight_no}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted">Aircraft</dt>
              <dd className="font-medium text-foreground">
                {booking.flight.aircraft_type}
              </dd>
            </div>
          </dl>
        </section>

        <section className="flex flex-col gap-4">
          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">
              Seat
            </h2>
            <p className="mt-2 text-3xl font-bold text-foreground">
              {booking.seat.seat_number}
            </p>
            <span className="mt-2 inline-block rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
              {cabinClassLabel(booking.seat.class)}
            </span>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">
              Passenger
            </h2>
            <p className="mt-2 font-semibold text-foreground">
              {booking.passenger.full_name}
            </p>
            <dl className="mt-3 space-y-1.5 text-sm">
              <div className="flex justify-between gap-2">
                <dt className="text-muted">Nationality</dt>
                <dd className="text-foreground">
                  {booking.passenger.nationality}
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-muted">{doc.typeLabel}</dt>
                <dd className="font-mono text-foreground">{doc.maskedNumber}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-muted">Date of birth</dt>
                <dd className="text-foreground">
                  {new Intl.DateTimeFormat("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  }).format(new Date(booking.passenger.dob))}
                </dd>
              </div>
            </dl>
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Total paid
            </p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-primary">
              {formatInr(booking.total_price)}
            </p>
          </div>
          <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold uppercase text-emerald-400">
            {booking.status}
          </span>
        </div>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button
          type="button"
          onClick={() => handleLeave("/bookings")}
          className="bg-primary text-primary-foreground rounded-xl px-6 py-3 text-sm font-bold shadow-md transition hover:opacity-95"
        >
          View My Bookings
        </button>
        <button
          type="button"
          onClick={() => handleLeave("/")}
          className="rounded-xl border border-border bg-card px-6 py-3 text-sm font-bold text-foreground transition hover:border-primary/40"
        >
          Search another flight
        </button>
      </div>

      <p className="text-center text-xs text-muted">
        Save your PNR — you&apos;ll need it at check-in.
      </p>
    </main>
  );
}
