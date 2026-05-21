import type { RescheduleHistoryItem } from "@/lib/bookings/load-booking-by-id";
import {
  airportLabel,
  formatFlightDate,
  formatFlightTime,
  formatInr,
} from "@/lib/flights/format";
import { formatBookedAt } from "@/lib/bookings/format-booking";

interface RescheduleHistoryProps {
  items: RescheduleHistoryItem[];
}

export function RescheduleHistory({ items }: RescheduleHistoryProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">
        Reschedule history
      </h2>
      <ul className="mt-4 space-y-4">
        {items.map((item) => (
          <li
            key={item.id}
            className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4"
          >
            <p className="text-xs text-muted">
              {formatBookedAt(item.requested_at)}
              {item.fee_charged > 0 ? (
                <span className="ml-2 font-semibold text-amber-400">
                  +{formatInr(item.fee_charged)} fee
                </span>
              ) : null}
            </p>
            <div className="mt-3 flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold uppercase text-muted">
                  From
                </p>
                <p className="font-medium text-foreground">
                  {airportLabel(item.old_flight.origin)} →{" "}
                  {airportLabel(item.old_flight.destination)}
                </p>
                <p className="text-xs text-muted">
                  {formatFlightDate(item.old_flight.departs_at)} ·{" "}
                  {formatFlightTime(item.old_flight.departs_at)} ·{" "}
                  {item.old_flight.flight_no}
                </p>
              </div>
              <span className="text-muted hidden sm:inline" aria-hidden>
                →
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold uppercase text-muted">
                  To
                </p>
                <p className="font-medium text-foreground">
                  {airportLabel(item.new_flight.origin)} →{" "}
                  {airportLabel(item.new_flight.destination)}
                </p>
                <p className="text-xs text-muted">
                  {formatFlightDate(item.new_flight.departs_at)} ·{" "}
                  {formatFlightTime(item.new_flight.departs_at)} ·{" "}
                  {item.new_flight.flight_no}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
