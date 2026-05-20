import { HeroBackground } from "@/components/landing/HeroBackground";
import { FlightSearchCard } from "@/components/search/FlightSearchCard";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="relative -mt-16 flex min-h-[min(720px,85vh)] flex-col items-center justify-center overflow-hidden px-4 pb-16 pt-24 sm:px-6">
        <HeroBackground />

        <div className="relative z-10 mx-auto w-full max-w-5xl text-center">
          <p className="mb-3 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1 text-sm font-medium text-white/90 backdrop-blur-sm">
            500+ destinations worldwide
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Millions of flights.{" "}
            <span className="bg-gradient-to-r from-indigo-300 to-violet-300 bg-clip-text text-transparent">
              One simple search.
            </span>
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-sm text-white/75 sm:text-base">
            Compare fares across India — no login required to search.
          </p>
          <div className="mt-8 text-left">
            <FlightSearchCard />
          </div>
        </div>
      </section>
    </main>
  );
}
