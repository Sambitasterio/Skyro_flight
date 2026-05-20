import type { Session } from "@supabase/supabase-js";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
  session: Session | null;
  cachedBookings: never[];
  setSession: (session: Session | null) => void;
  setCachedBookings: (bookings: never[]) => void;
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
      partialize: (state) => ({ session: state.session }),
    },
  ),
);
