"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { rescheduleBooking } from "@/app/bookings/actions";
import {
  calculateBookingTotal,
  rescheduleFeeDelta,
} from "@/lib/bookings/calculate-booking-total";
import type { BookingDetailData } from "@/lib/bookings/load-booking-by-id";
import {
  airportLabel,
  formatDuration,
  formatFlightDate,
  formatFlightTime,
  formatInr,
} from "@/lib/flights/format";
import { createClient } from "@/lib/supabase/client";
import type { CabinClass } from "@/types/flight";
import type { FlightRow, SeatRow } from "@/types/database";

interface RescheduleModalProps {
  booking: BookingDetailData;
  alternateFlights: FlightRow[];
  open: boolean;
  onClose: () => void;
}

export function RescheduleModal({
  booking,
  alternateFlights,
  open,
  onClose,
}: RescheduleModalProps) {
  const router = useRouter();
  const cabin = booking.seat.class as CabinClass;

  const [selectedFlightId, setSelectedFlightId] = useState<string | null>(null);
  const [seats, setSeats] = useState<SeatRow[]>([]);
  const [seatsLoading, setSeatsLoading] = useState(false);
  const [selectedSeatId, setSelectedSeatId] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const selectedFlight = alternateFlights.find((f) => f.id === selectedFlightId);
  const selectedSeat = seats.find((s) => s.id === selectedSeatId);

  const newTotal = useMemo(() => {
    if (!selectedFlight || !selectedSeat) return null;
    return calculateBookingTotal(
      Number(selectedFlight.base_price),
      Number(selectedSeat.extra_fee),
    );
  }, [selectedFlight, selectedSeat]);

  const feeDelta =
    newTotal !== null ? rescheduleFeeDelta(newTotal, booking.total_price) : 0;

  const loadSeats = useCallback(
    async (flightId: string) => {
      setSeatsLoading(true);
      setSeats([]);
      setSelectedSeatId(null);
      const supabase = createClient();
      const { data } = await supabase
        .from("seats")
        .select("id, flight_id, seat_number, class, is_available, extra_fee")
        .eq("flight_id", flightId)
        .eq("class", cabin)
        .eq("is_available", true)
        .order("seat_number");

      setSeats((data ?? []) as SeatRow[]);
      setSeatsLoading(false);
    },
    [cabin],
  );

  useEffect(() => {
    if (!open) {
      setSelectedFlightId(null);
      setSeats([]);
      setSelectedSeatId(null);
      setShowConfirm(false);
      setError(null);
      return;
    }
  }, [open]);

  useEffect(() => {
    if (selectedFlightId) {
      void loadSeats(selectedFlightId);
    }
  }, [selectedFlightId, loadSeats]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const handleReschedule = async () => {
    if (!selectedFlightId || !selectedSeatId) return;
    setSubmitting(true);
    setError(null);
    const result = await rescheduleBooking(
      booking.id,
      selectedFlightId,
      selectedSeatId,
    );
    setSubmitting(false);
    if (result.error) {
      setError(result.error);
      setShowConfirm(false);
      if (selectedFlightId) void loadSeats(selectedFlightId);
      return;
    }
    onClose();
    router.refresh();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reschedule-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/60"
        aria-label="Close"
        onClick={onClose}
      />

      <div className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl border border-border bg-card shadow-2xl sm:rounded-2xl">
        <header className="shrink-0 border-b border-border px-5 py-4">
          <h2 id="reschedule-title" className="text-lg font-bold text-foreground">
            Reschedule flight
          </h2>
          <p className="mt-1 text-sm text-muted">
            Same route: {airportLabel(booking.flight.origin)} →{" "}
            {airportLabel(booking.flight.destination)} · {cabin} class
          </p>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          {error ? (
            <p
              className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300"
              role="alert"
            >
              {error}
            </p>
          ) : null}

          {alternateFlights.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted">
              No other flights on this route right now.
            </p>
          ) : showConfirm && selectedFlight && selectedSeat ? (
            <div className="space-y-4">
              <p className="text-sm text-foreground">
                Change your booking to:
              </p>
              <div className="rounded-xl border border-border bg-surface p-4 text-sm">
                <p className="font-bold text-foreground">
                  {selectedFlight.flight_no} ·{" "}
                  {formatFlightDate(selectedFlight.departs_at)}
                </p>
                <p className="mt-1 text-muted">
                  {formatFlightTime(selectedFlight.departs_at)} –{" "}
                  {formatFlightTime(selectedFlight.arrives_at)} · Seat{" "}
                  {selectedSeat.seat_number}
                </p>
                <p className="mt-3 font-semibold text-foreground">
                  {feeDelta > 0 ? (
                    <>
                      Extra charge:{" "}
                      <span className="text-amber-400">
                        +{formatInr(feeDelta)}
                      </span>
                    </>
                  ) : (
                    <span className="text-emerald-400">No extra charge</span>
                  )}
                </p>
                <p className="mt-1 text-xs text-muted">
                  New total: {formatInr(newTotal ?? 0)}
                </p>
              </div>
            </div>
          ) : (
            <>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
                Choose a new flight
              </p>
              <ul className="space-y-2">
                {alternateFlights.map((flight) => {
                  const selected = selectedFlightId === flight.id;
                  return (
                    <li key={flight.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedFlightId(flight.id)}
                        className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                          selected
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/40"
                        }`}
                      >
                        <div className="flex justify-between gap-2">
                          <span className="font-bold text-foreground">
                            {flight.flight_no}
                          </span>
                          <span className="text-xs text-muted">
                            {formatDuration(
                              flight.departs_at,
                              flight.arrives_at,
                            )}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-muted">
                          {formatFlightDate(flight.departs_at)} ·{" "}
                          {formatFlightTime(flight.departs_at)} →{" "}
                          {formatFlightTime(flight.arrives_at)}
                        </p>
                      </button>
                    </li>
                  );
                })}
              </ul>

              {selectedFlightId ? (
                <div className="mt-6">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
                    Pick a seat ({cabin})
                  </p>
                  {seatsLoading ? (
                    <p className="text-sm text-muted">Loading seats…</p>
                  ) : seats.length === 0 ? (
                    <p className="text-sm text-amber-400">
                      No {cabin} seats available on this flight.
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {seats.map((seat) => {
                        const picked = selectedSeatId === seat.id;
                        const est = calculateBookingTotal(
                          Number(selectedFlight?.base_price ?? 0),
                          Number(seat.extra_fee),
                        );
                        return (
                          <button
                            key={seat.id}
                            type="button"
                            onClick={() => setSelectedSeatId(seat.id)}
                            className={`rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                              picked
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border hover:border-primary/50"
                            }`}
                          >
                            {seat.seat_number}
                            <span className="ml-1 text-xs opacity-80">
                              {formatInr(est)}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : null}
            </>
          )}
        </div>

        <footer className="shrink-0 flex gap-2 border-t border-border p-4">
          <button
            type="button"
            onClick={() => {
              if (showConfirm) {
                setShowConfirm(false);
              } else {
                onClose();
              }
            }}
            className="flex-1 rounded-xl border border-border py-3 text-sm font-semibold text-foreground"
          >
            {showConfirm ? "Back" : "Cancel"}
          </button>
          {showConfirm ? (
            <button
              type="button"
              disabled={submitting}
              onClick={() => void handleReschedule()}
              className="bg-primary text-primary-foreground flex-1 rounded-xl py-3 text-sm font-bold disabled:opacity-50"
            >
              {submitting ? "Rescheduling…" : "Confirm reschedule"}
            </button>
          ) : (
            <button
              type="button"
              disabled={!selectedFlightId || !selectedSeatId}
              onClick={() => setShowConfirm(true)}
              className="bg-primary text-primary-foreground flex-1 rounded-xl py-3 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-50"
            >
              Review change
            </button>
          )}
        </footer>
      </div>
    </div>
  );
}
