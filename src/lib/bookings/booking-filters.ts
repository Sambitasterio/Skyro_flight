import type { UserBookingItem } from "@/lib/bookings/load-user-bookings";

export type BookingTab = "all" | "upcoming" | "past" | "cancelled";

export function filterBookingsByTab(
  bookings: UserBookingItem[],
  tab: BookingTab,
): UserBookingItem[] {
  const now = Date.now();

  switch (tab) {
    case "upcoming":
      return bookings.filter(
        (b) =>
          b.status !== "cancelled" &&
          new Date(b.flight.departs_at).getTime() > now,
      );
    case "past":
      return bookings.filter(
        (b) =>
          b.status !== "cancelled" &&
          new Date(b.flight.departs_at).getTime() <= now,
      );
    case "cancelled":
      return bookings.filter((b) => b.status === "cancelled");
    default:
      return bookings;
  }
}

/** True when cancellation is blocked (< 2 hours before departure). */
export function isWithinCancellationWindow(departsAt: string): boolean {
  const dep = new Date(departsAt).getTime();
  const twoHoursMs = 2 * 60 * 60 * 1000;
  return dep - Date.now() < twoHoursMs;
}
