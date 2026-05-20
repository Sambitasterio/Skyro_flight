import Link from "next/link";

interface FlightsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function FlightsPlaceholderPage({
  searchParams,
}: FlightsPageProps) {
  const params = await searchParams;
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== "",
  );

  return (
    <main className="mx-auto flex max-w-3xl flex-1 flex-col gap-6 px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-bold">Flight results</h1>
      <p className="text-muted">
        Search params received — full results list ships in Phase 4.
      </p>
      {entries.length > 0 ? (
        <ul className="rounded-xl border border-border bg-card p-4 text-sm">
          {entries.map(([key, value]) => (
            <li key={key} className="flex justify-between gap-4 py-1">
              <span className="font-medium text-foreground">{key}</span>
              <span className="text-muted">
                {Array.isArray(value) ? value.join(", ") : value}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted">No query parameters.</p>
      )}
      <Link href="/" className="text-primary font-medium hover:underline">
        ← Back to search
      </Link>
    </main>
  );
}
