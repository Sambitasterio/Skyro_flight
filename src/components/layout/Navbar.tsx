"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { LogoutButton } from "@/components/auth/LogoutButton";
import { HERO_TRANSPARENT_NAV } from "@/lib/layout/nav";
import { useUserStore } from "@/store/useUserStore";

const FLIGHTS_NAV = {
  href: "/",
  label: "Flights",
  icon: PlaneIcon,
  match: (p: string) => p === "/" || p.startsWith("/flights"),
} as const;

const BOOKINGS_NAV = {
  href: "/bookings",
  label: "My Bookings",
  icon: BookingsIcon,
  match: (p: string) => p.startsWith("/bookings"),
} as const;

export function Navbar() {
  const pathname = usePathname();
  const session = useUserStore((s) => s.session);
  const navItems = session?.user ? [FLIGHTS_NAV, BOOKINGS_NAV] : [FLIGHTS_NAV];
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isHeroRoute = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  // Transparent nav only over dark hero (Phase 3.3+). White placeholder home needs solid nav.
  const transparentNav =
    HERO_TRANSPARENT_NAV && isHeroRoute && !scrolled;
  const solid = !transparentNav;

  return (
    <>
      <header
        className={`no-print fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          solid
            ? "border-b border-border/80 bg-card/90 shadow-sm backdrop-blur-md"
            : "border-b border-white/10 bg-slate-900/40 backdrop-blur-md"
        }`}
      >
        <div className="relative mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          {/* Left — logo */}
          <div className="flex flex-1 items-center justify-start">
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                <PlaneIcon className="h-5 w-5" />
              </span>
              <span
                className={`text-lg font-bold tracking-tight ${
                  solid ? "text-foreground" : "text-white drop-shadow-sm"
                }`}
              >
                Sky<span className={solid ? "text-primary" : "text-indigo-300"}>ro</span>
              </span>
            </Link>
          </div>

          {/* Center — always screen-centered, not between logo and auth */}
          <nav
            className="pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-2 md:flex"
            aria-label="Main navigation"
          >
            <div className="pointer-events-auto flex items-center gap-2">
              {navItems.map(({ href, label, icon: Icon, match }) => {
                const active = match(pathname);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={navTabClass({ active, solid })}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="leading-none">{label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Right — auth (width varies; center nav unaffected) */}
          <div className="flex flex-1 items-center justify-end gap-2">
            <div className="hidden items-center gap-2 sm:flex">
              {session?.user ? (
                <>
                  <Link
                    href="/bookings"
                    className={`flex max-w-[200px] items-center gap-2 rounded-full px-2 py-1.5 text-sm font-medium lg:max-w-[220px] ${
                      solid
                        ? "text-foreground hover:bg-surface"
                        : "text-white hover:bg-white/10"
                    }`}
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                      {session.user.email?.[0]?.toUpperCase() ?? "U"}
                    </span>
                    <span className="hidden truncate lg:inline">
                      {session.user.email}
                    </span>
                  </Link>
                  <LogoutButton
                    className={
                      solid
                        ? "rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground transition hover:bg-surface"
                        : "rounded-lg border border-white/40 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-white/10"
                    }
                  />
                </>
              ) : (
                <Link
                  href="/auth/login"
                  className={`inline-flex h-10 items-center rounded-full px-4 text-sm font-semibold transition ${NAV_FOCUS} ${
                    solid
                      ? "border border-border text-foreground hover:bg-surface"
                      : "border border-white/40 text-white hover:bg-white/10"
                  }`}
                >
                  Log in
                </Link>
              )}
            </div>

            <button
              type="button"
              className={`inline-flex h-9 w-9 items-center justify-center rounded-lg md:hidden ${
                solid
                  ? "text-foreground hover:bg-surface"
                  : "text-white hover:bg-white/10"
              }`}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(true)}
            >
              <MenuIcon />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div
          className="no-print fixed inset-0 z-[60] bg-black/40 md:hidden"
          aria-hidden
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile bottom sheet */}
      <div
        className={`no-print fixed inset-x-0 bottom-0 z-[70] rounded-t-2xl border-t border-border bg-card p-6 shadow-2xl transition-transform duration-300 md:hidden ${
          mobileOpen ? "translate-y-0" : "translate-y-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border" />
        <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
          {navItems.map(({ href, label, icon: Icon, match }) => {
            const active = match(pathname);
            return (
              <Link
                key={href}
                href={href}
                className={`inline-flex h-12 w-full items-center gap-3 rounded-xl px-4 text-base font-semibold ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-surface"
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className="leading-none">{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-6 border-t border-border pt-6">
          {session?.user ? (
            <div className="flex flex-col gap-3">
              <p className="text-sm text-muted">
                Signed in as{" "}
                <span className="font-medium text-foreground">
                  {session.user.email}
                </span>
              </p>
              <LogoutButton />
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
            >
              Log in
            </Link>
          )}
        </div>
      </div>

      <div className="h-16 shrink-0" aria-hidden />
    </>
  );
}

const NAV_FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

function navTabClass({
  active,
  solid,
}: {
  active: boolean;
  solid: boolean;
}): string {
  const base = `inline-flex h-10 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold transition ${NAV_FOCUS}`;

  if (active) {
    return solid
      ? `${base} bg-primary/15 text-primary`
      : `${base} bg-white text-slate-900 shadow-sm`;
  }

  return solid
    ? `${base} text-muted hover:bg-surface hover:text-foreground`
    : `${base} border border-white/25 bg-white/10 text-white hover:bg-white/20`;
}

function PlaneIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 20 3c-1.5-1-2.5 0-4.5 1.5L12 8 3.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 5 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
    </svg>
  );
}

function BookingsIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
      <path d="M9 12h6M9 16h6" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
    </svg>
  );
}
