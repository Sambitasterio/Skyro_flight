import { HeroSection } from "@/components/landing/HeroSection";
import { TrendingDestinations } from "@/components/landing/TrendingDestinations";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <HeroSection />
      <TrendingDestinations />
    </main>
  );
}
