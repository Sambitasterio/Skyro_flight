"use client";

import Link from "next/link";
import { useState } from "react";

import { NATIONALITIES } from "@/lib/booking/nationalities";
import {
  hasPassengerErrors,
  maskPassport,
  validatePassengerForm,
} from "@/lib/booking/validate-passenger";
import { useFlightStore } from "@/store/useFlightStore";
import type { PassengerFieldErrors } from "@/types/passenger";

const inputClass =
  "w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-foreground outline-none ring-primary focus:ring-2 disabled:opacity-60";
const inputErrorClass = "border-red-500/60 focus:ring-red-500/40";

interface PassengerFormProps {
  flightId: string;
  /** Called when all fields pass validation (wired in Phase 6.3). */
  onValidSubmit?: () => void;
  submitLabel?: string;
  isSubmitting?: boolean;
}

export function PassengerForm({
  flightId,
  onValidSubmit,
  submitLabel = "Confirm booking",
  isSubmitting = false,
}: PassengerFormProps) {
  const passengerForm = useFlightStore((s) => s.passengerForm);
  const setPassengerForm = useFlightStore((s) => s.setPassengerForm);

  const [errors, setErrors] = useState<PassengerFieldErrors>({});
  const [touched, setTouched] = useState(false);
  const [passportFocused, setPassportFocused] = useState(false);

  const passportDisplay =
    passportFocused || !passengerForm.passportNo
      ? passengerForm.passportNo
      : maskPassport(passengerForm.passportNo);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    const nextErrors = validatePassengerForm(passengerForm);
    setErrors(nextErrors);
    if (!hasPassengerErrors(nextErrors)) {
      onValidSubmit?.();
    }
  };

  const showError = (field: keyof PassengerFieldErrors) =>
    touched && Boolean(errors[field]);

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border bg-card p-5 sm:p-6"
      noValidate
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label htmlFor="fullName" className="text-sm font-medium text-foreground">
            Full name (as on passport)
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            value={passengerForm.fullName}
            onChange={(e) =>
              setPassengerForm({ fullName: e.target.value })
            }
            className={`${inputClass} ${showError("fullName") ? inputErrorClass : ""}`}
            placeholder="e.g. Rahul Sharma"
            aria-invalid={showError("fullName")}
            aria-describedby={showError("fullName") ? "fullName-error" : undefined}
          />
          {showError("fullName") ? (
            <p id="fullName-error" className="text-xs text-red-400">
              {errors.fullName}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="nationality" className="text-sm font-medium text-foreground">
            Nationality
          </label>
          <select
            id="nationality"
            name="nationality"
            value={passengerForm.nationality}
            onChange={(e) =>
              setPassengerForm({ nationality: e.target.value })
            }
            className={`${inputClass} ${showError("nationality") ? inputErrorClass : ""}`}
            aria-invalid={showError("nationality")}
          >
            <option value="">Select country</option>
            {NATIONALITIES.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          {showError("nationality") ? (
            <p className="text-xs text-red-400">{errors.nationality}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="dob" className="text-sm font-medium text-foreground">
            Date of birth
          </label>
          <input
            id="dob"
            name="dob"
            type="date"
            value={passengerForm.dob}
            onChange={(e) => setPassengerForm({ dob: e.target.value })}
            className={`${inputClass} ${showError("dob") ? inputErrorClass : ""}`}
            aria-invalid={showError("dob")}
          />
          {showError("dob") ? (
            <p className="text-xs text-red-400">{errors.dob}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label
            htmlFor="passportNo"
            className="text-sm font-medium text-foreground"
          >
            Passport number
          </label>
          <input
            id="passportNo"
            name="passportNo"
            type="text"
            autoComplete="off"
            value={passportDisplay}
            onFocus={() => setPassportFocused(true)}
            onBlur={() => setPassportFocused(false)}
            onChange={(e) =>
              setPassengerForm({ passportNo: e.target.value.toUpperCase() })
            }
            className={`${inputClass} font-mono tracking-wide ${showError("passportNo") ? inputErrorClass : ""}`}
            placeholder="A1234567"
            aria-invalid={showError("passportNo")}
          />
          <p className="text-xs text-muted">
            Masked after you leave the field · never saved to browser storage
          </p>
          {showError("passportNo") ? (
            <p className="text-xs text-red-400">{errors.passportNo}</p>
          ) : null}
        </div>
      </div>

      <div className="mt-6 flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href={`/flights/${flightId}/seats`}
          className="text-center text-sm font-semibold text-muted hover:text-primary sm:text-left"
        >
          ← Back to seat selection
        </Link>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-primary text-primary-foreground rounded-xl px-6 py-3 text-sm font-bold shadow-md transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
