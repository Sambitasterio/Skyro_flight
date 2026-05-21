"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { cancelBooking } from "@/app/bookings/actions";
import type { BookingDetailData } from "@/lib/bookings/load-booking-by-id";
import {
  airportLabel,
  formatFlightDate,
  formatInr,
} from "@/lib/flights/format";

interface CancelBookingModalProps {
  booking: BookingDetailData;
  open: boolean;
  onClose: () => void;
}

export function CancelBookingModal({
  booking,
  open,
  onClose,
}: CancelBookingModalProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      setError(null);
      setSubmitting(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !submitting) onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose, submitting]);

  const handleCancel = async () => {
    setSubmitting(true);
    setError(null);
    const result = await cancelBooking(booking.id);
    setSubmitting(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    onClose();
    router.refresh();
  };

  if (!open) return null;

  const { flight } = booking;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cancel-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/60"
        aria-label="Close"
        disabled={submitting}
        onClick={onClose}
      />

      <div className="relative w-full max-w-md overflow-hidden rounded-t-2xl border border-border bg-card shadow-2xl sm:rounded-2xl">
        <header className="border-b border-border px-5 py-4">
          <h2 id="cancel-title" className="text-lg font-bold text-foreground">
            Cancel booking?
          </h2>
          <p className="mt-1 text-sm text-muted">
            PNR {booking.pnr_code} ·{" "}
            {airportLabel(flight.origin)} →{" "}
            {airportLabel(flight.destination)}
          </p>
        </header>

        <div className="space-y-4 px-5 py-4">
          {error ? (
            <p
              className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300"
              role="alert"
            >
              {error}
            </p>
          ) : null}

          <div className="rounded-xl border border-border bg-surface p-4 text-sm">
            <p className="font-semibold text-foreground">
              {formatFlightDate(flight.departs_at)} · {flight.flight_no}
            </p>
            <p className="mt-2 text-muted">
              Total paid:{" "}
              <span className="font-semibold text-foreground">
                {formatInr(booking.total_price)}
              </span>
            </p>
          </div>

          <p className="text-sm leading-relaxed text-muted">
            Your seat will be released for other travellers. A full refund of{" "}
            <span className="font-semibold text-foreground">
              {formatInr(booking.total_price)}
            </span>{" "}
            will be credited to your original payment method within 5–7 business
            days (demo copy — no real payment processing).
          </p>

          <p className="text-xs text-amber-400">
            This action cannot be undone.
          </p>
        </div>

        <footer className="flex gap-2 border-t border-border p-4">
          <button
            type="button"
            disabled={submitting}
            onClick={onClose}
            className="flex-1 rounded-xl border border-border py-3 text-sm font-semibold text-foreground disabled:opacity-50"
          >
            Keep booking
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={() => void handleCancel()}
            className="flex-1 rounded-xl border border-red-500/40 bg-red-500/15 py-3 text-sm font-bold text-red-400 transition enabled:hover:bg-red-500/25 disabled:opacity-50"
          >
            {submitting ? "Cancelling…" : "Yes, cancel"}
          </button>
        </footer>
      </div>
    </div>
  );
}
