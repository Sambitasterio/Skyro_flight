"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { createClient } from "@/lib/supabase/client";
import { formatInr } from "@/lib/flights/format";
import { seatRowToSelected } from "@/lib/seats/seat-from-row";
import {
  buildSeatZones,
  isPremiumSeat,
  seatMatchesCabin,
  sortSeats,
} from "@/lib/seats/seat-layout";
import { useFlightStore } from "@/store/useFlightStore";
import type { CabinClass } from "@/types/flight";
import type { SeatRow } from "@/types/database";

import { AppToast } from "@/components/ui/AppToast";
import { useSeatRealtime } from "@/hooks/useSeatRealtime";

import { SeatMapLegend } from "./SeatMapLegend";
import { SeatMapSkeleton } from "./SeatMapSkeleton";

interface SeatMapProps {
  flightId: string;
  cabinClass: CabinClass;
  /** Called once with a refetch function for reserve failures. */
  registerRefresh?: (refresh: () => void) => void;
}

/**
 * Seat selection is optimistic in Zustand only.
 * `reserve_seat` runs on Continue (Phase 5.5), not on click.
 */
export function SeatMap({ flightId, cabinClass, registerRefresh }: SeatMapProps) {
  const selectedSeat = useFlightStore((s) => s.selectedSeat);
  const setSelectedSeat = useFlightStore((s) => s.setSelectedSeat);

  const [seats, setSeats] = useState<SeatRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const selectedSeatId =
    selectedSeat?.flight_id === flightId ? selectedSeat.id : null;

  const fetchSeats = useCallback(async () => {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { data, error: fetchErr } = await supabase
      .from("seats")
      .select("id, flight_id, seat_number, class, is_available, extra_fee")
      .eq("flight_id", flightId);

    if (fetchErr) {
      setError(fetchErr.message);
      setSeats([]);
      setLoading(false);
      return;
    }

    const rows = sortSeats((data ?? []) as SeatRow[]);
    setSeats(rows);
    setLoading(false);
    return rows;
  }, [flightId]);

  useEffect(() => {
    if (selectedSeat?.flight_id !== flightId || seats.length === 0) return;
    const match = seats.find((s) => s.id === selectedSeat.id);
    if (!match?.is_available) {
      setSelectedSeat(null);
    }
  }, [seats, selectedSeat, flightId, setSelectedSeat]);

  useEffect(() => {
    void fetchSeats();
  }, [fetchSeats]);

  useEffect(() => {
    registerRefresh?.(() => {
      void fetchSeats();
    });
  }, [fetchSeats, registerRefresh]);

  const realtimeEnabled = !loading && !error;
  const { toast, dismissToast } = useSeatRealtime(flightId, setSeats, {
    enabled: realtimeEnabled,
    selectedSeatId,
    onSelectedSeatLost: () => setSelectedSeat(null),
  });

  const zones = useMemo(() => buildSeatZones(seats), [seats]);

  const handleSeatClick = (seat: SeatRow) => {
    if (!seat.is_available || !seatMatchesCabin(seat, cabinClass)) return;

    if (selectedSeatId === seat.id) {
      setSelectedSeat(null);
      return;
    }

    setSelectedSeat(seatRowToSelected(seat));
  };

  if (loading) return <SeatMapSkeleton />;

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-6 py-8 text-center">
        <p className="font-semibold text-foreground">Could not load seats</p>
        <p className="mt-2 text-sm text-muted">{error}</p>
        <button
          type="button"
          onClick={() => void fetchSeats()}
          className="text-primary mt-4 text-sm font-semibold hover:underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AppToast
        message={toast}
        variant="info"
        onDismiss={dismissToast}
      />

      <SeatMapLegend />

      <div className="overflow-x-auto rounded-2xl border border-border bg-card p-4 sm:p-6">
        <div className="mx-auto min-w-[20rem] max-w-lg">
          <div className="mb-6 flex justify-center">
            <div className="rounded-b-3xl border border-b-0 border-border bg-surface px-12 py-2 text-xs font-semibold uppercase tracking-wider text-muted">
              Front · Cockpit
            </div>
          </div>

          <div className="mb-3 grid grid-cols-[2rem_1fr_1fr_1fr_0.75rem_1fr_1fr_1fr] items-end gap-1 text-center text-xs font-bold text-muted">
            <span />
            <span>A</span>
            <span>B</span>
            <span>C</span>
            <span />
            <span>D</span>
            <span>E</span>
            <span>F</span>
          </div>

          {zones.map((zone) => (
            <section key={zone.class} className="mb-6 last:mb-0">
              <div className="mb-2 flex items-center gap-2">
                <h3 className="text-sm font-bold text-foreground">{zone.label}</h3>
                {zone.class !== cabinClass ? (
                  <span className="text-xs text-muted">(view only)</span>
                ) : null}
              </div>

              <ul className="space-y-1.5">
                {zone.rows.map((row) => (
                  <li
                    key={row.rowNumber}
                    className="grid grid-cols-[2rem_1fr_1fr_1fr_0.75rem_1fr_1fr_1fr] items-center gap-1"
                  >
                    <span className="text-center text-xs font-medium text-muted">
                      {row.rowNumber}
                    </span>
                    {(["A", "B", "C"] as const).map((col) => {
                      const seat = row.seats.get(col);
                      if (!seat) return <span key={col} />;
                      return (
                        <SeatButton
                          key={seat.id}
                          seat={seat}
                          cabinClass={cabinClass}
                          isSelected={selectedSeatId === seat.id}
                          onClick={() => handleSeatClick(seat)}
                        />
                      );
                    })}
                    <span className="text-center text-[10px] text-muted" aria-hidden>
                      ‖
                    </span>
                    {(["D", "E", "F"] as const).map((col) => {
                      const seat = row.seats.get(col);
                      if (!seat) return <span key={col} />;
                      return (
                        <SeatButton
                          key={seat.id}
                          seat={seat}
                          cabinClass={cabinClass}
                          isSelected={selectedSeatId === seat.id}
                          onClick={() => handleSeatClick(seat)}
                        />
                      );
                    })}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>

      <p className="text-center text-xs text-muted">
        Tap a seat in {cabinClass} to select · tap again to deselect
      </p>
    </div>
  );
}

function SeatButton({
  seat,
  cabinClass,
  isSelected,
  onClick,
}: {
  seat: SeatRow;
  cabinClass: CabinClass;
  isSelected: boolean;
  onClick: () => void;
}) {
  const taken = !seat.is_available;
  const inClass = seatMatchesCabin(seat, cabinClass);
  const premium = isPremiumSeat(seat) && !taken;
  const selectable = inClass && !taken;

  const title = taken
    ? `${seat.seat_number} — Taken`
    : `${seat.seat_number} — ${seat.class}${Number(seat.extra_fee) > 0 ? ` · +${formatInr(Number(seat.extra_fee))}` : ""}`;

  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      aria-pressed={isSelected}
      disabled={!selectable}
      onClick={onClick}
      className={`mx-auto flex h-11 w-11 items-center justify-center rounded-lg text-xs font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring ${seatButtonClass({
        taken,
        selectable,
        premium,
        isSelected,
      })}`}
    >
      {seat.seat_number.replace(/^\d+/, "")}
    </button>
  );
}

function seatButtonClass({
  taken,
  selectable,
  premium,
  isSelected,
}: {
  taken: boolean;
  selectable: boolean;
  premium: boolean;
  isSelected: boolean;
}): string {
  if (taken) return "cursor-not-allowed bg-slate-500/40 text-slate-500";
  if (isSelected) {
    return "bg-primary text-primary-foreground ring-2 ring-indigo-300";
  }
  if (!selectable) {
    return "cursor-not-allowed bg-slate-700/30 text-slate-500 opacity-60";
  }
  if (premium) {
    return "cursor-pointer bg-amber-200/90 text-amber-950 ring-1 ring-amber-500/50 hover:bg-amber-300";
  }
  return "cursor-pointer bg-slate-200 text-slate-800 hover:bg-indigo-400 hover:text-white";
}
