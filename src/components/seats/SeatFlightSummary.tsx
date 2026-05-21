import {
  airportLabel,
  cabinClassLabel,
  formatDuration,
  formatFlightDate,
  formatFlightTime,
  formatInr,
} from "@/lib/flights/format";
import { priceForCabin } from "@/lib/flights/pricing";
import type { SelectedFlight } from "@/types/flight";
import type { FlightRow } from "@/types/database";

interface SeatFlightSummaryProps {
  flight: FlightRow;
  selectedFlight: SelectedFlight | null;
}

export function SeatFlightSummary({
  flight,
  selectedFlight,
}: SeatFlightSummaryProps) {
  const cabin = selectedFlight?.cabinClass ?? "economy";
  const basePrice = Number(flight.base_price);
  const displayPrice = selectedFlight?.displayPrice ?? priceForCabin(basePrice, cabin);

  return (
    <aside className="rounded-2xl border border-border bg-card p-4 sm:p-5 lg:sticky lg:top-20">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">
        Your flight
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
        <div>
          <dt className="text-muted">From</dt>
          <dd className="font-semibold tabular-nums text-primary">
            {formatInr(displayPrice)}
          </dd>
        </div>
      </dl>
    </aside>
  );
}
