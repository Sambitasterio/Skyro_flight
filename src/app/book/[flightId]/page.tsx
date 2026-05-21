import type { Metadata } from "next";

import { BookPassengerPlaceholder } from "@/components/booking/BookPassengerPlaceholder";

export const metadata: Metadata = {
  title: "Passenger details",
};

interface BookPageProps {
  params: Promise<{ flightId: string }>;
}

export default async function BookPage({ params }: BookPageProps) {
  const { flightId } = await params;
  return <BookPassengerPlaceholder flightId={flightId} />;
}
