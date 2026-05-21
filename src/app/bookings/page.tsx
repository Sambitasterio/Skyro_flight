import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { MyBookingsPage } from "@/components/bookings/MyBookingsPage";
import { loadUserBookings } from "@/lib/bookings/load-user-bookings";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "My Bookings",
};

export default async function BookingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/auth/login?next=${encodeURIComponent("/bookings")}`);
  }

  const bookings = await loadUserBookings();

  return <MyBookingsPage bookings={bookings} />;
}
