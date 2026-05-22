import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { ActiveBooking } from "@/types/booking";
import type {
  BookingStep,
  SearchQuery,
  SelectedFlight,
  SelectedSeat,
} from "@/types/flight";
import type { PassengerFormData } from "@/types/passenger";

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

interface FlightState {
  searchQuery: SearchQuery;
  selectedFlight: SelectedFlight | null;
  selectedSeat: SelectedSeat | null;
  activeBooking: ActiveBooking | null;
  bookingStep: BookingStep;
  passengerForm: PassengerFormData;
  setSearchQuery: (query: Partial<SearchQuery>) => void;
  setSelectedFlight: (flight: SelectedFlight | null) => void;
  setSelectedSeat: (seat: SelectedSeat | null) => void;
  setActiveBooking: (booking: ActiveBooking | null) => void;
  setBookingStep: (step: BookingStep) => void;
  setPassengerForm: (form: Partial<PassengerFormData>) => void;
  /** Clears in-progress booking; keeps `searchQuery` for the next search. */
  resetBooking: () => void;
}

const defaultPassengerForm: PassengerFormData = {
  fullName: "",
  nationality: "Indian",
  dob: "",
  documentType: "aadhaar",
  documentNumber: "",
};

export const useFlightStore = create<FlightState>()(
  persist(
    (set) => ({
      searchQuery: defaultSearchQuery,
      selectedFlight: null,
      selectedSeat: null,
      activeBooking: null,
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
            selectedFlight === null ||
            state.selectedSeat?.flight_id !== selectedFlight?.id
              ? null
              : state.selectedSeat,
        })),
      setSelectedSeat: (selectedSeat) => set({ selectedSeat }),
      setActiveBooking: (activeBooking) => set({ activeBooking }),
      setBookingStep: (bookingStep) => set({ bookingStep }),
      setPassengerForm: (form) =>
        set((state) => ({
          passengerForm: { ...state.passengerForm, ...form },
        })),
      resetBooking: () =>
        set({
          selectedFlight: null,
          selectedSeat: null,
          activeBooking: null,
          bookingStep: 1,
          passengerForm: defaultPassengerForm,
        }),
    }),
    {
      name: "flight-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        searchQuery: state.searchQuery,
        selectedFlight: state.selectedFlight,
        selectedSeat: state.selectedSeat,
        activeBooking: state.activeBooking,
        bookingStep: state.bookingStep,
      }),
    },
  ),
);
