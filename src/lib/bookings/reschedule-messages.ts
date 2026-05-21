export interface RescheduleBookingResult {
  error: string | null;
  success?: boolean;
}

export function rescheduleErrorMessage(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("seat not available")) {
    return "That seat was just taken. Pick another seat.";
  }
  if (lower.includes("2 hours")) {
    return "Cannot reschedule within 2 hours of departure.";
  }
  if (lower.includes("same route")) {
    return "You can only reschedule to another flight on the same route.";
  }
  if (lower.includes("different flight or seat")) {
    return "Choose a different flight or seat to reschedule.";
  }
  return "Could not reschedule. Please try again.";
}
