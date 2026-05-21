import { calculatePriceBreakdown } from "@/lib/booking/price-breakdown";
import { cabinClassLabel, formatInr } from "@/lib/flights/format";
import type { SelectedFlight } from "@/types/flight";
import type { SelectedSeat } from "@/types/flight";

interface BookingPriceBreakdownProps {
  selectedFlight: SelectedFlight | null;
  selectedSeat: SelectedSeat | null;
  /** Total from `reserve_seat` — shown when store breakdown may differ from RPC. */
  reservedTotal?: number;
}

export function BookingPriceBreakdown({
  selectedFlight,
  selectedSeat,
  reservedTotal,
}: BookingPriceBreakdownProps) {
  if (!selectedFlight) {
    return (
      <p className="mt-4 text-sm text-muted">Fare details unavailable.</p>
    );
  }

  const breakdown = calculatePriceBreakdown(
    selectedFlight.displayPrice,
    selectedSeat?.extra_fee ?? 0,
  );
  const total =
    reservedTotal !== undefined ? reservedTotal : breakdown.total;

  return (
    <div className="mt-4 border-t border-border pt-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">
        Price breakdown
      </p>
      {selectedSeat ? (
        <p className="mt-1 text-sm font-medium text-foreground">
          Seat {selectedSeat.seat_number} · {cabinClassLabel(selectedSeat.class)}
        </p>
      ) : null}

      <dl className="mt-3 space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted">Base fare</dt>
          <dd className="font-medium tabular-nums text-foreground">
            {formatInr(breakdown.baseFare)}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted">Seat fee</dt>
          <dd className="font-medium tabular-nums text-foreground">
            {breakdown.seatFee > 0
              ? `+${formatInr(breakdown.seatFee)}`
              : "Included"}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted">Taxes & fees (12%)</dt>
          <dd className="font-medium tabular-nums text-foreground">
            {formatInr(breakdown.taxes)}
          </dd>
        </div>
        <div className="flex justify-between gap-2 border-t border-border pt-2 text-base">
          <dt className="font-semibold text-foreground">Total</dt>
          <dd className="font-bold tabular-nums text-primary">
            {formatInr(total)}
          </dd>
        </div>
      </dl>
    </div>
  );
}
