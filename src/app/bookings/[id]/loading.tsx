export default function BookingDetailLoading() {
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 sm:px-6">
      <div className="h-4 w-32 animate-pulse rounded bg-surface" />
      <div className="mt-6 h-10 w-48 animate-pulse rounded-lg bg-surface" />
      <div className="mt-6 h-48 animate-pulse rounded-2xl bg-surface" />
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="h-40 animate-pulse rounded-2xl bg-surface" />
        <div className="h-40 animate-pulse rounded-2xl bg-surface" />
      </div>
    </main>
  );
}
