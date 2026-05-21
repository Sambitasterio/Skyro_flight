"use client";

import { useEffect, useState } from "react";

type ToastVariant = "info" | "error";

interface AppToastProps {
  message: string | null;
  variant?: ToastVariant;
  onDismiss?: () => void;
  durationMs?: number;
}

const variantStyles: Record<ToastVariant, string> = {
  info: "border-amber-500/40 bg-amber-950/95 text-amber-50",
  error: "border-red-500/40 bg-red-950/95 text-red-100",
};

export function AppToast({
  message,
  variant = "info",
  onDismiss,
  durationMs = 5000,
}: AppToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!message) {
      setVisible(false);
      return;
    }
    setVisible(true);
    const timer = window.setTimeout(() => {
      setVisible(false);
      onDismiss?.();
    }, durationMs);
    return () => window.clearTimeout(timer);
  }, [message, durationMs, onDismiss]);

  if (!message || !visible) return null;

  return (
    <div
      className="fixed bottom-6 left-1/2 z-50 max-w-md -translate-x-1/2 px-4"
      role="status"
      aria-live="polite"
    >
      <div
        className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm shadow-lg ${variantStyles[variant]}`}
      >
        <p className="flex-1">{message}</p>
        <button
          type="button"
          onClick={() => {
            setVisible(false);
            onDismiss?.();
          }}
          className="shrink-0 font-bold opacity-80 hover:opacity-100"
          aria-label="Dismiss"
        >
          ×
        </button>
      </div>
    </div>
  );
}
