import type {
  GovernmentDocumentType,
  PassengerFieldErrors,
  PassengerFormData,
} from "@/types/passenger";

const PASSPORT_PATTERN = /^[A-Z0-9]{6,12}$/i;
const AADHAAR_PATTERN = /^\d{12}$/;
const GENERIC_ID_PATTERN = /^[A-Z0-9\-]{6,20}$/i;

function normalizeDocumentNumber(
  type: GovernmentDocumentType,
  raw: string,
): string {
  const trimmed = raw.trim();
  if (type === "aadhaar") {
    return trimmed.replace(/\s/g, "");
  }
  return trimmed.toUpperCase();
}

function validateDocumentNumber(
  type: GovernmentDocumentType,
  raw: string,
): string | undefined {
  const value = normalizeDocumentNumber(type, raw);
  if (!value) {
    return "ID number is required";
  }

  switch (type) {
    case "aadhaar":
      if (!AADHAAR_PATTERN.test(value)) {
        return "Enter a valid 12-digit Aadhaar number";
      }
      break;
    case "passport":
      if (!PASSPORT_PATTERN.test(value)) {
        return "Use 6–12 letters or numbers";
      }
      break;
    case "voter_id":
    case "driving_license":
    case "other":
      if (!GENERIC_ID_PATTERN.test(value)) {
        return "Use 6–20 letters, numbers, or hyphens";
      }
      break;
  }

  return undefined;
}

export function validatePassengerForm(
  form: PassengerFormData,
): PassengerFieldErrors {
  const errors: PassengerFieldErrors = {};

  const fullName = form.fullName.trim();
  if (!fullName) {
    errors.fullName = "Full name is required";
  } else if (fullName.length < 2) {
    errors.fullName = "Enter at least 2 characters";
  } else if (!/^[\p{L}\s.'-]+$/u.test(fullName)) {
    errors.fullName = "Use letters and spaces only";
  }

  if (!form.nationality.trim()) {
    errors.nationality = "Select a nationality";
  }

  if (!form.dob) {
    errors.dob = "Date of birth is required";
  } else {
    const dob = new Date(form.dob);
    if (Number.isNaN(dob.getTime())) {
      errors.dob = "Enter a valid date";
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (dob >= today) {
        errors.dob = "Date of birth must be in the past";
      } else {
        const age =
          today.getFullYear() -
          dob.getFullYear() -
          (today < new Date(today.getFullYear(), dob.getMonth(), dob.getDate())
            ? 1
            : 0);
        if (age < 1 || age > 120) {
          errors.dob = "Enter a realistic date of birth";
        }
      }
    }
  }

  const docError = validateDocumentNumber(
    form.documentType,
    form.documentNumber,
  );
  if (docError) {
    errors.documentNumber = docError;
  }

  return errors;
}

export function hasPassengerErrors(errors: PassengerFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

/** Mask ID for display after blur (last 4 visible). */
export function maskDocumentNumber(value: string): string {
  if (!value) return "";
  const compact = value.replace(/\s/g, "");
  if (compact.length <= 4) return "•".repeat(compact.length);
  return "•".repeat(compact.length - 4) + compact.slice(-4);
}

/** Stored in DB `passengers.passport_no` column (generic government ID). */
export function formatDocumentForDb(form: PassengerFormData): string {
  const normalized = normalizeDocumentNumber(
    form.documentType,
    form.documentNumber,
  );
  const prefix =
    form.documentType === "aadhaar"
      ? "AADHAAR:"
      : form.documentType === "passport"
        ? "PASSPORT:"
        : `${form.documentType.toUpperCase()}:`;
  return `${prefix}${normalized}`;
}
