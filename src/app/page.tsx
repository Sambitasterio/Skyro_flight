import Link from "next/link";

import { AuthStatusBar } from "@/components/auth/AuthStatusBar";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-24">
      <p className="rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
        Phase 2 — Auth wired
      </p>
      <h1 className="text-4xl font-bold tracking-tight">
        Sky<span className="text-primary">ro</span>
      </h1>
      <p className="max-w-md text-center text-muted">
        Login, signup, session refresh, and route protection are live. Landing
        page ships in Phase 3.
      </p>

      <AuthStatusBar />

      <div className="flex flex-wrap justify-center gap-3 text-sm">
        <Link href="/auth/login" className="text-primary underline">
          /auth/login
        </Link>
        <Link href="/auth/signup" className="text-primary underline">
          /auth/signup
        </Link>
        <Link href="/bookings" className="text-primary underline">
          /bookings (protected)
        </Link>
      </div>
    </main>
  );
}
