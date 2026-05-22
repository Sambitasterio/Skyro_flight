"use client";

import { useEffect } from "react";

/**
 * next-pwa injects its register script into `main.js` (Pages Router).
 * Next.js 16 App Router uses `main-app.js`, so we register `/sw.js` here in production.
 */
export function PwaRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    void navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch((err) => {
      console.error("[PWA] Service worker registration failed:", err);
    });
  }, []);

  return null;
}
