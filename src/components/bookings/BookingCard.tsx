import Link from "next/link";
import type { ReactNode } from "react";

import { BookingStatusBadge } from "@/components/bookings/BookingStatusBadge";
import type { UserBookingItem } from "@/lib/bookings/load-user-bookings";
import {
  airportLabel,
  cabinClassLabel,
  formatDuration,
  formatFlightDate,
  formatFlightTime,
  formatInr,
} from "@/lib/flights/format";

interface BookingCardProps {
  booking: UserBookingItem;
}

function MetaCell({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="min-w-[4.5rem] shrink-0">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted sm:text-xs">
        {label}
      </p>
      <div className="mt-0.5 text-sm font-semibold text-foreground">{children}</div>
    </div>
  );
}

export function BookingCard({ booking }: BookingCardProps) {
  const { flight, seat } = booking;
  const duration = formatDuration(flight.departs_at, flight.arrives_at);

  return (
    <Link
      href={`/bookings/${booking.id}`}
      className="group block rounded-2xl border border-border bg-card transition duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:translate-y-0"
    >
      <article className="flex flex-col gap-4 p-4 sm:p-5 md:flex-row md:items-center md:gap-5 lg:gap-6">
        {/* Route + schedule */}
        <div className="min-w-0 md:w-[min(28%,14rem)] md:shrink-0">
          <div className="flex items-start justify-between gap-2 md:block">
            <div>
              <p className="text-base font-bold leading-snug text-foreground sm:text-lg">
                <span className="text-foreground">{flight.origin}</span>
                <span className="mx-1.5 text-muted" aria-hidden>
                  →
                </span>
                <span className="text-foreground">{flight.destination}</span>
              </p>
              <p className="mt-0.5 text-xs text-muted sm:text-sm">
                {airportLabel(flight.origin)} → {airportLabel(flight.destination)}
              </p>
            </div>
            <BookingStatusBadge status={booking.status} />
          </div>
          <p className="mt-2 text-xs text-muted sm:text-sm">
            {formatFlightDate(flight.departs_at)} · {flight.flight_no}
          </p>
        </div>

        {/* Times — horizontal on md+ */}
        <div className="flex items-center gap-3 border-y border-border py-3 md:border-y-0 md:border-x md:py-0 md:px-4 lg:px-5">
          <div className="text-center md:min-w-[3.25rem]">
            <p className="text-lg font-bold tabular-nums text-foreground">
              {formatFlightTime(flight.departs_at)}
            </p>
            <p className="text-[10px] font-medium uppercase text-muted">Departs</p>
          </div>
          <div className="flex min-w-0 flex-1 flex-col items-center gap-1 px-1">
            <span className="text-[10px] font-medium text-muted">{duration}</span>
            <span
              className="h-px w-full max-w-[5rem] bg-gradient-to-r from-transparent via-border to-transparent sm:max-w-[6rem]"
              aria-hidden
            />
            <span className="text-primary text-xs" aria-hidden>
              ✈
            </span>
          </div>
          <div className="text-center md:min-w-[3.25rem]">
            <p className="text-lg font-bold tabular-nums text-foreground">
              {formatFlightTime(flight.arrives_at)}
            </p>
            <p className="text-[10px] font-medium uppercase text-muted">Arrives</p>
          </div>
        </div>

        {/* Meta — scroll on narrow tablets */}
        <div className="flex min-w-0 flex-1 gap-4 overflow-x-auto pb-0.5 md:gap-5 lg:gap-6 [scrollbar-width:thin]">
          <MetaCell label="PNR">
            <span className="font-mono text-primary">{booking.pnr_code}</span>
          </MetaCell>
          <MetaCell label="Seat">
            <span>
              {seat.seat_number}
              <span className="font-normal text-muted">
                {" "}
                · {cabinClassLabel(seat.class)}
              </span>
            </span>
          </MetaCell>
          <MetaCell label="Passenger">
            <span className="max-w-[8rem] truncate sm:max-w-[10rem]">
              {booking.passenger?.full_name ?? "—"}
            </span>
          </MetaCell>
        </div>

        {/* Total + affordance */}
        <div className="flex shrink-0 items-center justify-between gap-3 border-t border-border pt-3 md:flex-col md:items-end md:justify-center md:border-t-0 md:pt-0 md:pl-2 lg:min-w-[5.5rem]">
          <div className="md:text-right">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">
              Total
            </p>
            <p className="text-lg font-bold tabular-nums text-primary sm:text-xl">
              {formatInr(booking.total_price)}
            </p>
          </div>
          <span
            className="text-primary flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-lg transition group-hover:bg-primary group-hover:text-primary-foreground"
            aria-hidden
          >
            →
          </span>
        </div>
      </article>
    </Link>
  );
}
