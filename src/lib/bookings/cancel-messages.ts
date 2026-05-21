export interface CancelBookingResult {
  error: string | null;
  success?: boolean;
}

export function cancelErrorMessage(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("2 hours")) {
    return "Cannot cancel within 2 hours of departure.";
  }
  if (lower.includes("already cancelled")) {
    return "This booking is already cancelled.";
  }
  if (lower.includes("not found")) {
    return "Booking not found.";
  }
  if (lower.includes("unauthorized")) {
    return "Please sign in to cancel this booking.";
  }
  return "Could not cancel booking. Please try again.";
}
