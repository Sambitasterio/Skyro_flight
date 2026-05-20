export interface TrendingRoute {
  origin: string;
  destination: string;
  image: string;
  cityLabel: string;
  routeLabel: string;
  duration: string;
  priceFrom: number;
  tag: string;
}

/** Trending cards — images match `design/destinations/{goa,bengaluru,singapore,dubai}.jpg` */
export const TRENDING_ROUTES: TrendingRoute[] = [
  {
    origin: "DEL",
    destination: "GOA",
    image: "/hero/goa.jpg",
    cityLabel: "Goa",
    routeLabel: "DEL → GOA",
    duration: "2h 15m",
    priceFrom: 3200,
    tag: "Beach",
  },
  {
    origin: "BOM",
    destination: "BLR",
    image: "/hero/bengaluru.jpg",
    cityLabel: "Bengaluru",
    routeLabel: "BOM → BLR",
    duration: "1h 35m",
    priceFrom: 4100,
    tag: "Popular",
  },
  {
    origin: "DEL",
    destination: "SIN",
    image: "/hero/singapore.jpg",
    cityLabel: "Singapore",
    routeLabel: "DEL → SIN",
    duration: "5h 30m",
    priceFrom: 12500,
    tag: "International",
  },
  {
    origin: "DEL",
    destination: "DXB",
    image: "/hero/dubai.jpg",
    cityLabel: "Dubai",
    routeLabel: "DEL → DXB",
    duration: "3h 45m",
    priceFrom: 9800,
    tag: "Trending",
  },
];
