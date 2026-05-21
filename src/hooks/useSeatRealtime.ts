"use client";

import { useEffect, useRef, useState } from "react";

import { createClient } from "@/lib/supabase/client";
import type { SeatRow } from "@/types/database";

interface UseSeatRealtimeOptions {
  enabled: boolean;
  selectedSeatId: string | null;
  onSelectedSeatLost: () => void;
}

interface RealtimeSideEffects {
  clearSelection: boolean;
  toast: string | null;
}

/**
 * Subscribes to `postgres_changes` on `seats` for one flight.
 * Merges UPDATE payloads into local seat state and surfaces a toast when
 * a seat becomes unavailable.
 */
export function useSeatRealtime(
  flightId: string,
  setSeats: React.Dispatch<React.SetStateAction<SeatRow[]>>,
  { enabled, selectedSeatId, onSelectedSeatLost }: UseSeatRealtimeOptions,
) {
  const [toast, setToast] = useState<string | null>(null);
  const optionsRef = useRef({ selectedSeatId, onSelectedSeatLost });
  optionsRef.current = { selectedSeatId, onSelectedSeatLost };

  useEffect(() => {
    if (!enabled) return;

    const supabase = createClient();

    const channel = supabase
      .channel(`seats-flight-${flightId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "seats",
          filter: `flight_id=eq.${flightId}`,
        },
        (payload) => {
          const raw = payload.new as Record<string, unknown> | null;
          if (!raw || typeof raw.id !== "string") return;

          const patch: Pick<
            SeatRow,
            "id" | "is_available" | "seat_number" | "extra_fee"
          > = {
            id: raw.id,
            is_available: Boolean(raw.is_available),
            seat_number:
              typeof raw.seat_number === "string" ? raw.seat_number : "",
            extra_fee: Number(raw.extra_fee ?? 0),
          };

          const sideEffects: { current: RealtimeSideEffects | null } = {
            current: null,
          };

          setSeats((prev) => {
            const index = prev.findIndex((s) => s.id === patch.id);
            if (index === -1) return prev;

            const prevSeat = prev[index];
            const merged: SeatRow = { ...prevSeat, ...patch };
            const becameTaken =
              prevSeat.is_available && merged.is_available === false;

            if (becameTaken) {
              const { selectedSeatId: selectedId } = optionsRef.current;

              if (selectedId === merged.id) {
                sideEffects.current = {
                  clearSelection: true,
                  toast: `Seat ${merged.seat_number} was just taken — pick another.`,
                };
              } else {
                sideEffects.current = {
                  clearSelection: false,
                  toast: "A seat was just taken",
                };
              }
            }

            const next = [...prev];
            next[index] = merged;
            return next;
          });

          const effects = sideEffects.current;
          if (effects?.clearSelection) {
            optionsRef.current.onSelectedSeatLost();
          }
          if (effects?.toast) {
            setToast(effects.toast);
          }
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [enabled, flightId, setSeats]);

  return {
    toast,
    dismissToast: () => setToast(null),
  };
}
