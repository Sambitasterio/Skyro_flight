"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { createClient } from "@/lib/supabase/client";
import { clearClientStoresOnLogout } from "@/lib/store/clear-client-stores";
import { useUserStore } from "@/store/useUserStore";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const setSession = useUserStore((state) => state.setSession);

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
      if (event === "SIGNED_OUT") {
        clearClientStoresOnLogout();
        return;
      }
      setSession(session);
    });

    return () => {
      unsubscribeHydration();
      subscription.unsubscribe();
    };
  }, [pathname, setSession]);

  return children;
}
