"use client";

import Link from "next/link";

import { useUserStore } from "@/store/useUserStore";

const linkClass =
  "rounded-md text-muted transition hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

export function Footer() {
  const session = useUserStore((s) => s.session);

  return (
    <footer className="no-print border-t border-border bg-surface">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
        <p className="text-sm text-muted">
          © {new Date().getFullYear()} Skyro. All rights reserved.
        </p>
        <nav
          className="flex flex-wrap items-center justify-center gap-6 text-sm"
          aria-label="Footer"
        >
          <Link href="/" className={linkClass}>
            Search flights
          </Link>
          {session?.user && (
            <Link href="/bookings" className={linkClass}>
              My bookings
            </Link>
          )}
          {!session?.user && (
            <Link href="/auth/login" className={linkClass}>
              Log in
            </Link>
          )}
        </nav>
      </div>
    </footer>
  );
}
