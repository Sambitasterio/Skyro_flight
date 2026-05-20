export type TripType = "oneway" | "round";

export type CabinClass = "economy" | "business" | "first";

export type BookingStep = 1 | 2 | 3 | 4;

export interface SearchQuery {
  origin: string;
  destination: string;
  departDate: string;
  returnDate: string;
  passengerCount: number;
  cabinClass: CabinClass;
  tripType: TripType;
}

export interface Airport {
  code: string;
  city: string;
  name: string;
}
