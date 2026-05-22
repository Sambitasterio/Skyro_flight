import Link from "next/link";

export const metadata = {
  title: "Offline",
  description: "You are offline — Skyro",
};

export default function OfflinePage() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-md flex-1 flex-col items-center justify-center px-6 py-16 text-center">
      <p className="text-5xl" aria-hidden>
        ✈
      </p>
      <h1 className="mt-6 text-2xl font-bold text-foreground">
        You&apos;re offline
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        Skyro needs a connection for live flights and seat availability. Cached
        pages may still open — try again when you&apos;re back online.
      </p>
      <Link
        href="/"
        className="bg-primary text-primary-foreground mt-8 inline-block rounded-xl px-6 py-3 text-sm font-bold"
      >
        Back to home
      </Link>
    </main>
  );
}
