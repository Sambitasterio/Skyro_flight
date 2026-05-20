import Link from "next/link";
import { redirect } from "next/navigation";

import { sanitizeRedirectPath } from "@/lib/auth/routes";
import { createClient } from "@/lib/supabase/server";
import { SignupForm } from "@/components/auth/SignupForm";

interface SignupPageProps {
  searchParams: Promise<{ next?: string }>;
}

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const params = await searchParams;
  const nextPath = sanitizeRedirectPath(params.next);
  const loginRedirect = nextPath === "/" ? "/auth/login" : `/auth/login?next=${encodeURIComponent(nextPath)}`;

  if (user) {
    redirect(nextPath);
  }

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm">
        <div className="mb-6 text-center">
          <Link href="/" className="text-2xl font-bold text-foreground">
            Sky<span className="text-primary">ro</span>
          </Link>
          <h1 className="mt-4 text-xl font-semibold">Create your account</h1>
          <p className="mt-1 text-sm text-muted">
            Sign up to select seats and manage bookings
          </p>
        </div>

        <SignupForm redirectTo={loginRedirect} />

        <p className="mt-6 text-center text-sm text-muted">
          Already have an account?{" "}
          <Link
            href={loginRedirect}
            className="font-medium text-primary"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
