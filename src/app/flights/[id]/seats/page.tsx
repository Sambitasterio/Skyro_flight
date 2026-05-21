import Link from "next/link";

interface SeatPageProps {
  params: Promise<{ id: string }>;
}

export default async function FlightSeatsPlaceholderPage({
  params,
}: SeatPageProps) {
  const { id } = await params;

  return (
    <main className="mx-auto flex max-w-lg flex-1 flex-col gap-6 px-4 py-16 text-center sm:px-6">
      <h1 className="text-2xl font-bold text-foreground">Select your seat</h1>
      <p className="text-muted text-sm">
        Flight <span className="font-mono text-foreground">{id}</span> saved in
        your session. Visual seat map ships in Phase 5.
      </p>
      <Link
        href="/flights"
        className="text-primary font-semibold hover:underline"
      >
        ← Back to results
      </Link>
    </main>
  );
}
