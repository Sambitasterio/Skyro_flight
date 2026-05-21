/** In-memory passenger fields for booking step 3 (passport never persisted). */
export interface PassengerFormData {
  fullName: string;
  nationality: string;
  dob: string;
  passportNo: string;
}

export type PassengerFieldErrors = Partial<
  Record<keyof PassengerFormData, string>
>;
