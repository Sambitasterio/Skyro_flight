"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

import {
  HERO_FADE_MS,
  HERO_IMAGES,
  HERO_ROTATE_MS,
} from "@/lib/hero/images";

interface HeroBackgroundProps {
  className?: string;
}

export function HeroBackground({ className = "" }: HeroBackgroundProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const handler = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const goNext = useCallback(() => {
    setActiveIndex((i) => (i + 1) % HERO_IMAGES.length);
  }, []);

  useEffect(() => {
    if (reduceMotion || HERO_IMAGES.length <= 1) return;

    const preload = (index: number) => {
      const img = new window.Image();
      img.src = HERO_IMAGES[index].src;
    };

    preload((activeIndex + 1) % HERO_IMAGES.length);

    let intervalId: ReturnType<typeof setInterval> | undefined;

    const start = () => {
      intervalId = setInterval(goNext, HERO_ROTATE_MS);
    };

    const stop = () => {
      if (intervalId) clearInterval(intervalId);
      intervalId = undefined;
    };

    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        stop();
      } else {
        stop();
        start();
      }
    };

    start();
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [activeIndex, goNext, reduceMotion]);

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      {HERO_IMAGES.map((image, index) => {
        const isActive = index === activeIndex;
        return (
          <div
            key={image.src}
            className="absolute inset-0 transition-opacity ease-in-out"
            style={{
              opacity: isActive ? 1 : 0,
              transitionDuration: `${HERO_FADE_MS}ms`,
              zIndex: isActive ? 1 : 0,
            }}
          >
            <Image
              src={image.src}
              alt={reduceMotion && index === 0 ? image.alt : ""}
              fill
              priority={index === 0}
              sizes="100vw"
              className={`object-cover brightness-110 saturate-110 ${
                isActive && !reduceMotion ? "animate-hero-ken-burns" : ""
              }`}
            />
          </div>
        );
      })}

      {/* Lighter gradient — photos show through more while keeping text readable */}
      <div
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{ background: "var(--hero-overlay)" }}
      />
    </div>
  );
}
