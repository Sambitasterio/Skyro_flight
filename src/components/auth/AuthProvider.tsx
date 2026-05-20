"use client";

import { useEffect } from "react";

import { createClient } from "@/lib/supabase/client";
import { useUserStore } from "@/store/useUserStore";

export function AuthProvider({ children }: { children: React.ReactNode }) {
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

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setSession(session);
      } else {
        resetUser();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [resetUser, setSession]);

  return children;
}
