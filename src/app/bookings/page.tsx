import Link from "next/link";

export default function BookingsPlaceholderPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24">
      <h1 className="text-2xl font-bold">My Bookings</h1>
      <p className="text-muted">Protected route — you are authenticated.</p>
      <Link href="/" className="text-primary underline">
        Back home
      </Link>
    </main>
  );
}
