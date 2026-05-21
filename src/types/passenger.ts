/** Government ID types accepted on domestic-heavy routes (India-first). */
export type GovernmentDocumentType =
  | "aadhaar"
  | "passport"
  | "voter_id"
  | "driving_license"
  | "other";

/** In-memory passenger fields — ID number never persisted to localStorage. */
export interface PassengerFormData {
  fullName: string;
  nationality: string;
  dob: string;
  documentType: GovernmentDocumentType;
  documentNumber: string;
}

export type PassengerFieldErrors = Partial<
  Record<keyof PassengerFormData, string>
>;
