"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { AppToast } from "@/components/ui/AppToast";
import { reserveSeat } from "@/lib/booking/reserve-seat";
import { useFlightStore } from "@/store/useFlightStore";
import { useUserStore } from "@/store/useUserStore";
import type { SelectedSeat } from "@/types/flight";

interface SeatContinueBarProps {
  flightId: string;
  selectedSeat: SelectedSeat | null;
  disabled?: boolean;
  onReserveFailed: () => void;
}

export function SeatContinueBar({
  flightId,
  selectedSeat,
  disabled = false,
  onReserveFailed,
}: SeatContinueBarProps) {
  const router = useRouter();
  const session = useUserStore((s) => s.session);
  const setActiveBooking = useFlightStore((s) => s.setActiveBooking);
  const setSelectedSeat = useFlightStore((s) => s.setSelectedSeat);
  const setBookingStep = useFlightStore((s) => s.setBookingStep);

  const [reserving, setReserving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canContinue =
    Boolean(session?.user) &&
    Boolean(selectedSeat) &&
    !disabled &&
    !reserving;

  const handleContinue = async () => {
    if (!session?.user || !selectedSeat) return;

    setReserving(true);
    setError(null);

    try {
      const booking = await reserveSeat(
        flightId,
        selectedSeat.id,
        session.user.id,
      );
      setActiveBooking(booking);
      setBookingStep(3);
      router.push(`/book/${flightId}`);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not reserve your seat.";
      setError(message);
      setSelectedSeat(null);
      onReserveFailed();
    } finally {
      setReserving(false);
    }
  };

  return (
    <>
      <AppToast
        message={error}
        variant="error"
        onDismiss={() => setError(null)}
      />

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 px-4 py-3 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] backdrop-blur-md sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="min-w-0 text-sm">
            {selectedSeat ? (
              <p className="font-medium text-foreground">
                Seat {selectedSeat.seat_number} selected
              </p>
            ) : (
              <p className="text-muted">Select a seat to continue</p>
            )}
          </div>

          <button
            type="button"
            disabled={!canContinue}
            onClick={() => void handleContinue()}
            className="bg-primary text-primary-foreground shrink-0 rounded-xl px-6 py-3 text-sm font-bold shadow-md transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {reserving ? "Reserving…" : "Continue →"}
          </button>
        </div>
      </div>
    </>
  );
}
