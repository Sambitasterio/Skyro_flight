import { maskDocumentNumber } from "@/lib/booking/validate-passenger";

const TYPE_LABELS: Record<string, string> = {
  AADHAAR: "Aadhaar",
  PASSPORT: "Passport",
  VOTER_ID: "Voter ID",
  DRIVING_LICENSE: "Driving licence",
  OTHER: "Government ID",
};

/** Parse `passengers.passport_no` stored as `TYPE:number`. */
export function formatStoredDocument(passportNo: string): {
  typeLabel: string;
  maskedNumber: string;
} {
  const colon = passportNo.indexOf(":");
  if (colon === -1) {
    return {
      typeLabel: "Government ID",
      maskedNumber: maskDocumentNumber(passportNo),
    };
  }

  const prefix = passportNo.slice(0, colon).toUpperCase();
  const number = passportNo.slice(colon + 1);

  return {
    typeLabel: TYPE_LABELS[prefix] ?? "Government ID",
    maskedNumber: maskDocumentNumber(number),
  };
}
