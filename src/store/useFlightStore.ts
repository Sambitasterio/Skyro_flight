import { create } from "zustand";
import { persist } from "zustand/middleware";

import type {
  BookingStep,
  CabinClass,
  SearchQuery,
  SelectedFlight,
  SelectedSeat,
  TripType,
} from "@/types/flight";

function defaultDepartDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d.toISOString().slice(0, 10);
}

function defaultReturnDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 14);
  return d.toISOString().slice(0, 10);
}

export const defaultSearchQuery: SearchQuery = {
  origin: "DEL",
  destination: "BOM",
  departDate: defaultDepartDate(),
  returnDate: defaultReturnDate(),
  passengerCount: 1,
  cabinClass: "economy",
  tripType: "oneway",
};

interface PassengerForm {
  fullName: string;
  nationality: string;
  dob: string;
  passportNo: string;
}

interface FlightState {
  searchQuery: SearchQuery;
  selectedFlight: SelectedFlight | null;
  selectedSeat: SelectedSeat | null;
  bookingStep: BookingStep;
  passengerForm: PassengerForm;
  setSearchQuery: (query: Partial<SearchQuery>) => void;
  setSelectedFlight: (flight: SelectedFlight | null) => void;
  setSelectedSeat: (seat: SelectedSeat | null) => void;
  setBookingStep: (step: BookingStep) => void;
  setPassengerForm: (form: Partial<PassengerForm>) => void;
  resetBooking: () => void;
}

const defaultPassengerForm: PassengerForm = {
  fullName: "",
  nationality: "",
  dob: "",
  passportNo: "",
};

export const useFlightStore = create<FlightState>()(
  persist(
    (set) => ({
      searchQuery: defaultSearchQuery,
      selectedFlight: null,
      selectedSeat: null,
      bookingStep: 1,
      passengerForm: defaultPassengerForm,
      setSearchQuery: (query) =>
        set((state) => ({
          searchQuery: { ...state.searchQuery, ...query },
        })),
      setSelectedFlight: (selectedFlight) =>
        set((state) => ({
          selectedFlight,
          selectedSeat:
            selectedFlight === null || state.selectedSeat?.flight_id !== selectedFlight?.id
              ? null
              : state.selectedSeat,
        })),
      setSelectedSeat: (selectedSeat) => set({ selectedSeat }),
      setBookingStep: (bookingStep) => set({ bookingStep }),
      setPassengerForm: (form) =>
        set((state) => ({
          passengerForm: { ...state.passengerForm, ...form },
        })),
      resetBooking: () =>
        set({
          selectedFlight: null,
          selectedSeat: null,
          bookingStep: 1,
          passengerForm: defaultPassengerForm,
        }),
    }),
    {
      name: "flight-store",
      partialize: (state) => ({
        searchQuery: state.searchQuery,
        selectedFlight: state.selectedFlight,
        selectedSeat: state.selectedSeat,
        bookingStep: state.bookingStep,
      }),
    },
  ),
);
