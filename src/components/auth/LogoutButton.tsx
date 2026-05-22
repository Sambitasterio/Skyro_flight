"use client";

import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";
import { clearClientStoresOnLogout } from "@/lib/store/clear-client-stores";

interface LogoutButtonProps {
  className?: string;
}

export function LogoutButton({ className = "" }: LogoutButtonProps) {
  const router = useRouter();
  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    clearClientStoresOnLogout();
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
