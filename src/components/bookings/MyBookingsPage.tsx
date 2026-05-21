"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { BookingCard } from "@/components/bookings/BookingCard";
import {
  filterBookingsByTab,
  type BookingTab,
} from "@/lib/bookings/booking-filters";
import type { UserBookingItem } from "@/lib/bookings/load-user-bookings";

const TABS: { id: BookingTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "upcoming", label: "Upcoming" },
  { id: "past", label: "Past" },
  { id: "cancelled", label: "Cancelled" },
];

interface MyBookingsPageProps {
  bookings: UserBookingItem[];
}

export function MyBookingsPage({ bookings }: MyBookingsPageProps) {
  const [tab, setTab] = useState<BookingTab>("all");

  const filtered = useMemo(
    () => filterBookingsByTab(bookings, tab),
    [bookings, tab],
  );

  const tabCounts = useMemo(() => {
    const counts: Record<BookingTab, number> = {
      all: bookings.length,
      upcoming: filterBookingsByTab(bookings, "upcoming").length,
      past: filterBookingsByTab(bookings, "past").length,
      cancelled: filterBookingsByTab(bookings, "cancelled").length,
    };
    return counts;
  }, [bookings]);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6 sm:py-10">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          My Bookings
        </h1>
        <p className="mt-1 text-sm text-muted">
          Tap a trip for details · reschedule and cancel coming next.
        </p>
      </header>

      <div
        className="flex gap-1 overflow-x-auto rounded-xl border border-border bg-surface p-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="tablist"
        aria-label="Filter bookings"
      >
        {TABS.map(({ id, label }) => {
          const active = tab === id;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(id)}
              className={`shrink-0 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted hover:bg-card hover:text-foreground"
              }`}
            >
              {label}
              <span
                className={`ml-1.5 tabular-nums ${active ? "opacity-90" : "opacity-60"}`}
              >
                ({tabCounts[id]})
              </span>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
          <p className="font-medium text-foreground">No bookings here</p>
          <p className="mt-2 text-sm text-muted">
            {tab === "all"
              ? "Book a flight to see it listed."
              : `No ${tab} bookings right now.`}
          </p>
          <Link
            href="/"
            className="bg-primary text-primary-foreground mt-6 inline-block rounded-xl px-5 py-2.5 text-sm font-bold"
          >
            Search flights
          </Link>
        </div>
      ) : (
        <ul className="flex flex-col gap-3 sm:gap-4">
          {filtered.map((booking) => (
            <li key={booking.id}>
              <BookingCard booking={booking} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
