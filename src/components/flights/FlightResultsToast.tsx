"use client";

import { useEffect, useState } from "react";

interface FlightResultsToastProps {
  message: string | null;
}

export function FlightResultsToast({ message }: FlightResultsToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!message) {
      setVisible(false);
      return;
    }
    setVisible(true);
    const timer = window.setTimeout(() => setVisible(false), 6000);
    return () => window.clearTimeout(timer);
  }, [message]);

  if (!message || !visible) return null;

  return (
    <div
      className="fixed bottom-6 left-1/2 z-50 max-w-md -translate-x-1/2 px-4"
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-start gap-3 rounded-xl border border-red-500/40 bg-red-950/95 px-4 py-3 text-sm text-red-100 shadow-lg">
        <span className="font-bold" aria-hidden>
          !
        </span>
        <p className="flex-1">{message}</p>
        <button
          type="button"
          onClick={() => setVisible(false)}
          className="shrink-0 font-bold text-red-200 hover:text-white"
          aria-label="Dismiss"
        >
          ×
        </button>
      </div>
    </div>
  );
}
