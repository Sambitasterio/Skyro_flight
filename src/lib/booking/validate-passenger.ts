import type { PassengerFieldErrors, PassengerFormData } from "@/types/passenger";

const PASSPORT_PATTERN = /^[A-Z0-9]{6,12}$/i;

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

  const passport = form.passportNo.trim();
  if (!passport) {
    errors.passportNo = "Passport number is required";
  } else if (!PASSPORT_PATTERN.test(passport)) {
    errors.passportNo = "Use 6–12 letters or numbers";
  }

  return errors;
}

export function hasPassengerErrors(errors: PassengerFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function maskPassport(value: string): string {
  if (!value) return "";
  if (value.length <= 4) return "•".repeat(value.length);
  return "•".repeat(value.length - 4) + value.slice(-4);
}
