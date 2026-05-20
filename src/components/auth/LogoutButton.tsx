"use client";

import { signOut } from "@/app/auth/actions";

export function LogoutButton() {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground transition hover:bg-surface"
      >
        Log out
      </button>
    </form>
  );
}
