"use client";

import Link from "next/link";
import { useState } from "react";

import { AuthModal } from "@/components/auth/AuthModal";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { useUserStore } from "@/store/useUserStore";

export function AuthStatusBar() {
  const session = useUserStore((state) => state.session);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {session?.user ? (
          <>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm text-emerald-700">
              Signed in as {session.user.email}
            </span>
            <LogoutButton />
          </>
        ) : (
          <>
            <Link
              href="/auth/login"
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium"
            >
              Log in
            </Link>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
              Try auth modal
            </button>
          </>
        )}
      </div>

      <AuthModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        redirectTo="/"
      />
    </>
  );
}
