import Link from "next/link";

export default function SeatSelectionNotFound() {
  return (
    <main className="mx-auto flex max-w-lg flex-1 flex-col gap-4 px-4 py-16 text-center">
      <h1 className="text-2xl font-bold text-foreground">Flight not found</h1>
      <p className="text-sm text-muted">
        This flight may have been removed. Search again for available routes.
      </p>
      <Link
        href="/flights"
        className="text-primary text-sm font-semibold hover:underline"
      >
        ← Back to search results
      </Link>
    </main>
  );
}
