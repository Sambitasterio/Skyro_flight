"use client";

import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";
import { useUserStore } from "@/store/useUserStore";

interface LogoutButtonProps {
  className?: string;
}

export function LogoutButton({ className = "" }: LogoutButtonProps) {
  const router = useRouter();
  const resetUser = useUserStore((state) => state.resetUser);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    resetUser();
    router.refresh();
    router.push("/");
  };

  return (
    <button
      type="button"
      onClick={() => void handleLogout()}
      className={
        className ||
        "rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground transition hover:bg-surface"
      }
    >
      Log out
    </button>
  );
}
