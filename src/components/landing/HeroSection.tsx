import { HeroBackground } from "@/components/landing/HeroBackground";
import { FlightSearchCard } from "@/components/search/FlightSearchCard";

export function HeroSection() {
  return (
    <section
      className="relative -mt-16 flex min-h-[100svh] flex-col justify-center overflow-hidden px-4 pb-12 pt-28 sm:px-6 sm:pb-16 sm:pt-32 lg:min-h-screen lg:pb-20"
      aria-label="Search flights"
    >
      <HeroBackground />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center">
        {/* Hero copy — Skyscanner-style, search-first */}
        <div className="w-full text-center">
          <p className="mb-4 inline-flex rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-sm font-medium text-white/95 backdrop-blur-md">
            500+ destinations worldwide
          </p>

          <h1 className="text-[clamp(1.75rem,5vw,3.25rem)] font-bold leading-[1.15] tracking-tight text-white">
            Find your next flight with{" "}
            <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-indigo-200 bg-clip-text text-transparent">
              Skyro
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-[clamp(0.875rem,2vw,1.125rem)] leading-relaxed text-white/80">
            Compare fares across India and beyond — search and browse without
            signing in.
          </p>
        </div>

        {/* Floating search card — ixigo / Skyscanner composition */}
        <div className="mt-8 w-full max-w-full sm:mt-10">
          <FlightSearchCard className="mx-auto w-full" />
        </div>
      </div>
    </section>
  );
}
