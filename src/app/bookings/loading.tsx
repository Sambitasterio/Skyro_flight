export default function BookingsLoading() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <div className="h-8 w-48 animate-pulse rounded-lg bg-surface" />
      <div className="mt-6 h-11 animate-pulse rounded-xl bg-surface" />
      <ul className="mt-6 flex flex-col gap-4">
        {[1, 2, 3].map((i) => (
          <li
            key={i}
            className="h-28 animate-pulse rounded-2xl bg-surface md:h-24"
            aria-hidden
          />
        ))}
      </ul>
    </main>
  );
}
