/** Common nationalities for the booking form select. */
export const NATIONALITIES = [
  "Indian",
  "American",
  "British",
  "Canadian",
  "Australian",
  "Singaporean",
  "Emirati",
  "German",
  "French",
  "Japanese",
  "Other",
] as const;

export type Nationality = (typeof NATIONALITIES)[number];
