"use client";

import { useState } from "react";

import { useUserStore } from "@/store/useUserStore";

interface BookingEmailReceiptProps {
  pnr: string;
}

/** Demo-only email receipt — no backend (Phase 6.5). */
export function BookingEmailReceipt({ pnr }: BookingEmailReceiptProps) {
  const sessionEmail = useUserStore((s) => s.session?.user?.email ?? "");
  const [email, setEmail] = useState(sessionEmail);
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes("@")) return;
    setSent(true);
  };

  return (
    <section
      className="no-print rounded-2xl border border-dashed border-border bg-card/50 p-5"
      aria-label="Email confirmation"
    >
      <div className="flex items-start gap-3">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-lg"
          aria-hidden
        >
          ✉
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-bold text-foreground">Email itinerary</h2>
          <p className="mt-1 text-xs text-muted">
            Optional demo — no email is sent from this app yet.
          </p>

          {sent ? (
            <p
              className="mt-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300"
              role="status"
            >
              Demo: confirmation for{" "}
              <span className="font-mono font-semibold">{pnr}</span> would be
              sent to <strong>{email}</strong>.
            </p>
          ) : (
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="min-w-0 flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none ring-primary focus:ring-2"
              />
              <button
                type="button"
                onClick={handleSend}
                className="shrink-0 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-semibold text-foreground transition hover:border-primary/50 hover:text-primary"
              >
                Send confirmation
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
