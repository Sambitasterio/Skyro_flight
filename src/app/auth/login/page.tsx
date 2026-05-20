import Link from "next/link";
import { redirect } from "next/navigation";

import { sanitizeRedirectPath } from "@/lib/auth/routes";
import { createClient } from "@/lib/supabase/server";
import { LoginForm } from "@/components/auth/LoginForm";

interface LoginPageProps {
  searchParams: Promise<{ next?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const params = await searchParams;
  const redirectTo = sanitizeRedirectPath(params.next);

  if (user) {
    redirect(redirectTo);
  }

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm">
        <div className="mb-6 text-center">
          <Link href="/" className="text-2xl font-bold text-foreground">
            Sky<span className="text-primary">ro</span>
          </Link>
          <h1 className="mt-4 text-xl font-semibold">Sign in to your account</h1>
          <p className="mt-1 text-sm text-muted">
            Continue your booking or manage trips
          </p>
        </div>

        <LoginForm redirectTo={redirectTo} />

        <p className="mt-6 text-center text-sm text-muted">
          Don&apos;t have an account?{" "}
          <Link
            href={`/auth/signup${redirectTo !== "/" ? `?next=${encodeURIComponent(redirectTo)}` : ""}`}
            className="font-medium text-primary"
          >
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
