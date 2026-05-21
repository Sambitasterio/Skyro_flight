import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { BookingConfirmationPage } from "@/components/booking/BookingConfirmationPage";
import { getBookingByPnr } from "@/lib/booking/get-booking-by-pnr";
import { createClient } from "@/lib/supabase/server";

export async function generateMetadata({
  params,
}: BookingConfirmationRouteProps): Promise<Metadata> {
  const { pnr } = await params;
  return {
    title: `Confirmed · ${pnr.toUpperCase()}`,
  };
}

interface BookingConfirmationRouteProps {
  params: Promise<{ pnr: string }>;
}

export default async function BookingConfirmationRoute({
  params,
}: BookingConfirmationRouteProps) {
  const { pnr } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/auth/login?next=${encodeURIComponent(`/booking/${pnr}`)}`);
  }

  const booking = await getBookingByPnr(pnr);

  if (!booking) {
    return (
      <main className="mx-auto flex max-w-lg flex-1 flex-col gap-4 px-4 py-16 text-center">
        <p className="font-semibold text-foreground">Booking not found</p>
        <p className="text-sm text-muted">
          Check the PNR or complete passenger details first.
        </p>
        <Link href="/bookings" className="text-primary text-sm font-semibold hover:underline">
          My Bookings
        </Link>
      </main>
    );
  }

  if (booking.status === "cancelled") {
    notFound();
  }

  return <BookingConfirmationPage booking={booking} />;
}
