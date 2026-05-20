export interface HeroImage {
  src: string;
  alt: string;
}

export const HERO_IMAGES: HeroImage[] = [
  { src: "/hero/santorini.jpg", alt: "Santorini village at sunset" },
  { src: "/hero/london.jpg", alt: "London Tower Bridge" },
  { src: "/hero/travel-1.jpg", alt: "Mountain travel destination" },
  { src: "/hero/travel-2.jpg", alt: "Scenic travel landscape" },
  { src: "/hero/travel-3.jpg", alt: "Coastal travel destination" },
  { src: "/hero/travel-4.jpg", alt: "Adventure travel scenery" },
];

/** Crossfade interval (ms) — time each photo stays visible */
export const HERO_ROTATE_MS = 12000;

/** Opacity transition duration (ms) */
export const HERO_FADE_MS = 1500;
