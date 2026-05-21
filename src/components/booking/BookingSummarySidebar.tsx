import {
  airportLabel,
  cabinClassLabel,
  formatDuration,
  formatFlightDate,
  formatFlightTime,
} from "@/lib/flights/format";
import type { ActiveBooking } from "@/types/booking";
import type { SelectedFlight } from "@/types/flight";
import type { SelectedSeat } from "@/types/flight";
import type { FlightRow } from "@/types/database";

import { BookingPriceBreakdown } from "./BookingPriceBreakdown";

interface BookingSummarySidebarProps {
  flight: FlightRow;
  selectedFlight: SelectedFlight | null;
  selectedSeat: SelectedSeat | null;
  activeBooking: ActiveBooking;
}

export function BookingSummarySidebar({
  flight,
  selectedFlight,
  selectedSeat,
  activeBooking,
}: BookingSummarySidebarProps) {
  const cabin = selectedFlight?.cabinClass ?? selectedSeat?.class ?? "economy";

  return (
    <aside className="rounded-2xl border border-border bg-card p-4 sm:p-5 lg:sticky lg:top-20">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">
        Booking summary
      </p>
      <p className="mt-1 text-lg font-bold text-foreground">
        {airportLabel(flight.origin)} → {airportLabel(flight.destination)}
      </p>
      <p className="mt-1 text-sm text-muted">
        {formatFlightDate(flight.departs_at)} · {formatFlightTime(flight.departs_at)}
        {" – "}
        {formatFlightTime(flight.arrives_at)}
        {" · "}
        {formatDuration(flight.departs_at, flight.arrives_at)}
      </p>

      <div className="mt-4 rounded-xl bg-primary/10 px-3 py-2.5">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
          PNR (reserved)
        </p>
        <p className="mt-0.5 font-mono text-lg font-bold tracking-wide text-primary">
          {activeBooking.pnr_code}
        </p>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <div>
          <dt className="text-muted">Flight</dt>
          <dd className="font-semibold text-foreground">{flight.flight_no}</dd>
        </div>
        <div>
          <dt className="text-muted">Aircraft</dt>
          <dd className="font-semibold text-foreground">{flight.aircraft_type}</dd>
        </div>
        <div>
          <dt className="text-muted">Class</dt>
          <dd className="font-semibold text-foreground">
            {cabinClassLabel(cabin)}
          </dd>
        </div>
        {selectedSeat ? (
          <div>
            <dt className="text-muted">Seat</dt>
            <dd className="font-semibold text-foreground">
              {selectedSeat.seat_number}
            </dd>
          </div>
        ) : null}
      </dl>

      <BookingPriceBreakdown
        selectedFlight={selectedFlight}
        selectedSeat={selectedSeat}
        reservedTotal={activeBooking.total_price}
      />

      <p className="mt-4 flex items-center gap-2 text-xs text-muted">
        <span className="text-primary" aria-hidden>
          🔒
        </span>
        Seat locked · complete passenger details to confirm
      </p>
    </aside>
  );
}
