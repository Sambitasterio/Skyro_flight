"use client";

import { useActionState } from "react";

import { signIn, type AuthActionState } from "@/app/auth/actions";

const initialState: AuthActionState = { error: null };

interface LoginFormProps {
  redirectTo?: string;
  compact?: boolean;
}

export function LoginForm({
  redirectTo = "/",
  compact = false,
}: LoginFormProps) {
  const [state, formAction, isPending] = useActionState(signIn, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="redirectTo" value={redirectTo} />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium text-foreground">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none ring-primary focus:ring-2"
          placeholder="you@example.com"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="password"
          className="text-sm font-medium text-foreground"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none ring-primary focus:ring-2"
          placeholder="••••••••"
        />
      </div>

      {state.error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Signing in…" : compact ? "Log in" : "Sign in"}
      </button>
    </form>
  );
}
