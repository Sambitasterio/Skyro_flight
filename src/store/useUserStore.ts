import type { Session } from "@supabase/supabase-js";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { UserBookingItem } from "@/lib/bookings/load-user-bookings";

interface UserState {
  session: Session | null;
  /** In-memory only — refetch from server on My Bookings mount. */
  cachedBookings: UserBookingItem[];
  setSession: (session: Session | null) => void;
  setCachedBookings: (bookings: UserBookingItem[]) => void;
  resetUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      session: null,
      cachedBookings: [],
      setSession: (session) => set({ session }),
      setCachedBookings: (cachedBookings) => set({ cachedBookings }),
      resetUser: () => set({ session: null, cachedBookings: [] }),
    }),
    {
      name: "user-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ session: state.session }),
    },
  ),
);
