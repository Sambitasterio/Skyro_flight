"use server";

import {
  formatDocumentForDb,
  validatePassengerForm,
} from "@/lib/booking/validate-passenger";
import { createClient } from "@/lib/supabase/server";
import type { GovernmentDocumentType, PassengerFormData } from "@/types/passenger";

export interface CompleteBookingResult {
  error: string | null;
  pnr?: string;
}

function parsePassengerPayload(formData: FormData): PassengerFormData | null {
  const documentType = String(
    formData.get("documentType") ?? "",
  ) as GovernmentDocumentType;

  const payload: PassengerFormData = {
    fullName: String(formData.get("fullName") ?? "").trim(),
    nationality: String(formData.get("nationality") ?? "").trim(),
    dob: String(formData.get("dob") ?? "").trim(),
    documentType,
    documentNumber: String(formData.get("documentNumber") ?? "").trim(),
  };

  const validTypes: GovernmentDocumentType[] = [
    "aadhaar",
    "passport",
    "voter_id",
    "driving_license",
    "other",
  ];
  if (!validTypes.includes(documentType)) {
    return null;
  }

  return payload;
}

export async function completePassengerBooking(
  bookingId: string,
  flightId: string,
  formData: FormData,
): Promise<CompleteBookingResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Please sign in to complete your booking." };
  }

  const passenger = parsePassengerPayload(formData);
  if (!passenger) {
    return { error: "Invalid passenger details." };
  }

  const fieldErrors = validatePassengerForm(passenger);
  if (Object.keys(fieldErrors).length > 0) {
    return { error: "Please fix the highlighted fields and try again." };
  }

  const { data: booking, error: bookingErr } = await supabase
    .from("bookings")
    .select("id, pnr_code, flight_id, user_id, status")
    .eq("id", bookingId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (bookingErr || !booking) {
    return {
      error:
        "Booking not found. Return to seat selection and choose your seat again.",
    };
  }

  if (booking.flight_id !== flightId) {
    return { error: "This booking does not match the current flight." };
  }

  if (booking.status === "cancelled") {
    return { error: "This booking was cancelled. Please start a new booking." };
  }

  const { data: existingPassenger } = await supabase
    .from("passengers")
    .select("id")
    .eq("booking_id", booking.id)
    .maybeSingle();

  if (existingPassenger) {
    return { error: null, pnr: booking.pnr_code };
  }

  const { error: insertErr } = await supabase.from("passengers").insert({
    booking_id: booking.id,
    full_name: passenger.fullName,
    passport_no: formatDocumentForDb(passenger),
    nationality: passenger.nationality,
    dob: passenger.dob,
  });

  if (insertErr) {
    return {
      error:
        insertErr.message.includes("duplicate")
          ? "Passenger details were already saved for this booking."
          : "Could not save passenger details. Please try again.",
    };
  }

  return { error: null, pnr: booking.pnr_code };
}
