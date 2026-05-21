import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SeatSelectionPage } from "@/components/seats/SeatSelectionPage";
import { getFlightById } from "@/lib/flights/get-flight";

export const metadata: Metadata = {
  title: "Select seat",
};

interface SeatPageProps {
  params: Promise<{ id: string }>;
}

export default async function FlightSeatsPage({ params }: SeatPageProps) {
  const { id } = await params;

  let flight;
  try {
    flight = await getFlightById(id);
  } catch {
    return (
      <main className="mx-auto flex max-w-lg flex-1 flex-col gap-4 px-4 py-16 text-center">
        <p className="font-semibold text-foreground">Could not load flight</p>
        <Link href="/flights" className="text-primary text-sm font-semibold hover:underline">
          ← Back to results
        </Link>
      </main>
    );
  }

  if (!flight || flight.status === "cancelled") {
    notFound();
  }

  return <SeatSelectionPage flight={flight} flightId={id} />;
}
