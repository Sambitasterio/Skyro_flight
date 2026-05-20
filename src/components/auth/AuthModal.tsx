"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { createClient } from "@/lib/supabase/client";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";

type AuthMode = "login" | "signup";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  redirectTo?: string;
  initialMode?: AuthMode;
}

export function AuthModal({
  open,
  onClose,
  redirectTo = "/",
  initialMode = "login",
}: AuthModalProps) {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>(initialMode);

  useEffect(() => {
    if (open) {
      setMode(initialMode);
    }
  }, [open, initialMode]);

  useEffect(() => {
    if (!open) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;

    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        onClose();
        router.refresh();
      }
    });

    return () => subscription.unsubscribe();
  }, [open, onClose, router]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button
        type="button"
        aria-label="Close auth modal"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-md rounded-t-2xl bg-card p-6 shadow-xl sm:rounded-2xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-primary">Skyro account</p>
            <h2 className="text-xl font-bold text-foreground">
              {mode === "login" ? "Welcome back" : "Create your account"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-muted hover:bg-surface"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="mb-6 flex rounded-lg bg-surface p-1">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition ${
              mode === "login"
                ? "bg-card text-primary shadow-sm"
                : "text-muted"
            }`}
          >
            Log in
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition ${
              mode === "signup"
                ? "bg-card text-primary shadow-sm"
                : "text-muted"
            }`}
          >
            Sign up
          </button>
        </div>

        {mode === "login" ? (
          <LoginForm redirectTo={redirectTo} compact />
        ) : (
          <SignupForm redirectTo={redirectTo} compact />
        )}

        <p className="mt-4 text-center text-sm text-muted">
          {mode === "login" ? (
            <>
              Need an account?{" "}
              <button
                type="button"
                onClick={() => setMode("signup")}
                className="font-medium text-primary"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("login")}
                className="font-medium text-primary"
              >
                Log in
              </button>
            </>
          )}
        </p>

        <p className="mt-3 text-center text-xs text-muted">
          Full page:{" "}
          <Link href="/auth/login" className="text-primary underline">
            /auth/login
          </Link>
        </p>
      </div>
    </div>
  );
}
