import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { BookingDetailPage } from "@/components/bookings/BookingDetailPage";
import { loadBookingById } from "@/lib/bookings/load-booking-by-id";
import { createClient } from "@/lib/supabase/server";

interface BookingDetailRouteProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: BookingDetailRouteProps): Promise<Metadata> {
  const { id } = await params;
  const booking = await loadBookingById(id);
  return {
    title: booking ? `Booking ${booking.pnr_code}` : "Booking details",
  };
}

export default async function BookingDetailRoute({
  params,
}: BookingDetailRouteProps) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/auth/login?next=${encodeURIComponent(`/bookings/${id}`)}`);
  }

  const booking = await loadBookingById(id);

  if (!booking) {
    return (
      <main className="mx-auto flex max-w-lg flex-1 flex-col gap-4 px-4 py-16 text-center">
        <p className="font-semibold text-foreground">Booking not found</p>
        <Link
          href="/bookings"
          className="text-primary text-sm font-semibold hover:underline"
        >
          ← My Bookings
        </Link>
      </main>
    );
  }

  return <BookingDetailPage booking={booking} />;
}
