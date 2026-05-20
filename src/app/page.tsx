export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24">
      <p className="rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
        Phase 0 complete
      </p>
      <h1 className="text-4xl font-bold tracking-tight">
        Sky<span className="text-primary">ro</span>
      </h1>
      <p className="max-w-md text-center text-muted">
        Flight management scaffold is running. Landing page ships in Phase 3.
      </p>
    </main>
  );
}
