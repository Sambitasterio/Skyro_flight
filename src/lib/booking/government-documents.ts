import type { GovernmentDocumentType } from "@/types/passenger";

export const GOVERNMENT_DOCUMENT_OPTIONS: {
  value: GovernmentDocumentType;
  label: string;
  hint: string;
  placeholder: string;
}[] = [
  {
    value: "aadhaar",
    label: "Aadhaar",
    hint: "12-digit UID — usual for domestic flights in India",
    placeholder: "1234 5678 9012",
  },
  {
    value: "passport",
    label: "Passport",
    hint: "For international routes or NRIs",
    placeholder: "A1234567",
  },
  {
    value: "voter_id",
    label: "Voter ID (EPIC)",
    hint: "Election Photo Identity Card",
    placeholder: "ABC1234567",
  },
  {
    value: "driving_license",
    label: "Driving licence",
    hint: "Valid government-issued licence number",
    placeholder: "DL-01234567890123",
  },
  {
    value: "other",
    label: "Other government ID",
    hint: "PAN, service ID, etc.",
    placeholder: "ID number",
  },
];

export function documentOption(type: GovernmentDocumentType) {
  return (
    GOVERNMENT_DOCUMENT_OPTIONS.find((o) => o.value === type) ??
    GOVERNMENT_DOCUMENT_OPTIONS[0]
  );
}
