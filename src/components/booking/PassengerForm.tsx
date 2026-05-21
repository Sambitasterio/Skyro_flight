"use client";

import Link from "next/link";
import { useState } from "react";

import {
  documentOption,
  GOVERNMENT_DOCUMENT_OPTIONS,
} from "@/lib/booking/government-documents";
import { NATIONALITIES } from "@/lib/booking/nationalities";
import {
  hasPassengerErrors,
  maskDocumentNumber,
  validatePassengerForm,
} from "@/lib/booking/validate-passenger";
import { useFlightStore } from "@/store/useFlightStore";
import type { GovernmentDocumentType, PassengerFieldErrors } from "@/types/passenger";

const inputClass =
  "w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-foreground outline-none ring-primary focus:ring-2 disabled:opacity-60";
const inputErrorClass = "border-red-500/60 focus:ring-red-500/40";

interface PassengerFormProps {
  flightId: string;
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
  const [documentFocused, setDocumentFocused] = useState(false);

  const docMeta = documentOption(passengerForm.documentType);

  const documentDisplay =
    documentFocused || !passengerForm.documentNumber
      ? passengerForm.documentNumber
      : maskDocumentNumber(passengerForm.documentNumber);

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
      <p className="mb-5 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-xs text-muted">
        Domestic routes (DEL, BOM, GOA, etc.) —{" "}
        <strong className="text-foreground">Aadhaar</strong> or any valid
        government ID works. Use passport for international legs.
      </p>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label htmlFor="fullName" className="text-sm font-medium text-foreground">
            Full name (as on your ID)
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
          />
          {showError("fullName") ? (
            <p className="text-xs text-red-400">{errors.fullName}</p>
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
          />
          {showError("dob") ? (
            <p className="text-xs text-red-400">{errors.dob}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="documentType"
            className="text-sm font-medium text-foreground"
          >
            ID type
          </label>
          <select
            id="documentType"
            name="documentType"
            value={passengerForm.documentType}
            onChange={(e) =>
              setPassengerForm({
                documentType: e.target.value as GovernmentDocumentType,
                documentNumber: "",
              })
            }
            className={inputClass}
          >
            {GOVERNMENT_DOCUMENT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="documentNumber"
            className="text-sm font-medium text-foreground"
          >
            {docMeta.label} number
          </label>
          <input
            id="documentNumber"
            name="documentNumber"
            type="text"
            inputMode={
              passengerForm.documentType === "aadhaar" ? "numeric" : "text"
            }
            autoComplete="off"
            value={documentDisplay}
            onFocus={() => setDocumentFocused(true)}
            onBlur={() => setDocumentFocused(false)}
            onChange={(e) => {
              const raw = e.target.value;
              setPassengerForm({
                documentNumber:
                  passengerForm.documentType === "aadhaar"
                    ? raw.replace(/\D/g, "").slice(0, 12)
                    : raw.toUpperCase(),
              });
            }}
            className={`${inputClass} font-mono tracking-wide ${showError("documentNumber") ? inputErrorClass : ""}`}
            placeholder={docMeta.placeholder}
            aria-invalid={showError("documentNumber")}
          />
          <p className="text-xs text-muted">{docMeta.hint}</p>
          {showError("documentNumber") ? (
            <p className="text-xs text-red-400">{errors.documentNumber}</p>
          ) : null}
          <p className="text-xs text-muted">
            Masked after you leave the field · never saved to browser storage
          </p>
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
