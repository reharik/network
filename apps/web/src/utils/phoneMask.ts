/**
 * Phone number masking: strip to digits and format for display.
 * US: +1 + 10 digits = 11 digits max. International: up to 15 digits.
 */

const MAX_DIGITS_US = 11; // +1 and 10-digit NANP
const MAX_DIGITS_INTL = 15;

/** Longest formatted string (15-digit international: "+X XXX XXX XXX XXX X") */
export const MAX_PHONE_DISPLAY_LENGTH = 20;

/** Remove everything except digits; cap US (leading 1) at 11 digits, others at 15 */
export function stripToDigits(s: string): string {
  const digits = s.replace(/\D/g, '');
  const max = digits.startsWith('1') ? MAX_DIGITS_US : MAX_DIGITS_INTL;
  return digits.slice(0, max);
}

/**
 * Format digits for display:
 * - 1–3 digits: (XXX
 * - 4–6 digits: (XXX) YYY
 * - 7–10 digits: (XXX) YYY-ZZZZ
 * - 11 digits starting with 1: +1 (XXX) YYY-ZZZZ
 * - 11+ other: +X XXX XXX XXXX...
 */
export function formatPhoneForDisplay(value: string): string {
  const digits = stripToDigits(value);
  if (digits.length === 0) return '';

  if (digits.length <= 3) {
    return `(${digits}`;
  }
  if (digits.length <= 6) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  }
  if (digits.length <= 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  if (digits.length === 11 && digits[0] === '1') {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  // International: +X XXX XXX XXXX...
  const cc = digits[0];
  const rest = digits.slice(1);
  const grouped = rest.replace(/(\d{3})(?=\d)/g, '$1 ').trim();
  return `+${cc} ${grouped}`;
}
