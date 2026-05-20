"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { createClient } from "@/lib/supabase/client";
import { useUserStore } from "@/store/useUserStore";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const setSession = useUserStore((state) => state.setSession);
  const resetUser = useUserStore((state) => state.resetUser);

  useEffect(() => {
    const supabase = createClient();

    const syncSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
    };

    void syncSession();

    // Re-sync after Zustand rehydrates from localStorage (can overwrite a fresh login)
    const unsubscribeHydration = useUserStore.persist.onFinishHydration(() => {
      void syncSession();
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (!session) {
        resetUser();
      }
      if (event === "SIGNED_OUT") {
        setSession(null);
        resetUser();
      }
    });

    return () => {
      unsubscribeHydration();
      subscription.unsubscribe();
    };
  }, [pathname, resetUser, setSession]);

  return children;
}
