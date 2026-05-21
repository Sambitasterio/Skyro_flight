"use client";

import { useState } from "react";

interface CopyPnrButtonProps {
  pnr: string;
}

export function CopyPnrButton({ pnr }: CopyPnrButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(pnr);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={() => void handleCopy()}
      className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-foreground transition hover:border-primary/50 hover:text-primary"
    >
      {copied ? "Copied!" : "Copy PNR"}
    </button>
  );
}
