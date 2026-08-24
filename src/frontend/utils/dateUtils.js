/**
 * Date and Month utility helpers for the Holiday Calendar component.
 */

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const MONTH_MAP = {
  january: 1, jan: 1,
  february: 2, feb: 2,
  march: 3, mar: 3,
  april: 4, apr: 4,
  may: 5,
  june: 6, jun: 6,
  july: 7, jul: 7,
  august: 8, aug: 8,
  september: 9, sep: 9, sept: 9,
  october: 10, oct: 10,
  november: 11, nov: 11,
  december: 12, dec: 12,
};

/**
 * Returns the exact number of days in a given month of a specific year (handles leap years).
 * @param {number} year 
 * @param {number} month - 1-indexed (1 = Jan, 2 = Feb, ..., 12 = Dec)
 */
export function getDaysInMonth(year, month) {
  if (!year || !month || month < 1 || month > 12) return 31;
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

/**
 * Validates if the given day is valid for the specified year and month.
 * e.g., Feb 30 2026 is invalid (Feb 2026 has 28 days), April 31 is invalid (April has 30 days).
 */
export function isValidDate(year, month, day) {
  if (!year || !month || !day) return false;
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;
  const maxDays = getDaysInMonth(year, month);
  return day <= maxDays;
}

/**
 * Format a number to ordinal string (e.g. 1 -> "1st", 2 -> "2nd", 4 -> "4th", 25 -> "25th", 30 -> "30th")
 */
export function getOrdinal(n) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

/**
 * Format a YYYY-MM-DD date string into a user-friendly format (e.g. "Fri, Dec 25")
 */
export function formatDate(dateString) {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC'
  });
}

/**
 * Format a YYYY-MM-DD date string into full detailed format (e.g. "Friday, December 25, 2026")
 */
export function formatFullDate(dateString) {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC'
  });
}

/**
 * Pad a number with leading zero if needed (e.g. 7 -> "07")
 */
export function padZero(num) {
  return String(num).padStart(2, '0');
}
