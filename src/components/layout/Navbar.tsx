"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { useUserStore } from "@/store/useUserStore";

const NAV_ITEMS = [
  { href: "/", label: "Flights", icon: PlaneIcon, match: (p: string) => p === "/" || p.startsWith("/flights") },
  { href: "/bookings", label: "My Bookings", icon: BookingsIcon, match: (p: string) => p.startsWith("/bookings") },
] as const;

export function Navbar() {
  const pathname = usePathname();
  const session = useUserStore((s) => s.session);
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

  const solid = scrolled || !isHeroRoute;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          solid
            ? "border-b border-border/80 bg-card/90 shadow-sm backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <PlaneIcon className="h-5 w-5" />
            </span>
            <span
              className={`text-lg font-bold tracking-tight ${
                solid ? "text-foreground" : "text-white drop-shadow-sm"
              }`}
            >
              Sky<span className="text-primary">ro</span>
            </span>
          </Link>

          <nav
            className="hidden items-center gap-1 md:flex"
            aria-label="Main navigation"
          >
            {NAV_ITEMS.map(({ href, label, icon: Icon, match }) => {
              const active = match(pathname);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                    active
                      ? "bg-primary/10 text-primary"
                      : solid
                        ? "text-muted hover:bg-surface hover:text-foreground"
                        : "text-white/90 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle
              className={
                solid ? "" : "border-white/30 bg-black/20 text-white hover:bg-black/30"
              }
            />

            <div className="hidden items-center gap-2 sm:flex">
              {session?.user ? (
                <>
                  <Link
                    href="/bookings"
                    className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium ${
                      solid
                        ? "text-foreground hover:bg-surface"
                        : "text-white hover:bg-white/10"
                    }`}
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                      {session.user.email?.[0]?.toUpperCase() ?? "U"}
                    </span>
                    <span className="max-w-[120px] truncate hidden lg:inline">
                      {session.user.email}
                    </span>
                  </Link>
                  <LogoutButton />
                </>
              ) : (
                <Link
                  href="/auth/login"
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
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
          className="fixed inset-0 z-[60] bg-black/40 md:hidden"
          aria-hidden
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile bottom sheet */}
      <div
        className={`fixed inset-x-0 bottom-0 z-[70] rounded-t-2xl border-t border-border bg-card p-6 shadow-2xl transition-transform duration-300 md:hidden ${
          mobileOpen ? "translate-y-0" : "translate-y-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border" />
        <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
          {NAV_ITEMS.map(({ href, label, icon: Icon, match }) => {
            const active = match(pathname);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium ${
                  active ? "bg-primary/10 text-primary" : "text-foreground hover:bg-surface"
                }`}
              >
                <Icon className="h-5 w-5" />
                {label}
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
