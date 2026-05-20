"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { TRENDING_ROUTES } from "@/lib/landing/trending-routes";
import { buildFlightsSearchUrl } from "@/lib/search/build-flights-url";
import { defaultSearchQuery, useFlightStore } from "@/store/useFlightStore";

function formatInr(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function TrendingDestinations() {
  const router = useRouter();
  const searchQuery = useFlightStore((s) => s.searchQuery);
  const setSearchQuery = useFlightStore((s) => s.setSearchQuery);

  const handleRouteClick = (origin: string, destination: string) => {
    const query = {
      ...searchQuery,
      origin,
      destination,
      tripType: "oneway" as const,
      departDate: searchQuery.departDate || defaultSearchQuery.departDate,
    };
    setSearchQuery(query);
    router.push(buildFlightsSearchUrl(query));
  };

  return (
    <section
      className="border-t border-border bg-background px-4 py-14 sm:px-6 sm:py-16 lg:py-20"
      aria-labelledby="trending-heading"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-2 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2
              id="trending-heading"
              className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
            >
              Trending destinations
            </h2>
            <p className="mt-1 text-sm text-muted sm:text-base">
              Popular routes — tap a card to search flights instantly
            </p>
          </div>
        </div>

        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TRENDING_ROUTES.map((route) => (
            <li key={route.routeLabel}>
              <button
                type="button"
                onClick={() =>
                  handleRouteClick(route.origin, route.destination)
                }
                className="group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-border bg-card text-left shadow-sm transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={route.image}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">
                    {route.tag}
                  </span>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-3 pb-3 pt-10">
                    <p className="text-lg font-bold text-white">{route.cityLabel}</p>
                    <p className="text-xs text-white/85">{route.routeLabel}</p>
                  </div>
                </div>

                <div className="flex flex-1 items-center justify-between gap-2 px-4 py-3">
                  <div>
                    <p className="text-xs text-muted">{route.duration}</p>
                    <p className="text-sm font-semibold text-foreground">
                      From {formatInr(route.priceFrom)}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-primary opacity-0 transition group-hover:opacity-100">
                    Search →
                  </span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
