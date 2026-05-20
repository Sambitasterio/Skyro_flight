export interface HeroImage {
  src: string;
  alt: string;
}

/** Hero rotation — route destination photos + legacy scenic fallbacks */
export const HERO_IMAGES: HeroImage[] = [
  { src: "/hero/goa.jpg", alt: "Goa beaches and coastline" },
  { src: "/hero/bengaluru.jpg", alt: "Bengaluru city skyline" },
  { src: "/hero/singapore.jpg", alt: "Singapore Marina Bay" },
  { src: "/hero/dubai.jpg", alt: "Dubai skyline" },
  { src: "/hero/santorini.jpg", alt: "Scenic travel destination" },
  { src: "/hero/travel-1.jpg", alt: "Mountain landscape" },
];

/** Crossfade interval (ms) — time each photo stays visible */
export const HERO_ROTATE_MS = 12000;

/** Opacity transition duration (ms) */
export const HERO_FADE_MS = 1500;
