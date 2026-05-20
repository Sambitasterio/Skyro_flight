import { HeroSection } from "@/components/landing/HeroSection";
import { OffersSection } from "@/components/landing/OffersSection";
import { StatsBar } from "@/components/landing/StatsBar";
import { TrendingDestinations } from "@/components/landing/TrendingDestinations";
import { WhySkyro } from "@/components/landing/WhySkyro";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <HeroSection />
      <StatsBar />
      <TrendingDestinations />
      <WhySkyro />
      <OffersSection />
    </main>
  );
}
