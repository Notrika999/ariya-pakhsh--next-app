export const mobileRegex = /^09\d{9}$/;

export const validateMobile = (mobile: string) => {
  return mobileRegex.test(mobile.trim());
};

export type NationalCodeValidationStatus = "empty" | "valid" | "invalid";

export type NationalCodeValidationResult = {
  status: NationalCodeValidationStatus;
  message: string | null;
};

const PERSIAN_ARABIC_DIGITS: Record<string, string> = {
  "۰": "0",
  "۱": "1",
  "۲": "2",
  "۳": "3",
  "۴": "4",
  "۵": "5",
  "۶": "6",
  "۷": "7",
  "۸": "8",
  "۹": "9",
  "٠": "0",
  "١": "1",
  "٢": "2",
  "٣": "3",
  "٤": "4",
  "٥": "5",
  "٦": "6",
  "٧": "7",
  "٨": "8",
  "٩": "9",
};

export function normalizeDigits(value: string): string {
  return value.replace(/[۰-۹٠-٩]/g, (digit) => PERSIAN_ARABIC_DIGITS[digit]);
}

export function normalizeNationalCode(value: string): string {
  return normalizeDigits(value).replace(/\D/g, "").slice(0, 10);
}

export function validateIranianNationalCode(value: string): boolean {
  const nationalCode = normalizeNationalCode(value);

  if (!/^\d{10}$/.test(nationalCode)) return false;
  if (/^(\d)\1{9}$/.test(nationalCode)) return false;

  const checkDigit = Number(nationalCode[9]);
  const sum = nationalCode
    .slice(0, 9)
    .split("")
    .reduce((total, digit, index) => total + Number(digit) * (10 - index), 0);
  const remainder = sum % 11;
  const expectedCheckDigit = remainder < 2 ? remainder : 11 - remainder;

  return checkDigit === expectedCheckDigit;
}

export function getNationalCodeValidation(
  value: string,
): NationalCodeValidationResult {
  const nationalCode = normalizeNationalCode(value);

  if (!nationalCode) {
    return { status: "empty", message: null };
  }

  if (nationalCode.length !== 10 || !validateIranianNationalCode(nationalCode)) {
    return { status: "invalid", message: "کد ملی نامعتبر است." };
  }

  return { status: "valid", message: "کد ملی تایید شد." };
}
