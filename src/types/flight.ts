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

/** Flight chosen on results page — persisted for seat selection. */
export interface SelectedFlight {
  id: string;
  flight_no: string;
  origin: string;
  destination: string;
  departs_at: string;
  arrives_at: string;
  aircraft_type: string;
  base_price: number;
  cabinClass: CabinClass;
  displayPrice: number;
}
