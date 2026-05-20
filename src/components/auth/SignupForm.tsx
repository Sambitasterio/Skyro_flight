"use client";

import { useActionState } from "react";

import { signUp, type AuthActionState } from "@/app/auth/actions";

const initialState: AuthActionState = { error: null };

interface SignupFormProps {
  redirectTo?: string;
  compact?: boolean;
}

export function SignupForm({
  redirectTo = "/auth/login",
  compact = false,
}: SignupFormProps) {
  const [state, formAction, isPending] = useActionState(signUp, initialState);

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
          autoComplete="new-password"
          required
          minLength={6}
          className="rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none ring-primary focus:ring-2"
          placeholder="At least 6 characters"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="confirmPassword"
          className="text-sm font-medium text-foreground"
        >
          Confirm password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          minLength={6}
          className="rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none ring-primary focus:ring-2"
          placeholder="Repeat password"
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
        {isPending ? "Creating account…" : compact ? "Sign up" : "Create account"}
      </button>
    </form>
  );
}
