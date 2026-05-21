import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BookPassengerPage } from "@/components/booking/BookPassengerPage";
import { getFlightById } from "@/lib/flights/get-flight";

export const metadata: Metadata = {
  title: "Passenger details",
};

interface BookPageProps {
  params: Promise<{ flightId: string }>;
}

export default async function BookPage({ params }: BookPageProps) {
  const { flightId } = await params;

  let flight;
  try {
    flight = await getFlightById(flightId);
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

  return <BookPassengerPage flight={flight} flightId={flightId} />;
}
