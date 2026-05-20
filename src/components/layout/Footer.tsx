import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
        <p className="text-sm text-muted">
          © {new Date().getFullYear()} Skyro. All rights reserved.
        </p>
        <nav
          className="flex flex-wrap items-center justify-center gap-6 text-sm"
          aria-label="Footer"
        >
          <Link
            href="/"
            className="rounded-md text-muted transition hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Search flights
          </Link>
          <Link
            href="/bookings"
            className="rounded-md text-muted transition hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            My bookings
          </Link>
          <Link
            href="/auth/login"
            className="rounded-md text-muted transition hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Log in
          </Link>
        </nav>
      </div>
    </footer>
  );
}
