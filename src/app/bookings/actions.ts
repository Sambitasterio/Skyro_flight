"use server";

import { revalidatePath } from "next/cache";

import { cancelErrorMessage } from "@/lib/bookings/cancel-messages";
import type { CancelBookingResult } from "@/lib/bookings/cancel-messages";
import { rescheduleErrorMessage } from "@/lib/bookings/reschedule-messages";
import type { RescheduleBookingResult } from "@/lib/bookings/reschedule-messages";
import { createClient } from "@/lib/supabase/server";

export async function rescheduleBooking(
  bookingId: string,
  newFlightId: string,
  newSeatId: string,
): Promise<RescheduleBookingResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Please sign in to reschedule." };
  }

  const { error } = await supabase.rpc("reschedule_booking", {
    p_booking_id: bookingId,
    p_new_flight_id: newFlightId,
    p_new_seat_id: newSeatId,
    p_user_id: user.id,
  });

  if (error) {
    return { error: rescheduleErrorMessage(error.message) };
  }

  revalidatePath(`/bookings/${bookingId}`);
  revalidatePath("/bookings");

  return { error: null, success: true };
}

export async function cancelBooking(
  bookingId: string,
): Promise<CancelBookingResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Please sign in to cancel this booking." };
  }

  const { error } = await supabase.rpc("cancel_booking", {
    p_booking_id: bookingId,
    p_user_id: user.id,
  });

  if (error) {
    return { error: cancelErrorMessage(error.message) };
  }

  revalidatePath(`/bookings/${bookingId}`);
  revalidatePath("/bookings");

  return { error: null, success: true };
}
