"use client";

import Link from "next/link";

import { BookingStatusBadge } from "@/components/bookings/BookingStatusBadge";
import { RescheduleHistory } from "@/components/bookings/RescheduleHistory";
import { CopyPnrButton } from "@/components/booking/CopyPnrButton";
import { formatStoredDocument } from "@/lib/booking/format-document";
import { isWithinCancellationWindow } from "@/lib/bookings/booking-filters";
import { formatBookedAt } from "@/lib/bookings/format-booking";
import type { BookingDetailData } from "@/lib/bookings/load-booking-by-id";
import {
  airportLabel,
  cabinClassLabel,
  formatDuration,
  formatFlightDate,
  formatFlightTime,
  formatInr,
} from "@/lib/flights/format";

interface BookingDetailPageProps {
  booking: BookingDetailData;
}

export function BookingDetailPage({ booking }: BookingDetailPageProps) {
  const { flight, seat, passenger } = booking;
  const doc = formatStoredDocument(passenger.passport_no);
  const duration = formatDuration(flight.departs_at, flight.arrives_at);
  const cancelBlocked =
    booking.status !== "cancelled" &&
    isWithinCancellationWindow(flight.departs_at);
  const isUpcoming =
    booking.status !== "cancelled" &&
    new Date(flight.departs_at).getTime() > Date.now();

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6 sm:py-10">
      <Link
        href="/bookings"
        className="text-primary inline-flex w-fit items-center gap-1 text-sm font-semibold hover:underline"
      >
        ← Back to My Bookings
      </Link>

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Booking details
          </p>
          <p className="mt-1 font-mono text-3xl font-bold tracking-wide text-primary sm:text-4xl">
            {booking.pnr_code}
          </p>
          <p className="mt-2 text-sm text-muted">
            Booked {formatBookedAt(booking.booked_at)}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <BookingStatusBadge status={booking.status} />
          <CopyPnrButton pnr={booking.pnr_code} />
        </div>
      </header>

      {/* Itinerary — horizontal on md+ */}
      <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">
          Itinerary
        </h2>
        <p className="mt-2 text-xl font-bold text-foreground">
          {airportLabel(flight.origin)} → {airportLabel(flight.destination)}
        </p>
        <p className="mt-1 text-sm text-muted">
          {formatFlightDate(flight.departs_at)} · {flight.flight_no} ·{" "}
          {flight.aircraft_type}
        </p>

        <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-8">
          <div className="flex items-center justify-center gap-4 md:gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold tabular-nums text-foreground">
                {formatFlightTime(flight.departs_at)}
              </p>
              <p className="text-xs font-medium text-muted">{flight.origin}</p>
            </div>
            <div className="flex flex-col items-center gap-1 px-2">
              <span className="text-xs text-muted">{duration}</span>
              <span
                className="h-px w-16 bg-gradient-to-r from-transparent via-border to-transparent sm:w-24"
                aria-hidden
              />
              <span className="text-primary" aria-hidden>
                ✈
              </span>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold tabular-nums text-foreground">
                {formatFlightTime(flight.arrives_at)}
              </p>
              <p className="text-xs font-medium text-muted">
                {flight.destination}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 border-t border-border pt-4 md:border-t-0 md:border-l md:pt-0 md:pl-8">
            <div>
              <p className="text-xs text-muted">Seat</p>
              <p className="text-lg font-bold text-foreground">
                {seat.seat_number}
              </p>
              <span className="mt-1 inline-block rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-semibold text-primary">
                {cabinClassLabel(seat.class)}
              </span>
            </div>
            <div>
              <p className="text-xs text-muted">Total paid</p>
              <p className="text-2xl font-bold tabular-nums text-primary">
                {formatInr(booking.total_price)}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-5">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">
            Passenger
          </h2>
          <p className="mt-2 text-lg font-semibold text-foreground">
            {passenger.full_name}
          </p>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Nationality</dt>
              <dd className="font-medium text-foreground">
                {passenger.nationality}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">{doc.typeLabel}</dt>
              <dd className="font-mono text-foreground">{doc.maskedNumber}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Date of birth</dt>
              <dd className="font-medium text-foreground">
                {new Intl.DateTimeFormat("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                }).format(new Date(passenger.dob))}
              </dd>
            </div>
          </dl>
        </section>

        <section className="rounded-2xl border border-dashed border-border bg-card/50 p-5">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">
            Manage booking
          </h2>
          <p className="mt-2 text-sm text-muted">
            Reschedule and cancel ship in Phase 7.3–7.4.
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              disabled={!isUpcoming || booking.status === "cancelled"}
              title={
                !isUpcoming ? "Past flights cannot be rescheduled" : undefined
              }
              className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition enabled:hover:border-primary/50 enabled:hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
            >
              Reschedule
            </button>
            <button
              type="button"
              disabled={
                booking.status === "cancelled" || cancelBlocked || !isUpcoming
              }
              title={
                cancelBlocked
                  ? "Cannot cancel within 2 hours of departure"
                  : undefined
              }
              className="rounded-xl border border-red-500/30 px-4 py-2.5 text-sm font-semibold text-red-400 transition enabled:hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Cancel booking
            </button>
          </div>
          {cancelBlocked && booking.status !== "cancelled" ? (
            <p className="mt-3 text-xs text-amber-400">
              Cancellation is not allowed within 2 hours of departure.
            </p>
          ) : null}
        </section>
      </div>

      <RescheduleHistory items={booking.reschedules} />

      <div className="flex flex-wrap gap-3">
        <Link
          href={`/booking/${booking.pnr_code}`}
          className="text-primary text-sm font-semibold hover:underline"
        >
          View confirmation page →
        </Link>
      </div>
    </main>
  );
}
