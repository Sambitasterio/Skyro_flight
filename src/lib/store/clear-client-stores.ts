import { useFlightStore } from "@/store/useFlightStore";
import { useUserStore } from "@/store/useUserStore";

/** Clears auth session and in-progress booking journey (keeps searchQuery). */
export function clearClientStoresOnLogout(): void {
  useUserStore.getState().resetUser();
  useFlightStore.getState().resetBooking();
}
